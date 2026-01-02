"use client";

import Image from "next/image";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useAuthModal } from "@/components/auth/AuthModal";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  const { user } = useAuth();
  const { showLogin } = useAuthModal();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container flex items-center justify-between py-4">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <div >
            
            <Image
                src="/logo2.png"
                alt="Alpha Result Logo"
                width={44}
                height={44}
                className="object-contain"
                priority
            />

          </div>
          <div>
            <div className="font-extrabold text-lg text-slate-900">
              Alpha Result
            </div>
            <div className="text-xs text-slate-500">
              PYQs • Solutions • Tools
            </div>
          </div>
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex gap-8 font-medium text-slate-700">
          <Link href="/" className="hover:text-[#5B2EBD]">Home</Link>
          <Link href="/pyq" className="hover:text-[#5B2EBD]">PYQs</Link>
          <Link href="/cgpa" className="hover:text-[#5B2EBD]">CGPA</Link>
          {/* <Link href="/result" className="hover:text-[#5B2EBD]">Result</Link> */}
          <Link href="/about" className="hover:text-[#5B2EBD]">About</Link>
        </nav>

        {/* AUTH */}
        <div className="hidden md:flex">
          {!user ? (
            <button onClick={showLogin} className="btn-primary">
              Sign In
            </button>
          ) : (
            <ProfileMenu user={user} />
          )}
        </div>

        {/* MOBILE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-slate-800"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t px-6 py-4 space-y-4">
          <Link href="/" className="block">Home</Link>
          <Link href="/pyq" className="block">PYQs</Link>
          <Link href="/cgpa" className="block">CGPA</Link>
          {/* <Link href="/result" className="block">Result</Link> */}
          <Link href="/about" className="block">About</Link>

          {!user && (
            <button onClick={showLogin} className="btn-primary w-full">
              Sign In
            </button>
          )}
        </div>
      )}
    </header>
  );
}
