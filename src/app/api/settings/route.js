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
    const { name, email, profilePic, defaultGenre, storyLength, autoRefine, theme, audioSpeed, voice, password } = data;

    console.log("=== Settings Update Request ===");
    console.log("User ID:", decoded.id);
    console.log("Current user data:", { name: user.name, email: user.email });
    console.log("Incoming data:", { name, email, defaultGenre, storyLength, autoRefine, theme, audioSpeed, voice, profilePicLength: profilePic?.length });

    if (name) user.name = name;
    if (email) user.email = email;
    if (profilePic !== undefined) user.profilePic = profilePic;
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

    console.log("Updated user object before save:", {
      name: user.name,
      email: user.email,
      defaultGenre: user.defaultGenre,
      storyLength: user.storyLength,
      autoRefine: user.autoRefine,
      theme: user.theme,
      audioSpeed: user.audioSpeed,
      voice: user.voice,
      profilePicLength: user.profilePic?.length
    });

    const savedUser = await user.save();
    console.log("User saved successfully:", savedUser._id);

    return NextResponse.json({ message: "Settings updated successfully!", user: savedUser });
  } catch (err) {
    console.error("Settings Update Error:", err);
    return NextResponse.json({ error: "Failed to update settings: " + err.message }, { status: 500 });
  }
}
