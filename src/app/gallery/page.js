"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Gallery() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [selectedStory, setSelectedStory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    const fetchSavedStories = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/stories?saved=true", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStories(data.stories);
        }
      } catch (error) {
        console.error("Failed to fetch gallery", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedStories();
  }, [router]);

  const handleRemove = async (e, id) => {
    e.stopPropagation(); // Prevent opening modal
    if (!confirm("Are you sure you want to remove this story from your gallery?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/stories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ savedToGallery: false })
      });

      if (res.ok) {
        setStories(prev => prev.filter(s => s._id !== id));
        if (selectedStory && selectedStory._id === id) {
          setSelectedStory(null);
        }
      }
    } catch (error) {
      console.error("Failed to remove story", error);
    }
  };

  const openStory = (story) => {
    setSelectedStory(story);
    setEditedText(story.text);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!selectedStory) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/stories/${selectedStory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text: editedText })
      });

      if (res.ok) {
        const updatedStory = await res.json();
        // Update local state
        setStories(prev => prev.map(s => s._id === selectedStory._id ? { ...s, text: editedText } : s));
        setSelectedStory(prev => ({ ...prev, text: editedText }));
        setIsEditing(false);
        alert("Story updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update story", error);
      alert("Failed to update story.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1216] text-[#E0E0E0] flex flex-col items-center px-6 py-20 relative overflow-hidden">
      {/* Floating orbs for ambiance */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#7C4DFF] opacity-20 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-[#00B4D8] opacity-20 blur-3xl rounded-full animate-pulse"></div>

      <div className="max-w-7xl w-full z-10">
        <div className="flex justify-between items-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7C4DFF] to-[#00B4D8]"
          >
            Your Gallery
          </motion.h1>
          <Link href="/upload" className="px-6 py-3 bg-[#1f2345] rounded-full hover:bg-[#2a2d3d] transition border border-white/10">
            ← Back to Create
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 animate-pulse">Loading your memories...</div>
        ) : stories.length === 0 ? (
          <div className="text-center text-gray-500 text-xl mt-20">
            <p>No saved stories yet.</p>
            <Link href="/upload" className="text-[#7C4DFF] hover:underline mt-4 inline-block">
              Create your first story
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => openStory(story)}
                className="bg-[#1a1d2c] rounded-2xl overflow-hidden shadow-lg border border-white/5 hover:border-[#7C4DFF]/50 transition duration-300 cursor-pointer"
              >
                {story.imageBase64 && (
                  <img
                    src={`data:image/jpeg;base64,${story.imageBase64}`}
                    alt="Story illustration"
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-white truncate">{story.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {story.text}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-500">
                      {new Date(story.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => handleRemove(e, story._id)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1 rounded hover:bg-red-900/20 transition"
                    >
                      Remove Saved
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedStory(null)}>
          <div className="bg-[#1a1d2c] w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-y-auto shadow-2xl border border-white/10 flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
            {/* Content Section - Full Width */}
            <div className="w-full p-8 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-white">{selectedStory.title}</h2>
                <button onClick={() => setSelectedStory(null)} className="text-gray-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="flex-grow overflow-y-auto mb-6 custom-scrollbar">
                {isEditing ? (
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full h-64 bg-[#0f1216] text-white p-4 rounded-lg border border-[#7C4DFF] focus:outline-none resize-none"
                  />
                ) : (
                  <p className="text-[#E0E0E0] text-lg leading-relaxed whitespace-pre-wrap">
                    {selectedStory.text}
                  </p>
                )}
              </div>

              {/* Client-Side TTS Controls */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => {
                    if (window.speechSynthesis.speaking) {
                      window.speechSynthesis.cancel();
                    } else {
                      const utterance = new SpeechSynthesisUtterance(selectedStory.text);
                      const voices = window.speechSynthesis.getVoices();
                      const preferredVoice = voices.find(voice => voice.name.includes("Google") || voice.name.includes("Female"));
                      if (preferredVoice) utterance.voice = preferredVoice;
                      window.speechSynthesis.speak(utterance);
                    }
                  }}
                  className="w-full py-3 rounded-lg bg-[#2a2d3d] text-[#7C4DFF] font-semibold hover:bg-[#33364a] transition flex items-center justify-center gap-2"
                >
                  <span>🔊</span> Play / Stop Narration
                </button>
              </div>

              <div className="flex gap-4 mt-auto">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#7C4DFF] to-[#00B4D8] text-black font-bold hover:brightness-110 transition"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 rounded-full bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 py-3 rounded-full bg-[#2a2d3d] text-white font-bold border border-white/10 hover:bg-[#35394b] transition"
                  >
                    Edit Story
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(124, 77, 255, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(124, 77, 255, 0.8);
        }
      `}</style>
    </div>
  );
}
