'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch('/api/settings', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setFormData(prev => ({
                        ...prev,
                        name: data.name || '',
                        email: data.email || ''
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch user data', error);
            }
        };

        fetchUserData();
    }, []);

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
                setFormData(prev => ({ ...prev, message: '' }));
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="bg-transparent text-[#E0E0E0] py-12 md:py-20">
            <div className="flex items-center justify-center p-4 md:p-6 w-full max-w-7xl mx-auto">
                <div className="w-full max-w-4xl flex flex-col md:flex-row bg-[#1a1d2c] rounded-3xl shadow-2xl overflow-hidden border border-white/5">

                    {/* Info Section */}
                    <div className="md:w-1/3 bg-gradient-to-br from-[#7C4DFF] to-[#00B4D8] p-6 md:p-10 text-white flex flex-col justify-center">
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
