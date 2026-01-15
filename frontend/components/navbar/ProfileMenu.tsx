"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function ProfileMenu({ user }: any) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on outside click (desktop)
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
      {/* PROFILE BUTTON (VISIBLE ON WHITE NAV) */}
      <button
        onClick={() => setOpen(true)}
        className="
          w-10 h-10 rounded-full
          bg-white border border-gray-300
          flex items-center justify-center
          shadow-sm hover:bg-gray-100
          transition
        "
      >
        {/* USER ICON */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-gray-700"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5zM6 13.5a6 6 0 0112 0v.75a.75.75 0 01-.75.75h-10.5a.75.75 0 01-.75-.75v-.75z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* ================= DESKTOP DROPDOWN ================= */}
      {open && (
        <div
          className="
            hidden md:block
            absolute right-0 mt-3 w-48
            bg-white rounded-xl shadow-xl
            border border-gray-200
            overflow-hidden z-50
            animate-scaleIn
          "
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
            <button className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100">
              Account
            </button>
          </Link>

          <button
            onClick={() => {logout(),  router.push("/");}}  
            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
          >
            Logout
        </button>
        </div>
      )}

      {/* ================= MOBILE BOTTOM SHEET ================= */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/40">
          <div
            className="
              absolute bottom-0 left-0 right-0
              bg-white rounded-t-2xl
              p-4 shadow-xl
              animate-slideUp
            "
          >
            {/* HANDLE */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

            {/* USER INFO */}
            <div className="mb-4 text-center">
              <p className="font-semibold text-gray-800">
                {user?.name || "User"}
              </p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            <Link href="/account">
              <button
                onClick={() => setOpen(false)}
                className="w-full py-3 text-left rounded-lg hover:bg-gray-100"
              >
                Account
              </button>
            </Link>

            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full py-3 text-left rounded-lg text-red-600 hover:bg-red-50"
            >
              Logout
            </button>

            <button
              onClick={() => setOpen(false)}
              className="w-full py-3 mt-2 text-center text-gray-500 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
