import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/users";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");
    try {
      const res = await forgotPassword(email.trim());
      setStatus("success");
      setMessage(
        res?.message ||
          "If an account with that email exists, a password reset link has been sent.",
      );
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#080c10] flex items-center justify-center p-4 relative overflow-hidden">
      {/* background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-[#e8192c]/10 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-[380px] w-[380px] rounded-full bg-[#e8192c]/6 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-10 shadow-2xl">
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8192c] shadow-[0_8px_32px_rgba(232,25,44,0.4)]">
              <Mail size={24} className="text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight text-white">
                Forgot password?
              </h1>
              <p className="mt-1 text-sm text-white/40">
                Enter your email and we'll send you a reset link
              </p>
            </div>
          </div>

          {status === "success" ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8192c]/10 border border-[#e8192c]/30">
                <Mail size={28} className="text-[#e8192c]" />
              </div>
              <p className="text-sm text-white/60">{message}</p>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-2 text-sm text-[#ff6b81] hover:text-[#ff8fa0] transition-colors"
              >
                <ArrowLeft size={16} /> Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                  />
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@email.com"
                    className="w-full rounded-2xl border border-white/10 bg-[#0f172a] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-[#e8192c]/50 focus:ring-2 focus:ring-[#e8192c]/10"
                  />
                </div>
              </div>

              {status === "error" && (
                <p className="text-red-400 text-xs">{message}</p>
              )}

              <motion.button
                type="submit"
                disabled={status === "loading"}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-2xl bg-[#e8192c] py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(232,25,44,0.3)] transition-all hover:shadow-[0_16px_40px_rgba(232,25,44,0.45)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Sending…" : "Send reset link"}
              </motion.button>

              <div className="flex justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-[#ff6b81] transition-colors"
                >
                  <ArrowLeft size={14} /> Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
