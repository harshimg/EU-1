"use client";

import { useEffect, useState } from "react";
import { apiPost } from "@/lib/api";
import { API_URL } from "@/lib/api";
import GoogleLoginButton from "./GoogleLoginButton";


import { SEMESTERS } from "@/lib/constants/academic";
import { BRANCHES } from "@/lib/constants/academic";

const semesters = SEMESTERS;
const branches = BRANCHES;


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

  // const [semesters, setSemesters] = useState<any[]>([]);
  // const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD SEM & BRANCH (PUBLIC) ---------------- */
  // useEffect(() => {
  //   fetch(`${API_URL}/api/public/semester`)
  //     .then(res => res.json())
  //     .then(json => setSemesters(json.data || []));

  //   fetch(`${API_URL}/api/public/branch`)
  //     .then(res => res.json())
  //     .then(json => setBranches(json.data || []));
  // }, []);

  async function handleSignup() {
    try {
      setLoading(true);

      if (!data.email || !data.password || !data.semester || !data.branch || !data.mobile || !data.reg_no) {
        alert("Please fill all required fields");
        return;
      }

        //Email check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert("Please enter a valid email address");
      return;
    }

        // ✅ MOBILE VALIDATION (10 digits only)
    if (!/^\d{10}$/.test(data.mobile)) {
      alert("Mobile number must be exactly 10 digits");
      return;
    }

    if (!/^\d{11}$/.test(data.reg_no)) {
      alert("Invalid Registration  No.");
      return;
    }


      await apiPost("/auth/signup", data);

      alert("OTP sent to your email");
      showOtp(data.email); // ✅ switch view, keep modal open
    } catch (e: any) {
      alert(e.message || "Signup failed");
    } finally {
      setLoading(false);
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
      <input
        className="input"
        placeholder="Full Name"
        onChange={e => setData({ ...data, name: e.target.value })}
      />
      <input
        className="input"
        placeholder="Email Address"
        type="email"
        onChange={e => setData({ ...data, email: e.target.value })}
      />
      <input
        className="input"
        placeholder="Password"
        type="password"
        onChange={e => setData({ ...data, password: e.target.value })}
      />

      {/* ACADEMIC INFO */}
      <div className="grid grid-cols-2 gap-3">
        <select
          className="input"
          value={data.semester}
          onChange={e => setData({ ...data, semester: e.target.value })}
        >
          <option value="">Select Semester</option>
          {semesters.map(s => (
            <option key={s.code} value={s.code}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          className="input"
          value={data.branch}
          onChange={e => setData({ ...data, branch: e.target.value })}
        >
          <option value="">Select Branch</option>
          {branches.map(b => (
            <option key={b.code} value={b.code}>
              {b.short_name}
            </option>
          ))}
        </select>
      </div>

      {/* CONTACT */}
      <div className="grid grid-cols-2 gap-3">
        <input
          className="input"
          placeholder="Mobile"
          inputMode="numeric"
          maxLength={10}
          onChange={e => setData({ ...data, mobile: e.target.value })}
        />
        <input
          className="input"
          placeholder="Registration  No." inputMode="numeric" maxLength={11}
          onChange={e => setData({ ...data, reg_no: e.target.value })}
        />
      </div>

      {/* CTA */}
      <button
        className="btn-primary w-full mt-4"
        onClick={handleSignup}
        disabled={loading}
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>

      {/* DIVIDER */}
      {/* <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-xs text-gray-500">OR</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      <GoogleLoginButton /> */}

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
