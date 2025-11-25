import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

// Define Schema inline or import from models
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

// Singleton model
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export async function POST(req) {
    try {
        await connectDB();
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        const newContact = new Contact({ name, email, message });
        await newContact.save();

        return NextResponse.json({ message: 'Message sent successfully' }, { status: 201 });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
