import { connectDB } from "@/lib/db";
import Story from "@/models/story";
import User from "@/models/user";
import jwt from "jsonwebtoken";

// Helper to authenticate and get user
async function authenticate(req) {
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
}

export async function PUT(req, { params }) {
    console.log(`PUT /api/stories/${params.id} called`);

    const userId = await authenticate(req);
    if (!userId) {
        console.log("Authentication failed");
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    let body;
    try {
        body = await req.json();
    } catch (e) {
        console.error("Failed to parse JSON body:", e);
        return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    }

    const { savedToGallery, text, title } = body;
    console.log(`Updating story ${id} for user ${userId}. Data:`, { savedToGallery, title, textLength: text?.length });

    try {
        await connectDB();
        console.log("DB Connected");

        const story = await Story.findOne({ _id: id, userId });
        if (!story) {
            console.log("Story not found or user mismatch");
            return NextResponse.json({ message: "Story not found" }, { status: 404 });
        }

        if (savedToGallery !== undefined) story.savedToGallery = savedToGallery;
        if (text !== undefined) story.text = text;
        if (title !== undefined) story.title = title;

        await story.save();
        console.log("Story updated successfully");

        // Return only necessary fields to avoid hitting Vercel's 4MB response limit
        const sanitizedStory = {
            _id: story._id,
            title: story.title,
            text: story.text,
            savedToGallery: story.savedToGallery,
            createdAt: story.createdAt
        };

        return NextResponse.json({ message: "Story updated", story: sanitizedStory }, { status: 200 });
    } catch (error) {
        console.error("Error updating story:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const userId = await authenticate(req);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    try {
        await connectDB();

        const story = await Story.findOneAndDelete({ _id: id, userId });
        if (!story) {
            return NextResponse.json({ message: "Story not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Story deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting story:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
