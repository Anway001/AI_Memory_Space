import Image from "next/image";
import Navbar from './Components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-indigo-700 text-white flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow flex flex-col md:flex-row items-center max-w-7xl mx-auto px-6 py-16 gap-12">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">Turn Your Photos Into Stories</h2>
          <p className="text-xl mb-8 max-w-md mx-auto md:mx-0">
            AI Memory Lane brings your memories to life by transforming your photos into captivating AI-generated storytelling.
          </p>
          <a 
            href="/register" 
            className="inline-block bg-white text-indigo-700 font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-gray-100 transition"
          >
            Get Started
          </a>
        </div>

        {/* Illustration */}
        <div className="flex-1">
          <img 
            src="/storytelling-illustration.svg" 
            alt="AI storytelling illustration" 
            className="w-full max-w-md mx-auto"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-800 text-center py-6 mt-auto">
        <p>© 2025 AI Memory Lane. All rights reserved.</p>
      </footer>
    </div>
    
  )
}
