import { motion } from "motion/react";
import { X, Github, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { signInWithGithub, signInWithGoogle } from "../lib/firebase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error("Google sign in error:", err);
      if (err.code === "auth/unauthorized-domain") {
         setError("This domain is not authorized for OAuth operations. Please add it in your Firebase Console -> Authentication -> Settings -> Authorized domains.");
      } else if (err.code === "auth/configuration-not-found" || err.code === "auth/operation-not-allowed") {
         setError("Google Sign-In is not enabled. Please enable it in your Firebase Console -> Authentication -> Sign-in method.");
      } else if (err.message && err.message.includes("popup")) {
         setError("Google sign-in popups are blocked. Please click the top-right button to open the application in a new tab.");
      } else {
         setError("Google sign-in failed. If using preview, try opening the application in a new tab: " + (err.message || ""));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGithub();
      onClose();
    } catch (err: any) {
      console.error("GitHub sign in error:", err);
      if (err.code === "auth/unauthorized-domain") {
         setError("This domain is not authorized for OAuth operations. Please add it in your Firebase Console -> Authentication -> Settings -> Authorized domains.");
      } else if (err.code === "auth/configuration-not-found" || err.code === "auth/operation-not-allowed") {
         setError("GitHub Sign-In is not enabled. Please enable it in your Firebase Console -> Authentication -> Sign-in method.");
      } else if (err.message && err.message.includes("popup")) {
         setError("GitHub sign-in popups are blocked. Please click the top-right button to open the application in a new tab.");
      } else {
         setError("GitHub sign-in failed. If using preview, try opening the application in a new tab: " + (err.message || ""));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <motion.div
          key="auth-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="bg-[#0a0a0c] border border-white/10 p-5 sm:p-8 rounded-2xl md:rounded-3xl max-w-md w-full shadow-2xl relative overflow-y-auto max-h-[92vh] sm:max-h-[85vh] custom-scrollbar"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>

            <div className="flex flex-col gap-5 mt-6">
              <div className="text-center mb-2">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Welcome to CodeBaseIQ
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Sign in or create an account securely to explore, scan, and secure your repositories.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-white text-black py-3 rounded-xl text-sm font-semibold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  {loading ? "Connecting..." : "Continue with Google"}
                </button>

                <button
                  onClick={handleGithubSignIn}
                  disabled={loading}
                  className="w-full bg-[#1b1f23] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#24292e] transition-colors flex items-center justify-center gap-2 border border-white/10 cursor-pointer disabled:opacity-50"
                >
                  <Github className="w-5 h-5 text-white" />
                  {loading ? "Connecting..." : "Continue with GitHub"}
                </button>
              </div>

              {error && (
                <div className="flex gap-2.5 items-start text-red-400 text-xs text-left leading-normal bg-red-400/15 border border-red-400/25 p-3 rounded-xl">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <p className="text-xs text-zinc-500 text-center mt-3 leading-relaxed">
                Password and email authentication are fully deprecated. All registrations and logins are handled strictly through secure OAuth single-sign-on options to fully protect your databases and identity.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
