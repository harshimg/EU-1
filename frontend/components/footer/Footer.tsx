import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="container py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-white font-extrabold text-xl mb-3">
            Alpha Result
          </h2>
          <p className="text-sm leading-relaxed">
            Smarter exam preparation with PYQs, solutions and tools designed
            for university students.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-3">Platform</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/pyq">PYQs</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>Help Center</li>
            <li>Privacy Policy</li>
            <li>Terms</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Stay Updated</h3>
          <div className="flex">
            <input
              className="flex-1 px-4 py-2 rounded-l-lg bg-slate-800 outline-none"
              placeholder="Email address"
            />
            <button className="px-4 py-2 bg-[#5B2EBD] text-white rounded-r-lg">
              →
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 py-4 text-center text-xs">
        © 2025 Alpha Result. All rights reserved.
      </div>
    </footer>
  );
}
