export default function GallerySection() {
  return (
    <section className="max-w-7xl mx-auto px-12 py-20 bg-[#121622cc] backdrop-blur-md rounded-3xl shadow-2xl">
      <h3 className="text-3xl font-bold text-[#7C4DFF] mb-12 text-center">Gallery Preview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto cursor-pointer">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-[#1A1A1A] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
            <img
              src="/placeholder-photo.jpg"
              alt={`Gallery image ${i}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-[#7C4DFF] font-semibold mb-2">Memory Title {i}</h3>
              <p className="text-[#b0b7c1] text-sm">Sample AI-generated story or description to inspire you.</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
