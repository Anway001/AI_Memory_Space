"use client";
import { useState, useEffect } from 'react';

export default function Settings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [defaultGenre, setDefaultGenre] = useState('Fantasy');
  const [storyLength, setStoryLength] = useState('Short');
  const [autoRefine, setAutoRefine] = useState(false);
  const [theme, setTheme] = useState('Gradient');
  const [audioSpeed, setAudioSpeed] = useState('1x');
  const [voice, setVoice] = useState('Default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('/api/settings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setName(data.name || '');
          setEmail(data.email || '');
          setDefaultGenre(data.defaultGenre || 'Fantasy');
          setStoryLength(data.storyLength || 'Short');
          setAutoRefine(data.autoRefine || false);
          setTheme(data.theme || 'Gradient');
          setAudioSpeed(data.audioSpeed || '1x');
          setVoice(data.voice || 'Default');
        }
      } catch (error) {
        console.error('Failed to fetch settings', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  async function saveSettings() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to save settings.');
      return;
    }

    const payload = {
      name,
      email,
      defaultGenre,
      storyLength,
      autoRefine,
      theme,
      audioSpeed,
      voice
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Settings saved successfully!');
        window.location.reload();
      } else {
        const data = await res.json();
        alert(`Failed to save settings: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to save settings', error);
      alert('An error occurred while saving: ' + error.message);
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-[#0f1216] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1216] via-[#3a1c71] to-[#24125a] text-[#E0E0E0] flex flex-col relative overflow-hidden">
      <div className="flex-grow flex flex-col items-center py-10 md:py-16 px-4 md:px-6 overflow-y-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#7C4DFF] mb-8 text-center drop-shadow-lg">
          User Settings
        </h1>

        <div className="w-full max-w-4xl bg-[#121622cc] backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-lg border border-white/10 space-y-8 mb-10">

          {/* Profile Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#B0B0B0]">Profile</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#1f2345] text-white focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] border border-white/5"
                  placeholder="Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#1f2345] text-white focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] border border-white/5"
                  placeholder="Email"
                />
              </div>
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Preferences Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#B0B0B0]">Preferences</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label className="mb-2 font-semibold text-[#b0b7c1]">Default Genre</label>
                <select
                  value={defaultGenre}
                  onChange={e => setDefaultGenre(e.target.value)}
                  className="rounded-lg bg-[#1f2345] text-white p-3 focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] border border-white/5"
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
                <label className="mb-2 font-semibold text-[#b0b7c1]">Default Story Length</label>
                <select
                  value={storyLength}
                  onChange={e => setStoryLength(e.target.value)}
                  className="rounded-lg bg-[#1f2345] text-white p-3 focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] border border-white/5"
                >
                  <option>Very Short</option>
                  <option>Short</option>
                  <option>Medium</option>
                  <option>Long</option>
                  <option>Epic</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 select-none mt-6 md:mt-8">
                <input
                  type="checkbox"
                  checked={autoRefine}
                  onChange={() => setAutoRefine(!autoRefine)}
                  className="h-5 w-5 rounded border-gray-300 text-[#7C4DFF] focus:ring-[#7C4DFF] cursor-pointer"
                />
                <label className="text-[#b0b7c1] font-semibold cursor-pointer" onClick={() => setAutoRefine(!autoRefine)}>
                  Auto-refine descriptions
                </label>
              </div>
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Audio Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#B0B0B0]">Audio</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="mb-2 font-semibold text-[#b0b7c1]">Playback Speed</label>
                <select
                  value={audioSpeed}
                  onChange={e => setAudioSpeed(e.target.value)}
                  className="rounded-lg bg-[#1f2345] text-white p-3 focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] border border-white/5"
                >
                  <option>0.75x</option>
                  <option>1x</option>
                  <option>1.25x</option>
                  <option>1.5x</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-2 font-semibold text-[#b0b7c1]">Default Voice</label>
                <select
                  value={voice}
                  onChange={e => setVoice(e.target.value)}
                  className="rounded-lg bg-[#1f2345] text-white p-3 focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] border border-white/5"
                >
                  <option>Default</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Robot</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Theme Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#B0B0B0]">Theme</h2>
            <select
              value={theme}
              onChange={e => setTheme(e.target.value)}
              className="w-full rounded-lg bg-[#1f2345] text-white p-3 focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] border border-white/5"
            >
              <option>Light</option>
              <option>Dark</option>
              <option>Gradient</option>
            </select>
          </div>

          <hr className="border-white/10" />

          {/* Security Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#B0B0B0]">Security</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                className="w-full py-3 rounded-full bg-red-500/20 text-red-400 border border-red-500/50 font-semibold hover:bg-red-500/30 transition"
              >
                Change Password
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
                className="w-full py-3 rounded-full bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
              >
                Logout
              </button>
            </div>
          </div>

          <button
            onClick={saveSettings}
            className="mt-8 w-full py-4 rounded-full text-black text-xl font-extrabold bg-gradient-to-r from-[#7C4DFF] to-[#00B4D8] hover:brightness-110 transition shadow-[0_0_20px_rgba(124,77,255,0.4)]"
          >
            Save All Settings
          </button>

        </div>
      </div>
    </div>
  );
}
