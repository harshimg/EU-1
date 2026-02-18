"use client";

import { useState } from "react";
import {
    Youtube,
    Send,
    Linkedin,
    ArrowUpRight,
    Instagram,
    MessageCircle
  } from "lucide-react";
  

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    setSuccess("");

    // 🔹 Later connect with backend API
    setTimeout(() => {
      setSuccess("Your message has been sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-r from-[#5B2EBD] to-[#7C4DFF] text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-3 text-lg opacity-90">
            Have questions, suggestions, or feedback? We’d love to hear from you.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10">

          {/* CONTACT FORM */}
          {/* <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6 text-slate-800">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              <input
                type="text"
                name="name"
                placeholder="Your Name *"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B2EBD]"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email *"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B2EBD]"
              />

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B2EBD]"
              />

              <textarea
                name="message"
                placeholder="Your Message *"
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B2EBD]"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5B2EBD] text-white py-3 rounded-lg font-semibold hover:bg-[#4a23a0] transition disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              {success && (
                <p className="text-green-600 text-sm mt-2">
                  {success}
                </p>
              )}
            </form>
          </div> */}

          {/* CONTACT INFO */}
          <div className="space-y-6">

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-lg mb-3 text-slate-800">
                📧 Email
              </h3>
              <p className="text-slate-600">
                alpharesult@gmail.com
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-lg mb-3 text-slate-800">
                🌐 Website
              </h3>
              <p className="text-slate-600">
                www.alpharesult.in
              </p>
            </div>


                            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-lg mb-5 text-slate-800">
                    📢 Follow AlphaResult on
                </h3>

                <div className="space-y-4">

                    {/* WhatsApp */}
                    <a
                    href="https://whatsapp.com/channel/0029VbBtQTgB4hdbSEAEY52G"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-3 rounded-xl
                                hover:bg-green-50 transition"
                    >
                    <div className="flex items-center gap-3">

                        {/* Real WhatsApp Icon */}
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#25D366"
                        className="w-5 h-5"
                        >
                        <path d="M20.52 3.48A11.94 11.94 0 0 0 12.06 0C5.49 0 .09 5.4.09 11.97c0 2.11.55 4.17 1.6 5.99L0 24l6.19-1.63a11.9 11.9 0 0 0 5.87 1.5h.01c6.57 0 11.97-5.4 11.97-11.97 0-3.2-1.25-6.2-3.52-8.42ZM12.06 21.7c-1.8 0-3.56-.48-5.11-1.39l-.36-.21-3.68.97.98-3.59-.24-.37a9.8 9.8 0 0 1-1.51-5.13c0-5.41 4.41-9.82 9.83-9.82 2.62 0 5.08 1.02 6.93 2.87a9.73 9.73 0 0 1 2.89 6.95c0 5.41-4.41 9.82-9.83 9.82Zm5.39-7.36c-.29-.14-1.72-.85-1.99-.95-.27-.1-.47-.14-.66.14-.19.29-.76.95-.93 1.14-.17.19-.34.21-.63.07-.29-.14-1.22-.45-2.32-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.12-.59.12-.12.29-.31.43-.47.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.66-1.6-.91-2.19-.24-.58-.49-.5-.66-.51-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.43 1.02 2.81 1.16 3 .14.19 2 3.06 4.85 4.29.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.12.55-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.33Z"/>
                        </svg>

                        <span className="relative text-slate-700 font-medium
                                        after:absolute after:left-0 after:-bottom-1
                                        after:h-[2px] after:w-0 after:bg-green-600
                                        after:transition-all after:duration-300
                                        group-hover:after:w-full">
                        WhatsApp Channel
                        </span>
                    </div>

                    <ArrowUpRight
                        size={18}
                        className="text-green-600 opacity-0 group-hover:opacity-100 transition"
                    />
                    </a>

                    {/* Instagram */}
                    <a
                    href="https://instagram.com/alpharesult.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-3 rounded-xl
                                hover:bg-pink-50 transition"
                    >
                    <div className="flex items-center gap-3">
                        <Instagram className="text-pink-600" size={20} />
                        <span className="relative text-slate-700 font-medium
                                        after:absolute after:left-0 after:-bottom-1
                                        after:h-[2px] after:w-0 after:bg-pink-600
                                        after:transition-all after:duration-300
                                        group-hover:after:w-full">
                        Instagram
                        </span>
                    </div>

                    <ArrowUpRight
                        size={18}
                        className="text-pink-600 opacity-0 group-hover:opacity-100 transition"
                    />
                    </a>

                    {/* YouTube */}
                    <a
                    href="https://www.youtube.com/@alpharesult"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-3 rounded-xl
                                hover:bg-red-50 transition"
                    >
                    <div className="flex items-center gap-3">
                        <Youtube className="text-red-600" size={20} />
                        <span className="relative text-slate-700 font-medium
                                        after:absolute after:left-0 after:-bottom-1
                                        after:h-[2px] after:w-0 after:bg-red-600
                                        after:transition-all after:duration-300
                                        group-hover:after:w-full">
                        YouTube
                        </span>
                    </div>

                    <ArrowUpRight
                        size={18}
                        className="text-red-600 opacity-0 group-hover:opacity-100 transition"
                    />
                    </a>

                    {/* Telegram */}
                    <a
                    href="https://t.me/alpha_result"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-3 rounded-xl
                                hover:bg-blue-50 transition"
                    >
                    <div className="flex items-center gap-3">
                        <Send className="text-blue-500" size={20} />
                        <span className="relative text-slate-700 font-medium
                                        after:absolute after:left-0 after:-bottom-1
                                        after:h-[2px] after:w-0 after:bg-blue-500
                                        after:transition-all after:duration-300
                                        group-hover:after:w-full">
                        Telegram
                        </span>
                    </div>

                    <ArrowUpRight
                        size={18}
                        className="text-blue-500 opacity-0 group-hover:opacity-100 transition"
                    />
                    </a>

                    {/* LinkedIn */}
                    <a
                    href="https://www.linkedin.com/company/alpharesult"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-3 rounded-xl
                                hover:bg-sky-50 transition"
                    >
                    <div className="flex items-center gap-3">
                        <Linkedin className="text-sky-600" size={20} />
                        <span className="relative text-slate-700 font-medium
                                        after:absolute after:left-0 after:-bottom-1
                                        after:h-[2px] after:w-0 after:bg-sky-600
                                        after:transition-all after:duration-300
                                        group-hover:after:w-full">
                        LinkedIn
                        </span>
                    </div>

                    <ArrowUpRight
                        size={18}
                        className="text-sky-600 opacity-0 group-hover:opacity-100 transition"
                    />
                    </a>

                </div>
                </div>


                        </div>
                        </div>
                    </section>
                    </div>
                );
                }
