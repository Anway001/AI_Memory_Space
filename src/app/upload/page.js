export default function Upload() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-indigo-700 text-white flex flex-col items-center py-16 px-6">
      <h1 className="text-4xl font-bold mb-3">Upload Photos & Create Memories</h1>
      <p className="max-w-xl text-lg mb-8 text-center">
        Select one or more photos below. Our AI will generate creative captions and stories to preserve your moments in your personal gallery!
      </p>
      <form className="mb-8 w-full max-w-lg flex flex-col items-center">
        {/* Stylish dropzone for images */}
        <input
          type="file"
          multiple
          accept="image/*"
          className="bg-white text-gray-900 p-4 rounded shadow-lg mb-4 w-full"
        />
        {/* Preview area can be added here */}
        <button
          type="submit"
          className="bg-indigo-600 px-8 py-3 mt-4 rounded font-bold hover:bg-indigo-800 transition"
        >
          Generate Story
        </button>
      </form>

      {/* Features summary */}
      <div className="bg-white/20 rounded-lg p-6 max-w-xl w-full mb-4">
        <h2 className="text-2xl font-bold mb-2">What Happens Next?</h2>
        <ul className="text-lg list-disc ml-6 space-y-2">
          <li>AI Caption for each photo</li>
          <li>AI-generated short stories (or “What-if” stories)</li>
          <li>Optional audio narration (toggle)</li>
          <li>Downloadable memory cards</li>
          <li>Memories saved in your personal gallery</li>
        </ul>
      </div>
      <p className="text-sm text-indigo-100 mt-auto max-w-lg text-center">
        Your photos remain private and secure. Only you can view or share your memories.
      </p>
    </div>
  );
}
