"use client";
import { useState } from "react";
import { apiPost } from "@/lib/api";
import GoogleLoginButton from "./GoogleLoginButton";

export default function SignupForm({ showLogin, showOtp }: any) {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    semester: "",
    branch: "",
    mobile: "",
    reg_no: "",
  });

  async function handleSignup() {
    try {
      await apiPost("/auth/signup", data);
      showOtp(data.email);
      alert("OTP sent to your email");
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold text-center">
        Create Account
      </h2>
      <p className="text-sm text-gray-500 text-center">
        Join Alpha Result and prepare smarter
      </p>

      {/* BASIC INFO */}
      <div className="space-y-3">
        <input
          className="input"
          placeholder="Full Name"
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <input
          className="input"
          placeholder="Email Address"
          type="email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <input
          className="input"
          placeholder="Password"
          type="password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
      </div>

      {/* ACADEMIC INFO */}
      <div className="grid grid-cols-2 gap-3">
        <input
          className="input"
          placeholder="Semester"
          onChange={(e) => setData({ ...data, semester: e.target.value })}
        />
        <input
          className="input"
          placeholder="Branch"
          onChange={(e) => setData({ ...data, branch: e.target.value })}
        />
      </div>

      {/* CONTACT */}
      <div className="grid grid-cols-2 gap-3">
        <input
          className="input"
          placeholder="Mobile"
          onChange={(e) => setData({ ...data, mobile: e.target.value })}
        />
        <input
          className="input"
          placeholder="Registration No."
          onChange={(e) => setData({ ...data, reg_no: e.target.value })}
        />
      </div>

      {/* CTA */}
      <button className="btn-primary w-full mt-4" onClick={handleSignup}>
        Sign Up
      </button>

      {/* DIVIDER */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-xs text-gray-500">OR</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      <GoogleLoginButton />

      <p className="text-sm text-center mt-4">
        Already have an account?
        <button
          className="text-primary font-semibold ml-1"
          onClick={showLogin}
        >
          Login
        </button>
      </p>
    </div>
  );
}
