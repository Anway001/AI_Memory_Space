import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  profilePic: { type: String, default: "" },
  defaultGenre: { type: String, default: "Fantasy" },
  storyLength: { type: String, default: "Short" },
  autoRefine: { type: Boolean, default: false },
  theme: { type: String, default: "Gradient" },
  audioSpeed: { type: String, default: "1x" },
  voice: { type: String, default: "Default" }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
