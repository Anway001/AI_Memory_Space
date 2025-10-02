"use client";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (res.status === 201 || res.status === 200) {
        alert("🎉 Registration successful! Please log in.");
        router.push("/login"); // navigate to login
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1216] relative overflow-hidden px-4">
      {/* Glowing ambient shapes */}
      <div className="absolute top-12 left-12 w-80 h-80 rounded-full bg-[#7C4DFF] opacity-20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-16 right-16 w-80 h-80 rounded-full bg-[#00B4D8] opacity-20 blur-3xl pointer-events-none"></div>

      {/* Glass-like card */}
      <div className="relative z-10 bg-[#121622cc] backdrop-blur-md rounded-3xl p-10 max-w-lg w-full shadow-lg border border-white/10">
        <h2 className="text-4xl font-extrabold text-[#7C4DFF] mb-6 text-center">
          Create Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C4DFF] to-[#00B4D8]">
            Memory Lane
          </span>
        </h2>
        <p className="text-[#B0B0B0] mb-8 text-center">
          Your memories deserve epic stories. Let’s make them timeless together ✨
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-[#B0B0B0]">Name</span>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 rounded-lg bg-[#1f2345] text-white placeholder-[#7278a5] focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] border border-transparent transition"
              required
            />
          </label>

          <label className="block">
            <span className="text-[#B0B0B0]">Email</span>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 rounded-lg bg-[#1f2345] text-white placeholder-[#7278a5] focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] border border-transparent transition"
              required
            />
          </label>

          <label className="block">
            <span className="text-[#B0B0B0]">Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 rounded-lg bg-[#1f2345] text-white placeholder-[#7278a5] focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] border border-transparent transition"
              required
            />
          </label>

          <label className="block">
            <span className="text-[#B0B0B0]">Confirm Password</span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 rounded-lg bg-[#1f2345] text-white placeholder-[#7278a5] focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] border border-transparent transition"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#7C4DFF] to-[#00B4D8] text-black font-bold hover:brightness-110 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-[#9E9E9E]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#7C4DFF] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
