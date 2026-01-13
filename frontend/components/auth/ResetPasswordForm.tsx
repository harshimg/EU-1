"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";

export default function ResetPasswordForm({
  email,
  showLogin,
  showForgot,
  hide,
}: {
  email: string;
  showLogin: () => void;
  showForgot: () => void;
  hide: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  async function handleReset() {
    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiPost("/auth/reset-password", {
        email,
        otp,
        new_password: password,
      });

      hide();
      showLogin();
      alert("Password reset successful. Please login.");

    } catch (e: any) {
      setError(e.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Reset Password</h2>

      <p className="text-sm text-slate-400 mb-3">
        Enter the OTP sent to your email and set a new password.
      </p>

      {/* Email (readonly) */}
      <div className="mb-3">
        <label className="text-xs text-slate-400">Email</label>
        <div className="flex items-center gap-2">
          <input
            className="input flex-1 bg-[#0F1629]"
            value={email}
            disabled
          />
          <button
            onClick={showForgot}
            className="text-xs text-primary"
          >
            Change
          </button>
        </div>
      </div>

      {/* OTP */}
      <input
        className="input"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      {/* New password */}
      <div className="relative mt-3">
        <input
          className="input pr-12"
          type={showPwd ? "text" : "password"}
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPwd(!showPwd)}
          className="absolute right-3 top-2.5 text-xs text-slate-400"
        >
          {showPwd ? "Hide" : "Show"}
        </button>
      </div>

      {/* Confirm password */}
      <input
        className={`input mt-3 ${
          confirmPassword && !passwordsMatch ? "border-red-500" : ""
        }`}
        type={showPwd ? "text" : "password"}
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {error && (
        <p className="text-xs text-red-400 mt-2">{error}</p>
      )}

      <button
        className="btn-primary w-full mt-4"
        disabled={loading || !otp || !password || !confirmPassword}
        onClick={handleReset}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>

      <div className="text-sm mt-4">
        <button
          className="text-primary"
          onClick={showLogin}
        >
          Back to login
        </button>
      </div>
    </div>
  );
}
