"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useAuthModal } from "@/components/auth/AuthModal";

export default function HomePage() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const { user } = useAuth();
  const { showLogin } = useAuthModal();

  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch(`${API_URL}/`);
        const json = await res.json();
        setBackendStatus(json.message || "Connected");
      } catch {
        setBackendStatus("Offline");
      }
    }
    checkBackend();
  }, []);

  return (
    <div className="space-y-8">

      {/* HERO */}
      <section className="mt-10">
        <div className="hero">
          <h1 className="text-5xl font-extrabold mb-4">
            Prepare Smarter with Alpha Result
          </h1>

          <p className="text-lg opacity-90 max-w-xl">
            Past Year Questions, Objective Tests, Step-by-Step Solutions —
            all in one place.
          </p>

          <div className="mt-6 flex gap-4">
            <a href="/pyq" className="btn-accent">
              Browse PYQs
            </a>

            <a href="/cgpa" className="btn-outline">
              SGPA / CGPA
            </a>

            <a href="/result" className="btn-outline">
              Result
            </a>

            {!user && (
              <button onClick={showLogin} className="btn-outline">
                Sign In
              </button>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="font-semibold">PYQ Browser</h3>
          <p className="text-sm text-slate-500 mt-2">
            Filter by semester & branch.
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="font-semibold">Math-friendly Solutions</h3>
          <p className="text-sm text-slate-500 mt-2">
            Clean, exam-oriented explanations.
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="font-semibold">SGPA / CGPA Calculator</h3>
          <p className="text-sm text-slate-500 mt-2">
            Calculate results as per university rules.
          </p>
        </div>

      </section>

    </div>
  );
}
