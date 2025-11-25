'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1216] text-[#E0E0E0] flex flex-col relative overflow-hidden">


            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7C4DFF] opacity-10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00B4D8] opacity-10 blur-[120px] rounded-full animate-pulse"></div>
            </div>

            <div className="flex-grow flex items-center justify-center p-4 md:p-6 z-10 w-full">
                <div className="w-full max-w-4xl flex flex-col md:flex-row bg-[#1a1d2c] rounded-3xl shadow-2xl overflow-hidden border border-white/5">

                    {/* Info Section */}
                    <div className="md:w-1/3 bg-gradient-to-br from-[#7C4DFF] to-[#00B4D8] p-6 md:p-10 text-white flex flex-col justify-between">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                            <p className="text-white/80 leading-relaxed mb-8">
                                Have questions, feedback, or just want to say hello? We&apos;d love to hear from you.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📧</span>
                                    <span className="font-medium">support@aimemory.lan</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📍</span>
                                    <span className="font-medium">Digital Realm, Server 42</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <Link href="/" className="text-white/70 hover:text-white text-sm font-semibold flex items-center gap-2 transition">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="md:w-2/3 p-6 md:p-10 bg-[#1a1d2c]">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-[#0f1216] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7C4DFF] focus:ring-1 focus:ring-[#7C4DFF] transition"
                                    placeholder="Your Name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-[#0f1216] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7C4DFF] focus:ring-1 focus:ring-[#7C4DFF] transition"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full bg-[#0f1216] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7C4DFF] focus:ring-1 focus:ring-[#7C4DFF] transition resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className={`w-full py-3 rounded-lg font-bold text-lg transition ${status === 'sending'
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[#7C4DFF] to-[#00B4D8] text-black hover:brightness-110'
                                    }`}
                            >
                                {status === 'sending' ? 'Sending...' : 'Send Message'}
                            </button>

                            {status === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-lg bg-green-500/20 text-green-400 text-center border border-green-500/30"
                                >
                                    Message sent successfully! We&apos;ll get back to you soon.
                                </motion.div>
                            )}

                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-lg bg-red-500/20 text-red-400 text-center border border-red-500/30"
                                >
                                    Failed to send message. Please try again later.
                                </motion.div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
