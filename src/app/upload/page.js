'use client';

import { useState, useEffect } from "react";
import styled from 'styled-jsx/style';
import { useRouter } from 'next/navigation';

function Sidebar({ onNewStory, refreshTrigger, onSelectStory }) {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("/api/stories", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStories(data.stories);
        }
      } catch (error) {
        console.error("Failed to fetch stories", error);
      }
    };

    fetchStories();
  }, [refreshTrigger]);

  return (
    <div className="sidebar">
      <button className="new-story-btn" onClick={onNewStory}>
        + New Story
      </button>
      <div className="recents">
        <h4>Recent</h4>
        <ul>
          {stories.length === 0 ? (
            <li className="recent-item text-gray-500 italic">No stories yet</li>
          ) : (
            stories.map((story) => (
              <li
                key={story._id}
                className="recent-item"
                onClick={() => onSelectStory(story)}
              >
                {story.title}
              </li>
            ))
          )}
        </ul>
      </div>
      <style jsx>{`
        .sidebar {
          background-color: #1a1d2c; /* Darker shade from palette */
          padding: 16px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          width: 260px;
          border-right: 1px solid #333;
        }
        .new-story-btn {
          background-color: #7C4DFF;
          color: white;
          border: none;
          border-radius: 24px;
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 24px;
          transition: background-color 0.2s;
          text-align: center;
        }
        .new-story-btn:hover {
          background-color: #6b3fef;
        }
        .recents h4 {
          font-size: 0.875rem;
          color: #a0a0a0;
          margin-bottom: 12px;
          padding-left: 12px;
          text-transform: uppercase;
        }
        .recents ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .recent-item {
          padding: 12px;
          border-radius: 4px;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: background-color 0.2s;
          color: #E0E0E0;
        }
        .recent-item:hover {
          background-color: #2a2d3d;
        }
      `}</style>
    </div>
  );
}

