import { NextResponse } from 'next/server';
import { pipeline } from '@xenova/transformers';
import { WaveFile } from 'wavefile'; // Corrected import

// --- LOCAL SERVER CONFIGURATION ---
const OLLAMA_API_URL = "http://127.0.0.1:11434/api/generate";
const MULTIMODAL_MODEL = "llava:latest";

// --- HELPER FUNCTIONS ---

/**
 * Generates a story by sending images and a text prompt to a multimodal model.
 * @param {string} prompt - The text part of the prompt.
 * @param {Buffer[]} imageBuffers - An array of image files as Buffers.
 * @returns {Promise<string>} The generated story text.
 */
const generateStoryFromImagesAndText = async (prompt, imageBuffers) => {
  console.log(`\n--- GENERATING STORY WITH MULTIMODAL PROMPT ---\n${prompt}\n-----------------------------------\n`);
  // Convert image buffers to base64 strings for Ollama API
  const images = imageBuffers.map(buffer => {
    // Ensure we're getting a clean base64 string
    const base64String = buffer.toString('base64');
    console.log(`Image buffer length: ${buffer.length}, base64 length: ${base64String.length}`);
    console.log(`Base64 preview: ${base64String.substring(0, 50)}...`);
    return base64String;
  });

  console.log(`Sending request to Ollama with ${images.length} images`);
  console.log(`Model: ${MULTIMODAL_MODEL}`);
  console.log(`Prompt length: ${prompt.length} characters`);

  try {
    // Use the generate API format for LLaVA
    const requestBody = {
        model: MULTIMODAL_MODEL,
        prompt: prompt,
        images: images,
        stream: false,
    };

    console.log(`Trying request with ${images.length} images`);
    console.log(`Request body: ${JSON.stringify(requestBody).substring(0, 300)}...`);

    const response = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
    });

    console.log(`Response status: ${response.status}`);
    console.log(`Response status text: ${response.statusText}`);

    if (!response.ok) {
        const errorText = await response.text();
        console.log(`Error response: ${errorText}`);
        throw new Error(`Ollama API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`Response data: ${JSON.stringify(data).substring(0, 500)}...`);

    // Handle different response formats
    if (data.message && data.message.content) {
        return data.message.content.trim();
    } else if (data.response) {
        return data.response.trim();
    } else if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content.trim();
    } else {
        console.log("Unexpected response format:", data);
        return "Could not generate a story - unexpected response format.";
    }
  } catch (error) {
    console.error("Error generating story with Ollama:", error);
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
    
    const masterPrompt = `
You are a creative storyteller. I have uploaded an image that I want you to analyze and create a story about.

FIRST, carefully analyze what you see in the image(s). Describe what you observe in detail, then create a story based on that analysis.

IMPORTANT: The story must be based on the ACTUAL CONTENT of the image(s), not random fantasy elements.

Story requirements:
- Genre: '${genre}'
- Length: '${storyLength}'
- Additional Scene Description: '${description || 'None'}'
- What If Scenario: '${whatIf || 'None'}'

If the image shows data visualization, algorithms, or technical content, create a story that incorporates those elements in a meaningful way. Begin the story directly after your analysis.
`;

    const finalStory = await generateStoryFromImagesAndText(masterPrompt, imageBuffers);

    let audioBase64 = null;
    if (finalStory && !finalStory.startsWith("Error:")) {
        audioBase64 = await generateAudioFromText(finalStory);
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
