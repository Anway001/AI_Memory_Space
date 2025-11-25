const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDF3g1pz6UOAvf6B0ByG16UMsKEMqczvg0";

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        if (data.models) {
            const flashModel = data.models.find(m => m.name.includes("gemini-1.5-flash"));
            if (flashModel) {
                console.log("FOUND FLASH MODEL:");
                console.log(`Name: ${flashModel.name}`);
                console.log(`Supported Methods: ${flashModel.supportedGenerationMethods.join(", ")}`);
            } else {
                console.log("gemini-1.5-flash NOT FOUND. Available models:");
                data.models.forEach(m => console.log(m.name));
            }
        } else {
            console.log("No models found.");
        }

    } catch (error) {
        console.error("Error fetching models:", error);
    }
}

listModels();
