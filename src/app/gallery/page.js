export default function Gallery() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">Your Gallery</h1>
      <p className="max-w-xl text-lg text-center">
        Here you'll find all your uploaded photos and AI-generated stories. Explore your personal memory lane!
      </p>
      {/* Gallery grid will be added here later */}
    </div>
  );
}
