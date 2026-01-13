"use client";

import { createContext, useContext, useState, useRef } from "react";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import OtpVerifyForm from "./OtpVerifyForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";

type AuthView =
  | "login"
  | "signup"
  | "otp"
  | "forgot"
  | "reset";

export const ModalContext = createContext<any>(null);

export function AuthModalProvider({ children }: any) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<AuthView>("login");
  const [emailForOtp, setEmailForOtp] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);

  // ---------------- VIEW HANDLERS ----------------

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

  const showForgot = () => {
    setView("forgot");
    setOpen(true);
  };

  const showReset = (email: string) => {
    setEmailForOtp(email);
    setView("reset");
    setOpen(true);
  };

  const hide = () => setOpen(false);

  // ---------------- OUTSIDE CLICK ----------------

  const handleOverlayClick = (e: any) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      hide();
    }
  };

  return (
    <ModalContext.Provider
      value={{
        showLogin,
        showSignup,
        showOtp,
        showForgot,
        showReset,
      }}
    >
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
            <div className="max-h-[80vh] overflow-y-auto p-6">
              {/* ---------------- LOGIN ---------------- */}
              {view === "login" && (
                <LoginForm
                  showSignup={showSignup}
                  showForgot={showForgot}
                  hide={hide}
                />
              )}

              {/* ---------------- SIGNUP ---------------- */}
              {view === "signup" && (
                <SignupForm
                  showLogin={showLogin}
                  showOtp={showOtp}
                  hide={hide}
                />
              )}

              {/* ---------------- SIGNUP OTP ---------------- */}
              {view === "otp" && (
                <OtpVerifyForm
                  email={emailForOtp}
                  hide={hide}
                  backToSignup={showSignup}
                  showLogin={showLogin}
                />
              )}

              {/* ---------------- FORGOT PASSWORD ---------------- */}
              {view === "forgot" && (
                <ForgotPasswordForm
                  showReset={showReset}
                  showLogin={showLogin}
                />
              )}

              {/* ---------------- RESET PASSWORD ---------------- */}
              {view === "reset" && (
                <ResetPasswordForm
                  email={emailForOtp}
                  showForgot={showForgot}
                  showLogin={showLogin}
                  hide={hide}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

// ---------------- EXPORT HOOK ----------------

export function useAuthModal() {
  return useContext(ModalContext);
}
