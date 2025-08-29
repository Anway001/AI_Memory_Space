export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md">
      {/* Logo */}
      <h1 className="text-2xl font-bold cursor-pointer">AI Memory Lane</h1>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-8 text-lg">
        <a href="/" className="hover:underline">Home</a>
        <a href="/about" className="hover:underline">About</a>
        <a href="/features" className="hover:underline">Features</a>
        <a href="/gallery" className="hover:underline">Gallery</a>
        <a href="/contact" className="hover:underline">Contact</a>
      </div>

      {/* Auth Buttons */}
      <div className="space-x-6 text-lg">
        <a href="/login" className="hover:underline">Login</a>
        <a href="/register" className="hover:underline">Register</a>
      </div>
    </nav>
  );
}
