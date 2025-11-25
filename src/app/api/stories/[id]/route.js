import { NextResponse } from "next/server";
import mongoose from "mongoose";
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
    const userId = await authenticate(req);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { savedToGallery, text, title } = await req.json();

    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const story = await Story.findOne({ _id: id, userId });
        if (!story) {
            return NextResponse.json({ message: "Story not found" }, { status: 404 });
        }

        if (savedToGallery !== undefined) story.savedToGallery = savedToGallery;
        if (text !== undefined) story.text = text;
        if (title !== undefined) story.title = title;

        await story.save();

        return NextResponse.json({ message: "Story updated", story }, { status: 200 });
    } catch (error) {
        console.error("Error updating story:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const userId = await authenticate(req);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    try {
        await mongoose.connect(process.env.MONGODB_URI);

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
