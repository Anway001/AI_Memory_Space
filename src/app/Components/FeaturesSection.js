export default function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-12 py-20">
      <h3 className="text-3xl font-bold text-[#7C4DFF] mb-10 text-center">Features</h3>
      <div className="grid md:grid-cols-3 gap-10">
        {[
          {
            icon: "📷",
            title: "Seamless Upload",
            desc: "Upload your photos easily and securely."
          },
          {
            icon: "🤖",
            title: "AI-Powered Stories",
            desc: "Our AI generates immersive narratives from your images."
          },
          {
            icon: "🔒",
            title: "Privacy Focused",
            desc: "Your memories are safe with end-to-end encryption."
          }
        ].map(({ icon, title, desc }, i) => (
          <div key={i} className="p-6 bg-[#121622cc] rounded-2xl shadow-lg hover:shadow-cyan-600/50 transition cursor-pointer">
            <div className="text-5xl mb-6">{icon}</div>
            <h4 className="text-xl font-semibold mb-2">{title}</h4>
            <p className="text-[#b0b7c1]">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
