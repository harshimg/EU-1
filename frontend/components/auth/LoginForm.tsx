"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL, apiPost } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import GoogleLoginButton from "./GoogleLoginButton";
// import {API_URL} from "@lib/api";


export default function LoginForm({ showSignup, showForgot, hide }: any) {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      const res = await apiPost("/auth/login", { email, password });

      // Save auth
      login(res.token, {
        user_id: res.user_id,
        email,
        role: res.role,
        semester: res.semester,
        branch: res.branch,
      });

      hide();

      // 🔥 ROLE-BASED REDIRECT
      if (res.role === "admin") {
        router.push("/admin");
      } else {
        router.refresh(); // normal user
      }

    } catch (e: any) {
      alert(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Login</h2>

      <input
        className="input"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="input"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="btn-primary w-full mt-4"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Signing in..." : "Login"}
      </button>

      {/* <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-xs text-gray-500">OR</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      <GoogleLoginButton /> */}

      <p className="text-sm mt-3">
        Don&apos;t have an account?
        <button
          className="text-primary font-semibold ml-1"
          onClick={showSignup}
        >
          Sign up
        </button>
      </p>

      
      <p className="text-sm mt-2 text-center">
  <button
    className="text-primary font-semibold ml-1"
    onClick={showForgot}
  >
    Forgot password?
  </button>
</p>
    </div>
  );
}
