"use client";
import { useState } from "react";
import { apiPost } from "@/lib/api";
import { useAuthModal } from "./AuthModal";

export default function OtpVerifyForm({ email }: any) {
  const [otp, setOtp] = useState("");
  const { showLogin } = useAuthModal();

  async function handleVerify() {
    try {
      await apiPost("/auth/verify-email", { email, otp });
      alert("Email verified! Please login now.");
      showLogin();
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Verify Email</h2>
      <p className="text-sm mb-2">An OTP was sent to {email}</p>

      <input
        className="input"
        placeholder="Enter OTP"
        onChange={(e) => setOtp(e.target.value)}
      />

      {/* <button className="btn w-full mt-3" onClick={handleVerify}>Verify</button> */}
      {/* <button className="btn-primary w-full mt-4" onClick={handleVerify}>
        Verify
      </button> */}

      <button
        onClick={handleVerify}
        className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
      >
        Verify OTP
      </button>


    </div>
  );
}
