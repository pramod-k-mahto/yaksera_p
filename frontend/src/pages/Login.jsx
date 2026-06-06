import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/users";
import { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import { useEffect } from "react";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { loading, user, setUser, setLoading } = useContext(UserContext);

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let data = await login(formData);
      // console.log(data.data?.user);
      alert(data?.message);
      setUser(data?.data?.user);

      if (data?.data?.user) {
        return navigate("/admin"); // Redirect to admin dashboard after successful login
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#080c10] flex items-center justify-center p-4 relative overflow-hidden">
      {/* ── background glows ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-[#e8192c]/10 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-[380px] w-[380px] rounded-full bg-[#e8192c]/6 blur-[100px]" />
        {/* subtle grid */}
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
        {/* card */}
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-10 shadow-2xl">
          {/* logo / brand mark */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8192c] shadow-[0_8px_32px_rgba(232,25,44,0.4)]">
              <LogIn size={24} className="text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight text-white">
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-white/40">
                Sign in to your admin dashboard
              </p>
            </div>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* email */}
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
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-[#0f172a] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-[#e8192c]/50 focus:ring-2 focus:ring-[#e8192c]/10"
                />
              </div>
            </div>

            {/* password */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
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

            {/* forgot */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs text-white/40 hover:text-[#ff6b81] transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-2xl bg-[#e8192c] py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(232,25,44,0.3)] transition-all hover:shadow-[0_16px_40px_rgba(232,25,44,0.45)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* footer note */}
        <p className="mt-6 text-center text-xs text-white/20">
          Admin access only · Unauthorized entry is prohibited
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
