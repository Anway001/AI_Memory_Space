import { connectDB } from "@/lib/db";
import Story from "@/models/story";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Helper to get user ID from token
const getUserIdFromToken = (req) => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id;
    } catch (error) {
        return null;
    }
};

export async function POST(req) {
    try {
        await connectDB();
        const userId = getUserIdFromToken(req);

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { text, audioBase64, imageBase64, title, savedToGallery } = await req.json();

        if (!text) {
            return NextResponse.json({ message: "Story text is required" }, { status: 400 });
        }

        // Create a title if not provided, maybe from the first few words
        const finalTitle = title || text.substring(0, 30) + "...";

        const newStory = new Story({
            userId,
            title: finalTitle,
            text,
            audioBase64,
            imageBase64,
            savedToGallery: savedToGallery || false
        });

        await newStory.save();

        return NextResponse.json({ message: "Story saved successfully", story: newStory }, { status: 201 });

    } catch (error) {
        console.error("Error saving story:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await connectDB();
        const userId = getUserIdFromToken(req);

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const savedOnly = searchParams.get("saved") === "true";

        const query = { userId };
        if (savedOnly) {
            query.savedToGallery = true;
        }

        // Fetch stories for this user, sorted by newest first
        const stories = await Story.find(query).sort({ createdAt: -1 });

        console.log(`GET /api/stories: Found ${stories.length} stories for user ${userId}. SavedOnly: ${savedOnly}`);

        // Filter out duplicates based on title
        const uniqueStories = [];
        const seenTitles = new Set();

        for (const story of stories) {
            if (!seenTitles.has(story.title)) {
                uniqueStories.push(story);
                seenTitles.add(story.title);
            }
        }

        return NextResponse.json({ stories: uniqueStories }, { status: 200 });

    } catch (error) {
        console.error("Error fetching stories:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
