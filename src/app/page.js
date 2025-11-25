"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FeaturesSection from "./Components/FeaturesSection";
import ContactSection from "./Components/ContactSection";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#0f1216] text-[#E0E0E0] flex flex-col relative overflow-hidden">
      {/* Floating gradient orbs for background ambiance */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#7C4DFF] opacity-20 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-[#00B4D8] opacity-20 blur-3xl rounded-full animate-pulse"></div>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-28 space-y-12 md:space-y-0 md:space-x-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex flex-col justify-center text-center md:text-left"
        >
          <h2 className="text-3xl md:text-6xl font-extrabold leading-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C4DFF] to-[#00B4D8]">
              Turn Your Photos
            </span>
            <br />
            <span className="text-white">Into Captivating Stories</span>
          </h2>
          <p className="max-w-lg text-[#b0b7c1] mb-8 tracking-wide text-base md:text-lg leading-relaxed mx-auto md:mx-0">
            AI Memory Lane brings your memories to life by transforming your
            photos into uniquely crafted stories powered by AI.
          </p>
          <button
            onClick={() => {
              const token = localStorage.getItem("token");
              if (token) {
                router.push("/upload");
              } else {
                router.push("/login");
              }
            }}
            className="inline-block bg-gradient-to-r from-[#7C4DFF] to-[#00B4D8] text-center text-black font-bold px-8 md:px-14 py-3 md:py-4 rounded-full shadow-lg hover:scale-105 hover:brightness-110 transition transform duration-300 cursor-pointer text-lg"
          >
            Get Started 🚀
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 rounded-3xl overflow-hidden shadow-[0px_0px_40px_rgba(124,77,255,0.3)] w-full"
        >
          <img
            src="/storytelling-illustration.svg"
            alt="Storytelling illustration"
            className="w-full h-auto"
            loading="lazy"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section
        id="features"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10"
      >
        <FeaturesSection />
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10"
      >
        <ContactSection />
      </motion.section>

      {/* Footer */}
      <footer className="bg-[#121622cc] backdrop-blur-md text-center py-6 text-[#a0a7b7] tracking-wider border-t border-white/10 relative z-10">
        <p>© 2025 AI Memory Lane. All rights reserved.</p>
      </footer>
    </div>
  );
}
