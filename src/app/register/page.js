export default function Register() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700 relative overflow-hidden">
      {/* Background subtle waves */}
      <div className="absolute inset-0 bg-[url('/waves.svg')] bg-cover bg-center opacity-20"></div>

      {/* Card */}
      <div className="relative z-10 rounded-2xl bg-white/95 shadow-2xl max-w-lg w-full mx-4 px-8 py-10 border border-indigo-100">
        {/* Illustration */}
        <div className="mb-4 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 via-indigo-400 to-teal-300 p-[2px] shadow-lg">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <img
                src="/storytelling-illustration.svg"
                alt="Memory Lane registration"
                className="w-16 h-16"
              />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Create Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-400">
            Memory Lane
          </span>
        </h2>
        <p className="mb-6 text-sm text-gray-600 text-center leading-relaxed">
          Your memories deserve epic stories. Let’s make them timeless together ✨
        </p>

        {/* Form */}
        <form className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition bg-white text-gray-800 placeholder-gray-400"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition bg-white text-gray-800 placeholder-gray-400"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none transition bg-white text-gray-800 placeholder-gray-400"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition bg-white text-gray-800 placeholder-gray-400"
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="mt-4 w-full py-2.5 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-400 text-white text-lg font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ease-out"
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-sm text-gray-600 text-center">
          Already have an account?
          <a
            href="/login"
            className="ml-1 text-indigo-600 font-semibold hover:underline hover:text-purple-600"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
