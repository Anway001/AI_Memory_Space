export default function ContactSection() {
  return (
    <section className="max-w-7xl mx-auto px-12 py-20">
      <h3 className="text-3xl font-bold text-[#7C4DFF] mb-10 text-center">Get In Touch</h3>
      <form className="max-w-3xl mx-auto space-y-6 bg-[#121622cc] rounded-2xl p-10 shadow-lg">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-4 rounded-lg bg-[#1d2330] text-white placeholder-[#b0b7c1] outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-4 rounded-lg bg-[#1d2330] text-white placeholder-[#b0b7c1] outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <textarea
          placeholder="Your Message"
          rows={5}
          className="w-full p-4 rounded-lg bg-[#1d2330] text-white placeholder-[#b0b7c1] outline-none focus:ring-2 focus:ring-cyan-500"
        ></textarea>
        <button className="w-full py-4 bg-gradient-to-r from-[#7C4DFF] to-[#00B4D8] font-semibold rounded-full hover:brightness-110 transition duration-200">
          Send Message
        </button>
      </form>
    </section>
  );
}
    