export default function Upload() {
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("Fantasy");
  const [storyLength, setStoryLength] = useState("Short");
  const [generateIllustrations, setGenerateIllustrations] = useState(false);
  const [whatIf, setWhatIf] = useState("");
  const [story, setStory] = useState(null);
  const [userAudio, setUserAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [imageCompression, setImageCompression] = useState(null);
  const [refreshRecent, setRefreshRecent] = useState(0);
  const router = useRouter();

  useEffect(() => {
    import('browser-image-compression').then(module => {
      setImageCompression(() => module.default);
    });
  }, []);

  // UPDATED: Now includes image compression
  async function handleImageChange(e) {
    if (!imageCompression) {
      alert("Image compression library is not loaded yet. Please try again in a moment.");
      return;
    }
    const files = Array.from(e.target.files);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    console.log("Compressing images...");
    setLoading(true); // Show a loading state while compressing

    try {
      const compressedFilesPromises = files.map(file => imageCompression(file, options))
      const compressedFiles = await Promise.all(compressedFilesPromises);

      const filePreviews = compressedFiles.map(file => ({
        file, // Use the new compressed file
        preview: URL.createObjectURL(file),
      }));
      setImages(prev => [...prev, ...filePreviews]);

    } catch (error) {
      console.error("Image compression failed:", error);
      alert("There was an error processing your images.");
    } finally {
      setLoading(false); // Hide loader
    }
    setStory(null);
    setUserAudio(null);
  }

  function removeImage(index) {
    setImages(prev => prev.filter((_, i) => i !== index));
  }

  function refineDescription() {
    if (!description.trim()) {
      alert("Please enter a description first.");
      return;
    }
    setDescription(prev => prev + " ...enhanced with vivid details and rich context by AI.");
  }

  // UPDATED: Now calls your real backend API
  async function handleSubmit(e) {
    e.preventDefault();
    if (images.length === 0 && !description.trim()) {
      alert("Please upload photos or enter a description.");
      return;
    }

    setLoading(true);
    setLoadingMessage("✨ Your AI is crafting a masterpiece...");
    setStory(null);

    const formData = new FormData();
    images.forEach(image => {
      formData.append('photos', image.file);
    });

    formData.append('description', description);
    formData.append('genre', genre);
    formData.append('storyLength', storyLength);
    formData.append('whatIf', whatIf);

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      let audioUrl = null;
      // The backend now sends `audioBase64`, so we create a data URL from it.
      setLoadingMessage("🎤 Generating audio narration...");
      if (result.audioBase64) {
        audioUrl = `data:audio/wav;base64,${result.audioBase64}`;
      }

      const generatedStory = {
        text: result.story,
        audioUrl: audioUrl,
        audioBase64: result.audioBase64, // Keep raw base64 for saving
        illustration: generateIllustrations ? "/illustration-sample.svg" : null,
        savedToGallery: false // Default state
      };

      // Auto-save to DB (Recent)
      const savedStory = await saveStoryToDB({
        text: result.story,
        audioBase64: result.audioBase64,
        title: `Story - ${new Date().toLocaleString()}`
      });

      if (savedStory) {
        setStory({ ...generatedStory, ...savedStory }); // Merge DB data (like _id)
        setRefreshRecent(prev => prev + 1);
      } else {
        setStory(generatedStory);
      }

    } catch (error) {
      console.error("Error generating story:", error);
      alert("Failed to generate story. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  }

  function handleUserAudioUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setUserAudio(URL.createObjectURL(file));
    }
  }

  // Helper to save/update story in DB
  async function saveStoryToDB(storyData, isSavedToGallery = false) {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...storyData,
          savedToGallery: isSavedToGallery
        })
      });
      if (res.ok) {
        const data = await res.json();
        return data.story;
      }
    } catch (error) {
      console.error("Failed to auto-save story", error);
    }
    return null;
  }

  async function handleSaveToggle() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to save stories.");
      router.push("/login");
      return;
    }

    if (!story || !story._id) return;

    const newStatus = !story.savedToGallery;

    try {
      const res = await fetch(`/api/stories/${story._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ savedToGallery: newStatus })
      });

      if (res.ok) {
        setStory(prev => ({ ...prev, savedToGallery: newStatus }));
        setRefreshRecent(prev => prev + 1); // Refresh sidebar
        if (newStatus) {
          alert("Story saved to your gallery!");
        } else {
          alert("Story removed from your gallery.");
        }
      }
    } catch (error) {
      console.error("Error toggling save status:", error);
    }
  }

  function downloadStory() {
    if (!story || !story.text) return;
    const blob = new Blob([story.text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `story.txt`;
    link.click();
  }

  function copyStory() {
    if (!story || !story.text) return;
    navigator.clipboard.writeText(story.text);
    alert("Story copied to clipboard!");
  }

  const handleNewStory = () => {
    // Reset all the state for a new story generation
    setImages([]);
    setDescription("");
    setGenre("Fantasy");
    setStoryLength("Short");
    setGenerateIllustrations(false);
    setWhatIf("");
    setStory(null);
    setUserAudio(null);
    setLoading(false);
    setLoadingMessage("");
    console.log('Starting a new story...');
  };

  const handleSelectStory = (selectedStory) => {
    // When a story is selected from the sidebar, load it into the view
    let audioUrl = null;
    if (selectedStory.audioBase64) {
      audioUrl = `data:audio/wav;base64,${selectedStory.audioBase64}`;
    }

    setStory({
      ...selectedStory,
      audioUrl: audioUrl,
      illustration: selectedStory.imageBase64 ? `data:image/jpeg;base64,${selectedStory.imageBase64}` : (generateIllustrations ? "/illustration-sample.svg" : null)
    });

    // Clear the input form so it looks like we are viewing a result
    setImages([]);
    setDescription("");
  };

  return (
    <div className="page-container">
      <Sidebar onNewStory={handleNewStory} refreshTrigger={refreshRecent} onSelectStory={handleSelectStory} />
      <div className="main-content">
        <div className="content-wrapper">
          {!story && !loading && (
            <div className="welcome-message">
              <h1 className="text-5xl font-extrabold mb-3 text-[#7C4DFF] drop-shadow-lg">
                Create a new Story
              </h1>
              <p className="text-lg text-[#B0B0B0] leading-relaxed">
                Upload photos or describe a scene to begin.
              </p>
            </div>
          )}

          {!story && (
            <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-[#121622cc] backdrop-blur-md rounded-3xl p-10 shadow-lg border border-white/10 space-y-8">
              {/* Upload Section */}
              <label
                htmlFor="file-upload"
                className="block cursor-pointer rounded-lg border-2 border-dashed border-[#7C4DFF] py-12 text-center hover:border-[#00B4D8] transition select-none"
              >
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <span className="text-[#7C4DFF] font-semibold hover:underline text-lg">
                  Click or drag-and-drop photos here to upload
                </span>
              </label>

              {/* Description Input */}
              <div>
                <label htmlFor="desc" className="block mb-2 text-[#b0b7c1] font-semibold">Or enter a photo description</label>
                <textarea
                  id="desc"
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="E.g., A couple standing on a mountain peak at sunset with a dog beside them."
                  className="w-full rounded-lg bg-[#1f2345] text-white p-4 resize-none placeholder-[#7278a5] focus:outline-none focus:ring-2 focus:ring-[#7C4DFF]"
                />
                <button
                  type="button"
                  onClick={refineDescription}
                  className="mt-2 px-5 py-2 bg-gradient-to-r from-[#7C4DFF] to-[#00B4D8] text-black font-semibold rounded-full hover:brightness-110 transition"
                >
                  Refine with AI
                </button>
              </div>

              {/* Options */}
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex flex-col flex-1 min-w-[150px]">
                  <label htmlFor="genre" className="mb-1 font-semibold text-[#b0b7c1]">Genre</label>
                  <select
                    id="genre"
                    value={genre}
                    onChange={e => setGenre(e.target.value)}
                    className="rounded-lg bg-[#1f2345] text-white p-3 focus:outline-none focus:ring-2 focus:ring-[#7C4DFF]"
                  >
                    <option>Fantasy</option>
                    <option>Romance</option>
                    <option>Mystery</option>
                    <option>Adventure</option>
                    <option>Horror</option>
                    <option>Comedy</option>
                    <option>Drama</option>
                    <option>Science Fiction</option>
                  </select>
                </div>

                <div className="flex flex-col flex-1 min-w-[150px]">
                  <label htmlFor="length" className="mb-1 font-semibold text-[#b0b7c1]">Story Length</label>
                  <select
                    id="length"
                    value={storyLength}
                    onChange={e => setStoryLength(e.target.value)}
                    className="rounded-lg bg-[#1f2345] text-white p-3 focus:outline-none focus:ring-2 focus:ring-[#7C4DFF]"
                  >
                    <option>Very Short</option>
                    <option>Short</option>
                    <option>Medium</option>
                    <option>Long</option>
                    <option>Epic</option>
                  </select>
                </div>

                <div className="flex items-center space-x-3 select-none">
                  <input
                    id="showIllustrations"
                    type="checkbox"
                    checked={generateIllustrations}
                    onChange={() => setGenerateIllustrations(!generateIllustrations)}
                    className="h-6 w-6 rounded border-gray-300 text-[#7C4DFF] focus:ring-[#7C4DFF]"
                  />
                  <label htmlFor="showIllustrations" className="text-[#b0b7c1] font-semibold">
                    Generate Story Illustrations
                  </label>
                </div>
              </div>

              {/* Images Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-6 mt-8">
                  {images.map(({ preview }, i) => (
                    <div key={i} className="relative rounded-2xl shadow-xl bg-[#1E2541CC] p-5 flex flex-col items-center hover:scale-105 transition">
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs"
                      >
                        ✕
                      </button>
                      <img
                        src={preview}
                        alt={`preview-${i}`}
                        className="rounded-lg object-cover w-full h-36 mb-4 shadow-lg"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* What-if Input */}
              <div>
                <label className="text-[#b0b7c1] font-semibold mb-1 block">
                  Enter a What-if scenario for your story (optional):
                </label>
                <input
                  type="text"
                  placeholder="E.g., What if the dog could talk?"
                  value={whatIf}
                  onChange={e => setWhatIf(e.target.value)}
                  className="w-full rounded-lg bg-[#1f2345] text-white p-3 placeholder-[#7278a5] focus:outline-none focus:ring-2 focus:ring-[#7C4DFF]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (images.length === 0 && !description.trim())}
                className={`w-full py-4 rounded-full text-black text-xl font-extrabold transition ${loading || (images.length === 0 && !description.trim())
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#7C4DFF] to-[#00B4D8] hover:brightness-110"
                  }`}
              >
                {loading ? 'Generating...' : 'Generate Memories'}
              </button>
            </form>
          )}

          {/* Loader and Story Output */}
          <div className="w-full max-w-3xl mt-8">
            {loading && loadingMessage && (
              <div className="text-center text-lg text-[#B0B0B0] animate-pulse mt-6">
                {loadingMessage}
              </div>
            )}

            {story && (
              <div className="mt-8 rounded-2xl shadow-xl bg-[#1E2541CC] p-5 flex flex-col items-center">
                <p className="text-base mb-3 text-[#b0b7c1] text-left px-2 whitespace-pre-wrap">{story.text}</p>
                {story.illustration && (
                  <img
                    src={story.illustration}
                    alt="Generated Illustration"
                    className="mb-3 rounded-lg shadow-md w-full"
                  />
                )}

                {/* Client-Side TTS Controls */}
                <div className="w-full mb-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.speechSynthesis.speaking) {
                        window.speechSynthesis.cancel();
                      } else {
                        const utterance = new SpeechSynthesisUtterance(story.text);
                        // Optional: Select a better voice if available
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

                <div className="flex gap-2 w-full">
                  <button
                    type="button"
                    onClick={handleSaveToggle}
                    className={`flex-1 py-2 rounded-full font-semibold transition ${story.savedToGallery
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gradient-to-r from-[#7C4DFF] to-[#00B4D8] text-black hover:brightness-110"
                      }`}
                  >
                    {story.savedToGallery ? "Remove Saved" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={downloadStory}
                    className="flex-1 py-2 rounded-full bg-[#444] text-white font-semibold hover:bg-[#666] transition"
                  >
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx global>{`
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            'Helvetica Neue', Arial, sans-serif;
          background-color: #0f1216;
        }
      `}</style>
      <style jsx>{`
        .page-container {
          display: flex;
          height: 100vh;
          color: #E0E0E0;
        }
        .main-content {
          flex-grow: 1;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .content-wrapper {
          width: 100%;
          max-width: 48rem; /* 768px */
        }
        .welcome-message {
          text-align: center;
          margin: 15vh 0;
        }
      `}</style>
    </div >
  );
}
