const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDF3g1pz6UOAvf6B0ByG16UMsKEMqczvg0";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // There isn't a direct "listModels" on the client instance in the Node SDK easily accessible 
        // without using the model manager, but let's try to just run a simple generation with a different model name
        // or use the correct way to list if possible. 
        // Actually, the error message suggested calling ListModels.
        // In the Node SDK, it's not always straightforward.

        // Let's try to just test a known working model name.
        console.log("Testing gemini-1.5-flash-latest...");
        const modelLatest = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await modelLatest.generateContent("Hello");
        console.log("gemini-1.5-flash-latest works!");
    } catch (error) {
        console.error("Error with gemini-1.5-flash-latest:", error.message);
    }

    try {
        console.log("Testing gemini-pro...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await modelPro.generateContent("Hello");
        console.log("gemini-pro works!");
    } catch (error) {
        console.error("Error with gemini-pro:", error.message);
    }
}

listModels();
