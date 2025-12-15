"use client";
import { API_URL } from "@/lib/api";

export default function GoogleLoginButton() {

  function handleGoogleLogin() {
    // redirect to backend google login
    window.location.href = `${API_URL}/auth/google/login`;
  }

  return (
    // <button
    //   onClick={handleGoogleLogin}
    //   // className="btn w-full bg-red-500 text-white mt-3"
    //   //className="text-primary font-semibold ml-1"
    //   className="btn-primary w-full mt-4"
    // >
    //   Continue with Google
    // </button>

<button
onClick={handleGoogleLogin}
className="w-full mt-4 flex items-center justify-center gap-3
           border border-gray-300 bg-white text-gray-800
           rounded-xl px-4 py-3 font-semibold
           hover:bg-gray-50 transition shadow-sm"
>
<img
  src="https://www.svgrepo.com/show/475656/google-color.svg"
  alt="Google"
  className="w-5 h-5"
/>
Continue with Google
</button>


  );
}
