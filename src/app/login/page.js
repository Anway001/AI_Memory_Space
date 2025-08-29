export default function Login() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[url('/waves.svg')] bg-cover bg-center opacity-20"></div>

      {/* Login Card */}
      <div className="relative z-10 rounded-2xl bg-white/95 shadow-2xl max-w-md w-full mx-4 px-8 py-10 border border-indigo-100">
        {/* Illustration */}
        <div className="mb-4 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-400 via-indigo-400 to-teal-300 p-[2px] shadow-lg">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <img
                src="/storytelling-illustration.svg"
                alt="Login Illustration"
                className="w-12 h-12"
              />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Welcome Back 👋
        </h2>
        <p className="mb-6 text-sm text-gray-600 text-center leading-relaxed">
          Log in to continue your journey down memory lane.
        </p>

        {/* Login Form */}
        <form className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition bg-white text-gray-800 placeholder-gray-400"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition bg-white text-gray-800 placeholder-gray-400"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="mt-4 w-full py-2.5 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-400 text-white text-lg font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ease-out"
          >
            Log In
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-sm text-gray-600 text-center">
          Don’t have an account?
          <a
            href="/register"
            className="ml-1 text-indigo-600 font-semibold hover:underline hover:text-purple-600"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
