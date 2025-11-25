import mongoose from "mongoose";

let isConnected = false;
const MONGODB_URI = process.env.MONGODB_URI
console.log("ENV FILES LOADED:", process.env.MONGODB_URI ? "YES" : "NO");



export async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: "aimemory",
    });

    console.log(" MongoDB connected:", conn.connection.host);
  } catch (err) {
    console.error(" MongoDB connection error:", err.message);
    throw new Error("Database connection failed");
  }
}
