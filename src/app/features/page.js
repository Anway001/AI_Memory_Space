export default function Features() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">Features</h1>
      <ul className="text-lg max-w-xl">
        <li className="mb-4">📸 Upload & store your favorite photos securely.</li>
        <li className="mb-4">✨ AI-powered caption and story generation.</li>
        <li className="mb-4">📒 Personal memory lane gallery for each user.</li>
        <li className="mb-4">🔈 Optional audio narration.</li>
        <li className="mb-4">⬇️ Download and share beautiful memory cards.</li>
        <li className="mb-4">🔐 All data private and secure.</li>
      </ul>
    </div>
  );
}
