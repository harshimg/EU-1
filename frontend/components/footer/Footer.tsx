import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="container mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-white font-extrabold text-xl mb-3">
            Alpha Result
          </h2>
          <p className="text-sm leading-relaxed">
            Smarter exam preparation with PYQs, solutions, and tools designed
            especially for university students.
          </p>

          {/* CONTACT EMAIL */}
          <p className="text-sm mt-4">
            Contact us:
            <a
              href="mailto:alpharesult.in@gmail.com"
              className="ml-1 text-indigo-400 hover:text-indigo-300 underline"
            >
              alpharesult.in@gmail.com
            </a>
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-3">Platform</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/pyq" className="hover:text-white">PYQs</Link></li>
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/about" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Help Center</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Terms</li>
          </ul>
        </div>

        {/* NEWSLETTER (optional future use) */}
        <div>
          <h3 className="text-white font-semibold mb-3">Stay Updated</h3>
          <div className="flex">
            <input
              className="flex-1 px-4 py-2 rounded-l-lg bg-slate-800 outline-none text-sm"
              placeholder="Email address"
            />
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-r-lg">
              →
            </button>
          </div>
        </div>
      </div>

      {/* MOVING CREDIT BAR */}
      {/* <div className="border-t border-slate-700 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee py-4 text-sm text-slate-400">
          <span className="mx-8">
            Designed & Developed with ❤️ by Alpha Team of K.E.C Katihar
          </span>
        </div>
      </div> */}

{/* MOVING CREDIT BAR */}
<div className="border-t border-slate-700 overflow-hidden">
  <div className="whitespace-nowrap py-4 text-sm text-slate-400 animate-marquee-left">
    <span className="mx-8">
      Designed & Developed with ❤️ by Alpha Team of K.E.C Katihar
    </span>
  </div>
</div>



      <div className="text-center text-xs py-3 text-slate-500">
        © 2025 Alpha Result. All rights reserved.
      </div>
    </footer>
  );
}
