import jwt from "jsonwebtoken";
import user from "@/models/user";
import { connectDB } from "./db";


export async function verifyToken(req) {
    const authUser = req.headers.get("Authorization");
    if (!authUser) return null;

    const token = authUser.split(" ")[1];
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        await connectDB();
        const user = await user.findById(decoded.id).select("-password");
        return user;
    } catch (error) {
        return null;
    }
}