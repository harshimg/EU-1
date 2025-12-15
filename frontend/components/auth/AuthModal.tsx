"use client";

import { createContext, useContext, useState, useRef } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import OtpVerifyForm from "./OtpVerifyForm";

export const ModalContext = createContext<any>(null);

export function AuthModalProvider({ children }: any) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"login" | "signup" | "otp">("login");
  const [emailForOtp, setEmailForOtp] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);

  // ---- VIEW HANDLERS ----
  const showLogin = () => {
    setView("login");
    setOpen(true);
  };

  const showSignup = () => {
    setView("signup");
    setOpen(true);
  };

  const showOtp = (email: string) => {
    setEmailForOtp(email);
    setView("otp");
    setOpen(true);
  };

  const hide = () => setOpen(false);

  // ---- OUTSIDE CLICK ----
  const handleOverlayClick = (e: any) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      hide();
    }
  };

  return (
    <ModalContext.Provider value={{ showLogin, showSignup, showOtp }}>
      {children}

      {open && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center
               bg-black/50 backdrop-blur-sm animate-fadeIn"
    onClick={handleOverlayClick}
  >
    <div
      ref={modalRef}
      className="modal-glass w-[380px] rounded-xl shadow-xl animate-scaleIn"
    >
      {/* 👇 ONLY THIS WRAPPER IS NEW */}
      <div className="max-h-[80vh] overflow-y-auto p-6">
        {view === "login" && (
          <LoginForm showSignup={showSignup} hide={hide} />
        )}

        {view === "signup" && (
          <SignupForm
            showLogin={showLogin}
            showOtp={showOtp}
            hide={hide}
          />
        )}

        {view === "otp" && (
          <OtpVerifyForm
            email={emailForOtp}
            hide={hide}
            backToSignup={showSignup}
            showLogin={showLogin}
          />
        )}
      </div>
    </div>
  </div>
)}

    </ModalContext.Provider>
  );
}

// ---------- EXPORT HOOK ----------
export function useAuthModal() {
  return useContext(ModalContext);
}
