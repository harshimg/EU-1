"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";

export default function ForgotPasswordForm({
  showReset,
  showLogin,
}: {
  showReset: (email: string) => void;
  showLogin: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSendOtp() {
    if (!email) return;

    setLoading(true);
    try {
      await apiPost("/auth/forgot-password", { email });
      setSent(true);
      showReset(email);
    } catch {
      // intentionally silent
      setSent(true);
      showReset(email);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Forgot Password</h2>

      <p className="text-sm text-slate-400 mb-4">
        Enter your registered email. We’ll send an OTP to reset your password.
      </p>

      <input
        className="input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="btn-primary w-full mt-4"
        disabled={loading || !email}
        onClick={handleSendOtp}
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>

      <div className="text-sm mt-4 flex justify-between">
        <button
          className="flex items-center gap-1 text-primary font-semibold"
          onClick={showLogin}
        >
          <span aria-hidden>←</span>
          Back to login
        </button>
      </div>
    </div>
  );
}
