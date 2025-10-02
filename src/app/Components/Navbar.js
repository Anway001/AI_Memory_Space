"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUser } from "react-icons/fi"; 

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name"); // store name at login
    setIsLoggedIn(!!token);
    if (name) setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center bg-[#161a22cc] backdrop-blur-md shadow-md px-12 py-4">
      <h1 className="text-2xl font-extrabold cursor-pointer text-[#7C4DFF]">
        <Link href="/">AI Memory Lane</Link>
      </h1>

      <div className="hidden md:flex space-x-10 text-[#a0a7b7]">
        <Link href="/" className="hover:text-[#7C4DFF] font-semibold">
          Home
        </Link>
        <Link href="/#features" className="hover:text-[#7C4DFF] font-semibold">
          Features
        </Link>
        <Link href="/gallery" className="hover:text-[#7C4DFF] font-semibold">
          Gallery
        </Link>
        <Link href="/#contact" className="hover:text-[#7C4DFF] font-semibold">
          Contact
        </Link>
      </div>

      <div className="relative hidden md:flex items-center space-x-6">
        {!isLoggedIn ? (
          <>
            <Link
              href="/login"
              className="px-5 py-2 rounded-full font-semibold text-[#7C4DFF] border border-[#7C4DFF] hover:bg-[#7C4DFF] hover:text-black transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-[#7C4DFF] to-[#00B4D8] px-5 py-2 rounded-full font-semibold text-black hover:brightness-110 transition"
            >
              Register
            </Link>
          </>
        ) : (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-[#7C4DFF] border border-[#7C4DFF] hover:bg-[#7C4DFF] hover:text-black transition"
            >
              <FiUser size={20} />
              {userName || "User"}
              <span>▼</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#121622cc] backdrop-blur-md border border-white/10 rounded-xl shadow-lg text-[#a0a7b7]">
                <button
                  onClick={() => router.push("/settings")}
                  className="w-full text-left px-4 py-2 hover:bg-[#7C4DFF] hover:text-black rounded-t-xl transition"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-[#7C4DFF] hover:text-black rounded-b-xl transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
