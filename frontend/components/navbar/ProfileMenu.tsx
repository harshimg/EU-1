"use client";
import Link from "next/link";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";

export default function ProfileMenu({ user }: any) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      {/* PROFILE ICON BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-yellow-400
                   flex items-center justify-center
                   shadow hover:scale-105 transition"
      >
        {/* USER ICON */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-black"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5zM6 13.5a6 6 0 0112 0v.75a.75.75 0 01-.75.75h-10.5a.75.75 0 01-.75-.75v-.75z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="absolute right-0 mt-3 w-48 bg-white
                     rounded-xl shadow-xl border
                     overflow-hidden animate-scaleIn z-50"
        >
          {/* USER INFO */}
          <div className="px-4 py-3 border-b">
            <p className="font-semibold text-gray-800">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>

            {/* ACTIONS */}
            <Link href="/account">
              <button
                className="w-full text-left px-4 py-3 text-sm
                          hover:bg-gray-100 transition"
              >
                Account
              </button>
            </Link>

          <button
            onClick={logout}
            className="w-full text-left px-4 py-3 text-sm
                       text-red-600 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
