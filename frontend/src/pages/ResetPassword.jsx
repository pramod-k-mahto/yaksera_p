import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/users";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setStatus("loading");
    try {
      await resetPassword(token, form.password);
      setStatus("success");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setStatus("error");
      setError(err.message || "Reset failed. The link may be invalid or expired.");
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
          {status === "success" ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8192c]/10 border border-[#e8192c]/30">
                <CheckCircle size={30} className="text-[#e8192c]" />
              </div>
              <h1 className="text-2xl font-black text-white mb-2">Password reset</h1>
              <p className="text-sm text-white/40">
                Your password has been updated. Redirecting to sign in…
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8192c] shadow-[0_8px_32px_rgba(232,25,44,0.4)]">
                  <Lock size={24} className="text-white" />
                </div>
                <div className="text-center">
                  <h1 className="text-2xl font-black tracking-tight text-white">
                    Set a new password
                  </h1>
                  <p className="mt-1 text-sm text-white/40">
                    Choose a strong password for your account
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">
                    New password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      placeholder="Min. 8 characters"
                      className="w-full rounded-2xl border border-white/10 bg-[#0f172a] py-3.5 pl-11 pr-12 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-[#e8192c]/50 focus:ring-2 focus:ring-[#e8192c]/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirm"
                      value={form.confirm}
                      onChange={handleChange}
                      required
                      placeholder="Re-enter password"
                      className="w-full rounded-2xl border border-white/10 bg-[#0f172a] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-[#e8192c]/50 focus:ring-2 focus:ring-[#e8192c]/10"
                    />
                  </div>
                </div>

                {error && <p className="text-red-400 text-xs">{error}</p>}

                <motion.button
                  type="submit"
                  disabled={status === "loading"}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-2xl bg-[#e8192c] py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(232,25,44,0.3)] transition-all hover:shadow-[0_16px_40px_rgba(232,25,44,0.45)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Updating…" : "Reset password"}
                </motion.button>

                <div className="flex justify-center">
                  <Link
                    to="/login"
                    className="text-xs text-white/40 hover:text-[#ff6b81] transition-colors"
                  >
                    Back to sign in
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ResetPassword;
