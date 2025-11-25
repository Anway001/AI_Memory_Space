"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        try {
          const res = await fetch("/api/settings", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUserName(data.name || "U");
          }
        } catch (error) {
          console.error("Failed to fetch user profile", error);
        }
      }
    };
    checkAuth();
  }, []);

  const ProfileIcon = () => {
    if (!userName) return null; // Don't show until name is loaded
    const initial = userName.charAt(0).toUpperCase();
    return (
      <Link href="/settings" className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#7C4DFF] to-[#00B4D8] text-white font-bold text-lg shadow-lg hover:scale-105 transition">
        {initial}
      </Link>
    );
  };

  return (
    <nav className="w-full z-50 bg-[#0f1216]/80 backdrop-blur-md border-b border-white/10 sticky top-0">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold text-[#7C4DFF] tracking-tight">
            AI Memory Lane
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-[#E0E0E0] hover:text-[#7C4DFF] transition font-medium">
              Home
            </Link>
            <Link href="/gallery" className="text-[#E0E0E0] hover:text-[#7C4DFF] transition font-medium">
              Gallery
            </Link>
            <Link href="/settings" className="text-[#E0E0E0] hover:text-[#7C4DFF] transition font-medium">
              Settings
            </Link>
            <Link href="/contact" className="text-[#E0E0E0] hover:text-[#7C4DFF] transition font-medium">
              Contact
            </Link>
            {isLoggedIn && <ProfileIcon />}
          </div>

          {/* Mobile Header Controls */}
          <div className="md:hidden flex items-center gap-4">
            {isLoggedIn && <ProfileIcon />}
            <button
              className="text-white text-2xl focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#1a1d2c] border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 space-y-4">
              <Link
                href="/"
                className="text-[#E0E0E0] hover:text-[#7C4DFF] font-medium text-lg"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/gallery"
                className="text-[#E0E0E0] hover:text-[#7C4DFF] font-medium text-lg"
                onClick={() => setIsOpen(false)}
              >
                Gallery
              </Link>
              <Link
                href="/settings"
                className="text-[#E0E0E0] hover:text-[#7C4DFF] font-medium text-lg"
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
              <Link
                href="/contact"
                className="text-[#E0E0E0] hover:text-[#7C4DFF] font-medium text-lg"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
