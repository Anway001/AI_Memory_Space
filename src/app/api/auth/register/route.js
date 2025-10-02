import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

// POST: Register a new user
export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    await connectDB();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPass });

    return new Response(JSON.stringify({ message: "User registered", user }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}

// GET: View all users
export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select("-password"); // Exclude password field
    return new Response(JSON.stringify({ users }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
