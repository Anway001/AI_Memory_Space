import { NextResponse } from 'next/server';
import { pipeline } from '@xenova/transformers';
import { WaveFile } from 'wavefile'; // Corrected import

// --- LOCAL SERVER CONFIGURATION ---
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- GOOGLE GEMINI CONFIGURATION ---
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// --- HELPER FUNCTIONS ---

/**
 * Generates a story by sending images and a text prompt to Google Gemini.
 * @param {string} prompt - The text part of the prompt.
 * @param {Buffer[]} imageBuffers - An array of image files as Buffers.
 * @returns {Promise<string>} The generated story text.
 */
const generateStoryFromImagesAndText = async (prompt, imageBuffers) => {
  console.log(`\n--- GENERATING STORY WITH GEMINI ---\n${prompt}\n-----------------------------------\n`);

  try {
    // Prepare images for Gemini
    const images = imageBuffers.map(buffer => ({
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: "image/jpeg", // Assuming JPEG, but Gemini supports others too. Ideally detect mime type.
      },
    }));

    console.log(`Sending request to Gemini with ${images.length} images`);

    const result = await model.generateContent([prompt, ...images]);
    const response = await result.response;
    const text = response.text();

    console.log(`Response from Gemini: ${text.substring(0, 100)}...`);

    // Post-processing to clean up the story
    let cleanText = text;

    // 1. If Gemini included a separator like ***, the story is usually after it.
    if (cleanText.includes("***")) {
      const parts = cleanText.split("***");
      cleanText = parts[parts.length - 1];
    }

    // 2. Remove "Image Analysis" or "Analysis" headers if they snuck in
    cleanText = cleanText.replace(/###\s*Image Analysis/gi, "");
    cleanText = cleanText.replace(/###\s*Analysis/gi, "");

    // 3. Remove Markdown formatting (headers, bold, italic) to ensure plain text
    cleanText = cleanText.replace(/[#*]/g, "");

    // 4. Remove empty lines at the start
    cleanText = cleanText.trim();

    return cleanText;

  } catch (error) {
    console.error("Error generating story with Gemini:", error);
    return "Error: Could not generate the story.";
  }
};

/**
 * A singleton class to ensure the TTS model is loaded only once.
 * This improves performance by avoiding model re-initialization on every API call.
 */
class TtsPipeline {
  static instance = null;

  static async getInstance() {
    if (this.instance === null) {
      console.log("Loading TTS model for the first time... (This may take a minute)");
      // Using a self-contained model that does not require a separate vocoder
      this.instance = await pipeline('text-to-speech', 'Xenova/mms-tts-eng');
      console.log("TTS model loaded successfully.");
    }
    return this.instance;
  }
}

/**
 * Convert generated waveform to a proper downloadable WAV file
 */
const generateAudioFromText = async (text) => {
  try {
    const synthesizer = await TtsPipeline.getInstance();

    console.log("Generating audio waveform with local TTS model...");
    const { audio: wavData, sampling_rate } = await synthesizer(text);

    // The output from the model is a Float32Array. We need to convert it to 16-bit PCM
    // that the wavefile library can work with.
    const pcm16Data = new Int16Array(wavData.length);
    for (let i = 0; i < wavData.length; i++) {
      let s = Math.max(-1, Math.min(1, wavData[i])); // Clamp to -1.0 to 1.0
      pcm16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF; // Scale to 16-bit integer range
    }

    // Encode PCM into WAV using wavefile
    let wav = new WaveFile();
    wav.fromScratch(1, sampling_rate, '16', pcm16Data);

    // Get the final WAV file as a Buffer
    const wavBuffer = Buffer.from(wav.toBuffer());

    return wavBuffer.toString('base64');

  } catch (error) {
    console.error("Error generating audio with local TTS:", error);
    return null;
  }
};

// --- API ENDPOINT ---
export async function POST(request) {
  try {
    const formData = await request.formData();
    const description = formData.get('description');
    const genre = formData.get('genre');
    const storyLength = formData.get('storyLength');
    const whatIf = formData.get('whatIf');
    const photos = formData.getAll('photos');

    const imageBufferPromises = photos.map(async (photo, index) => {
      console.log(`Processing photo ${index + 1}:`, {
        name: photo.name,
        type: photo.type,
        size: photo.size
      });

      const arrayBuffer = await photo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log(`Photo ${index + 1} buffer:`, {
        arrayBufferLength: arrayBuffer.byteLength,
        bufferLength: buffer.length,
        firstBytes: buffer.subarray(0, 10)
      });

      return buffer;
    });
    const imageBuffers = await Promise.all(imageBufferPromises);

    let lengthInstruction = "";
    switch (storyLength) {
      case "Very Short":
        lengthInstruction = "Strictly under 100 words.";
        break;
      case "Short":
        lengthInstruction = "Approximately 200 words.";
        break;
      case "Medium":
        lengthInstruction = "Approximately 400 words.";
        break;
      case "Long":
        lengthInstruction = "Approximately 800 words.";
        break;
      case "Epic":
        lengthInstruction = "Detailed and extensive, over 1000 words.";
        break;
      default:
        lengthInstruction = "Approximately 300 words.";
    }

    const masterPrompt = `
You are a creative storyteller. I have uploaded an image that I want you to analyze and create a story about.

1. Analyze the image carefully to understand the context, mood, and details.
2. Create a story based on this analysis.

IMPORTANT OUTPUT RULES:
- Output ONLY the story. Do NOT include your analysis or description of the image in the final output.
- Do NOT use Markdown formatting (no #, *, **, etc.). Return plain text only.
- Provide a creative Title on the first line, then a blank line, then the story.

Story requirements:
- Genre: '${genre}'
- Length: '${storyLength}' (${lengthInstruction})
- Additional Scene Description: '${description || 'None'}'
- What If Scenario: '${whatIf || 'None'}'

If the image shows data visualization, algorithms, or technical content, create a story that incorporates those elements in a meaningful way.
`;

    const finalStory = await generateStoryFromImagesAndText(masterPrompt, imageBuffers);

    let audioBase64 = null;
    if (finalStory && !finalStory.startsWith("Error:")) {
      // Truncate story for audio generation to prevent timeout/hanging on long texts
      const maxAudioLength = 600;
      const textForAudio = finalStory.length > maxAudioLength
        ? finalStory.substring(0, maxAudioLength) + "..."
        : finalStory;

      console.log(`Generating audio for ${textForAudio.length} characters (truncated from ${finalStory.length})...`);
      audioBase64 = await generateAudioFromText(textForAudio);
    }

    return NextResponse.json({
      story: finalStory,
      audioBase64: audioBase64
    });

  } catch (error) {
    console.error("Error in generate-story API:", error);
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 });
  }
}
