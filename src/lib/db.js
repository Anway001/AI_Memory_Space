import mongoose from "mongoose";

let isConnected = false;
const MONGODB_URI = process.env.MONGODB_URI
console.log("ENV FILES LOADED:", process.env.MONGODB_URI ? "YES" : "NO");



export async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: "aimemory",   // <-- this makes sure your DB name is always correct
    });

    isConnected = true;
    console.log(" MongoDB connected:", conn.connection.host);
  } catch (err) {
    console.error(" MongoDB connection error:", err.message);
    throw new Error("Database connection failed");
  }
}
