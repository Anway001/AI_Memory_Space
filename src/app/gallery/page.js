"use client";
import { motion } from "framer-motion";

export default function Gallery() {
  return (
    <div className="min-h-screen bg-[#0f1216] text-[#E0E0E0] flex flex-col items-center px-6 py-20 relative overflow-hidden">
      {/* Floating orbs for ambiance */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#7C4DFF] opacity-20 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-[#00B4D8] opacity-20 blur-3xl rounded-full animate-pulse"></div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#7C4DFF] to-[#00B4D8]"
      >
        Your Gallery
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="max-w-3xl text-lg text-[#9E9E9E] mb-16 text-center leading-relaxed"
      >
        Explore your collection of cherished photos and AI-crafted stories.  
        Your personal memory lane, always accessible and beautifully organized.
      </motion.p>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl w-full relative z-10">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: item * 0.1 }}
            className="bg-[#121622cc] backdrop-blur-md rounded-2xl shadow-lg border border-white/10 p-4 flex flex-col items-center text-center hover:scale-105 hover:shadow-[0_0_30px_rgba(124,77,255,0.4)] transition-all duration-300"
          >
            <motion.img
              src="/anway.jpg"
              alt={`Memory ${item}`}
              className="w-full h-48 object-cover rounded-xl mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
            <h3 className="text-lg font-semibold text-[#7C4DFF] mb-2">
              Memory Title {item}
            </h3>
            <p className="text-[#b0b7c1] text-sm">
              AI-generated story or caption goes here to tell the tale behind this memory.
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
