import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// --- LOCAL SERVER CONFIGURATION ---
import { GoogleGenerativeAI } from "@google/generative-ai";

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

// --- API ENDPOINT ---
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

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

    // Audio generation removed to fix Vercel deployment issues
    let audioBase64 = null;

    return NextResponse.json({
      story: finalStory,
      audioBase64: audioBase64
    });

  } catch (error) {
    console.error("Error in generate-story API:", error);
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 });
  }
}
