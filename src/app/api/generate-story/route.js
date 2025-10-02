import { NextResponse } from 'next/server';
import { pipeline } from '@xenova/transformers';
import { WaveFile } from 'wavefile'; // Corrected import

// --- LOCAL SERVER CONFIGURATION ---
const OLLAMA_API_URL = "http://127.0.0.1:11434/api/generate";
const MULTIMODAL_MODEL = "llava";

// --- HELPER FUNCTIONS ---

/**
 * Generates a story by sending images and a text prompt to a multimodal model.
 * @param {string} prompt - The text part of the prompt.
 * @param {Buffer[]} imageBuffers - An array of image files as Buffers.
 * @returns {Promise<string>} The generated story text.
 */
const generateStoryFromImagesAndText = async (prompt, imageBuffers) => {
  console.log(`\n--- GENERATING STORY WITH MULTIMODAL PROMPT ---\n${prompt}\n-----------------------------------\n`);
  const images = imageBuffers.map(buffer => buffer.toString('base64'));
  try {
    const response = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: MULTIMODAL_MODEL,
            prompt: prompt,
            images: images,
            stream: false,
        }),
    });
    if (!response.ok) throw new Error(`Ollama multimodal API error: ${response.statusText}`);
    const data = await response.json();
    return data.response?.trim() || "Could not generate a story.";
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

    const imageBufferPromises = photos.map(async (photo) => {
        const arrayBuffer = await photo.arrayBuffer();
        return Buffer.from(arrayBuffer);
    });
    const imageBuffers = await Promise.all(imageBufferPromises);
    
    const masterPrompt = `
You are a creative storyteller. Based on the image(s) provided, write a single, cohesive story.
Your story must follow these requirements:
- Genre: '${genre}'
- Length: '${storyLength}'

Incorporate the following user-provided details into the narrative:
- Additional Scene Description: '${description || 'None'}'
- A 'What If' Scenario to explore: '${whatIf || 'None'}'

Analyze the images deeply and weave all these elements together into an imaginative story. Begin the story directly.
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
