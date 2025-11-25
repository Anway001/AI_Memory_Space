const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const storySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String },
    text: { type: String },
    savedToGallery: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Story = mongoose.models.Story || mongoose.model("Story", storySchema);

async function debugStories() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));

        const stories = await Story.find({}).sort({ createdAt: -1 });
        console.log(`Found ${stories.length} stories.`);

        stories.forEach(s => {
            console.log(`ID: ${s._id}, Title: ${s.title.substring(0, 20)}..., Saved: ${s.savedToGallery}, Created: ${s.createdAt}`);
        });

        // Check for duplicates
        const titleCounts = {};
        stories.forEach(s => {
            titleCounts[s.title] = (titleCounts[s.title] || 0) + 1;
        });

        console.log("\nPotential Duplicates:");
        for (const [title, count] of Object.entries(titleCounts)) {
            if (count > 1) {
                console.log(`"${title}": ${count} times`);
            }
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

debugStories();
