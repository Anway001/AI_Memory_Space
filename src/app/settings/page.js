'use client';

import { useState } from 'react';

export default function Settings() {
  const [name, setName] = useState('Anway Kharsamble');
  const [email, setEmail] = useState('example@email.com');
  const [profilePic, setProfilePic] = useState(null);
  const [defaultGenre, setDefaultGenre] = useState('Fantasy');
  const [storyLength, setStoryLength] = useState('Short');
  const [autoRefine, setAutoRefine] = useState(false);
  const [theme, setTheme] = useState('Gradient');
  const [audioSpeed, setAudioSpeed] = useState('1x');
  const [voice, setVoice] = useState('Default');

  function handleProfilePicChange(e) {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  }

  function saveSettings() {
    alert('Settings saved successfully!');
    // Here you would send data to backend later
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1216] via-[#3a1c71] to-[#24125a] text-[#E0E0E0] py-10 md:py-16 px-4 md:px-6 flex flex-col items-center">
      <h1 className="text-3xl md:text-5xl font-extrabold text-[#7C4DFF] mb-8 text-center drop-shadow-lg">
        User Settings
      </h1>

      <div className="w-full max-w-4xl bg-[#121622cc] backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-lg border border-white/10 space-y-8">

        {/* Profile Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#B0B0B0]">Profile</h2>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#7C4DFF]"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-[#1f2345] flex items-center justify-center border-4 border-[#7C4DFF] text-[#7C4DFF] text-xl">
                  Add
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer rounded-full"
              />
            </div>
            <div className="flex-1 space-y-2 w-full">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#1f2345] text-white focus:outline-none focus:ring-2 focus:ring-[#7C4DFF]"
                placeholder="Name"
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#1f2345] text-white focus:outline-none focus:ring-2 focus:ring-[#7C4DFF]"
                placeholder="Email"
              />
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#B0B0B0]">Preferences</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#b0b7c1]">Default Genre</label>
              <select
                value={defaultGenre}
                onChange={e => setDefaultGenre(e.target.value)}
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

            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#b0b7c1]">Default Story Length</label>
              <select
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

            <div className="flex items-center space-x-3 select-none mt-6 md:mt-0">
              <input
                type="checkbox"
                checked={autoRefine}
                onChange={() => setAutoRefine(!autoRefine)}
                className="h-6 w-6 rounded border-gray-300 text-[#7C4DFF] focus:ring-[#7C4DFF]"
              />
              <label className="text-[#b0b7c1] font-semibold">
                Auto-refine descriptions
              </label>
            </div>
          </div>
        </div>

        {/* Audio Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#B0B0B0]">Audio</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#b0b7c1]">Playback Speed</label>
              <select
                value={audioSpeed}
                onChange={e => setAudioSpeed(e.target.value)}
                className="rounded-lg bg-[#1f2345] text-white p-3 focus:outline-none focus:ring-2 focus:ring-[#7C4DFF]"
              >
                <option>0.75x</option>
                <option>1x</option>
                <option>1.25x</option>
                <option>1.5x</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#b0b7c1]">Default Voice</label>
              <select
                value={voice}
                onChange={e => setVoice(e.target.value)}
                className="rounded-lg bg-[#1f2345] text-white p-3 focus:outline-none focus:ring-2 focus:ring-[#7C4DFF]"
              >
                <option>Default</option>
                <option>Male</option>
                <option>Female</option>
                <option>Robot</option>
              </select>
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#B0B0B0]">Theme</h2>
          <select
            value={theme}
            onChange={e => setTheme(e.target.value)}
            className="w-full rounded-lg bg-[#1f2345] text-white p-3 focus:outline-none focus:ring-2 focus:ring-[#7C4DFF]"
          >
            <option>Light</option>
            <option>Dark</option>
            <option>Gradient</option>
          </select>
        </div>

        {/* Security Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#B0B0B0]">Security</h2>
          <button
            className="w-full py-3 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            Change Password
          </button>
          <button
            className="w-full py-3 rounded-full bg-gray-700 text-white font-semibold hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>

        <button
          onClick={saveSettings}
          className="mt-6 w-full py-4 rounded-full text-black text-xl font-extrabold bg-gradient-to-r from-[#7C4DFF] to-[#00B4D8] hover:brightness-110 transition"
        >
          Save All Settings
        </button>

      </div>
    </div>
  );
}
