import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // your DB connection
import User from "@/models/user"; // Mongoose user model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// GET - fetch default settings
export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// POST - update settings, including password
export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();

    const data = await req.json();
    const user = await User.findById(decoded.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Update basic settings
    const { name, defaultGenre, storyLength, autoRefine, theme, audioSpeed, voice, password } = data;
    if (name) user.name = name;
    if (defaultGenre) user.defaultGenre = defaultGenre;
    if (storyLength) user.storyLength = storyLength;
    if (autoRefine !== undefined) user.autoRefine = autoRefine;
    if (theme) user.theme = theme;
    if (audioSpeed) user.audioSpeed = audioSpeed;
    if (voice) user.voice = voice;

    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return NextResponse.json({ message: "Settings updated successfully!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
