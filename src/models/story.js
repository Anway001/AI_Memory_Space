import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        default: "Untitled Story"
    },
    text: {
        type: String,
        required: true
    },
    audioBase64: {
        type: String
    },
    // We might want to store the image as a base64 string or a URL if uploaded to cloud storage.
    // For now, based on the current app structure, we'll store the base64 if it's small enough, 
    // or just the text description if images are too large for Mongo documents (16MB limit).
    // Given the context, let's store the imageBase64 if available, but be mindful of size.
    // Or better, just the text content for now as requested "save it... in the users gallery".
    // The user request implies saving the result.
    imageBase64: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    savedToGallery: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Standard Next.js/Mongoose singleton pattern
const Story = mongoose.models.Story || mongoose.model("Story", storySchema);

export default Story;
