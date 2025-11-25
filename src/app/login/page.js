"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      if (res.status === 200) {
        alert("Login successful!");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("name", res.data.user.name);
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1216] relative overflow-hidden px-4">
      {/* Passive glowing shapes for ambiance */}
      <div className="absolute top-12 left-12 w-72 h-72 rounded-full bg-[#7C4DFF] opacity-20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-16 right-16 w-72 h-72 rounded-full bg-[#00B4D8] opacity-20 blur-3xl pointer-events-none"></div>

      {/* Glassmorphic Card */}
      <div className="relative z-10 bg-[#121622cc] backdrop-blur-md rounded-3xl p-10 max-w-md w-full shadow-lg border border-white/10">
        <h2 className="text-4xl font-extrabold text-[#7C4DFF] mb-6 text-center">
          Welcome Back 👋
        </h2>
        <p className="text-[#B0B0B0] mb-8 text-center">
          Log in to continue your journey down memory lane.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-[#B0B0B0]">Email</span>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-lg bg-[#1f2345] text-white placeholder-[#7278a5] 
              focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] border border-transparent transition"
              required
            />
          </label>
          <label className="block">
            <span className="text-[#B0B0B0]">Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-lg bg-[#1f2345] text-white placeholder-[#7278a5] 
              focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] border border-transparent transition"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#7C4DFF] to-[#00B4D8] 
            text-black font-bold hover:brightness-110 transition duration-300"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-[#9E9E9E]">
          Don’t have an account?{" "}
          <Link href="/register" className="text-[#7C4DFF] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
