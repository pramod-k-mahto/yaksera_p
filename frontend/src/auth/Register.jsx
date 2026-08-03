import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { registerUser } from "../services/users";

const InputField = ({ label, name, type = "text", value, onChange, error, placeholder, accept }) => (
  <motion.div
    className="relative"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-[#ff6b81]/80 mb-1.5">
      {label}
    </label>
    <input
      name={name}
      type={type}
      value={type !== "file" ? value : undefined}
      onChange={onChange}
      placeholder={placeholder}
      accept={accept}
      className={`w-full bg-[#0f172a] border ${
        error ? "border-red-500/70" : "border-white/10"
      } text-white placeholder-white/20 rounded-2xl px-4 py-3.5 text-sm
        focus:outline-none focus:border-[#e8192c]/50 focus:ring-2 focus:ring-[#e8192c]/10
        transition-all duration-200`}
    />
    <AnimatePresence>
      {error && (
        <motion.p
          className="text-red-400 text-[11px] mt-1 font-medium"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);

const ImageUpload = ({ label, name, onChange, preview, error }) => (
  <motion.div
    className="relative"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-[#ff6b81]/80 mb-1.5">
      {label}
    </label>
    <label className={`flex items-center gap-3 w-full bg-[#0f172a] border ${
      error ? "border-red-500/70" : "border-white/10"
    } border-dashed rounded-2xl px-4 py-3.5 cursor-pointer
      hover:border-[#e8192c]/50 transition-all duration-200 group`}>
      <input type="file" name={name} accept="image/*" onChange={onChange} className="hidden" />
      {preview ? (
        <img src={preview} alt="preview" className="w-10 h-10 rounded-md object-cover ring-1 ring-[#e8192c]/30" />
      ) : (
        <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center text-white/30 group-hover:text-[#ff6b81]/70 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
        </div>
      )}
      <span className="text-white/30 text-xs group-hover:text-white/50 transition-colors">
        {preview ? "Change image" : "Click to upload"}
      </span>
    </label>
    <AnimatePresence>
      {error && (
        <motion.p className="text-red-400 text-[11px] mt-1 font-medium"
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);

export default function Register() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", address: "",
  });
  const [files, setFiles] = useState({ profile: null, coverImage: null });
  const [previews, setPreviews] = useState({ profile: null, coverImage: null });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email format";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.address.trim()) e.address = "Address is required";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleFile = (e) => {
    const { name, files: f } = e.target;
    const file = f[0];
    if (!file) return;
    setFiles(prev => ({ ...prev, [name]: file }));
    setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) { setErrors(validation); return; }

    setStatus("loading");
    setApiError("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (files.profile) formData.append("profile", files.profile);
      if (files.coverImage) formData.append("coverImage", files.coverImage);

      const data = await registerUser(formData);
      console.log("Registered:", data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setApiError(err.message || "Registration failed. Please try again.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#080c10] flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-[#e8192c]/10 border border-[#e8192c]/30 flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#e8192c" strokeWidth="1.5">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-black text-white mb-2">
            Account Created
          </h2>
          <p className="text-white/40 text-sm">Check your email to verify your account.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c10] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background atmosphere */}
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
        className="relative w-full max-w-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <div className="inline-flex items-center gap-2 bg-[#e8192c]/10 border border-[#e8192c]/20 rounded-full px-4 py-1.5 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#e8192c] animate-pulse" />
            <span className="text-[#ff6b81] text-[11px] font-semibold tracking-[0.15em] uppercase">
              Create Account
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Join Yaksera
          </h1>
          <p className="text-white/40 text-sm mt-2">Fill in your details to get started</p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-10 shadow-2xl"
          variants={itemVariants}
        >
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-5">
              {/* Name + Email */}
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="John Doe" />
                <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="you@email.com" />
              </div>

              {/* Password + Phone */}
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} placeholder="Min. 8 characters" />
                <InputField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+977 9800000000" />
              </div>

              {/* Address */}
              <InputField label="Address" name="address" value={form.address} onChange={handleChange} error={errors.address} placeholder="Kathmandu, Nepal" />

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/20 text-[11px] tracking-wider uppercase">Optional Images</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Images */}
              <div className="grid grid-cols-2 gap-4">
                <ImageUpload label="Profile Photo" name="profile" onChange={handleFile} preview={previews.profile} error={errors.profile} />
                <ImageUpload label="Cover Image" name="coverImage" onChange={handleFile} preview={previews.coverImage} error={errors.coverImage} />
              </div>

              {/* API Error */}
              <AnimatePresence>
                {apiError && (
                  <motion.div
                    className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="text-red-400 text-xs">{apiError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={status === "loading"}
                className="relative w-full rounded-2xl bg-[#e8192c] py-3.5 text-sm font-bold text-white
                  shadow-[0_10px_30px_rgba(232,25,44,0.3)] transition-all
                  hover:shadow-[0_16px_40px_rgba(232,25,44,0.45)]
                  disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                whileHover={{ y: status === "loading" ? 0 : -2 }}
                whileTap={{ scale: status === "loading" ? 1 : 0.98 }}
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                    />
                    Creating Account…
                  </span>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </div>
          </form>







          {/* Footer link */}
          <p className="text-center text-white/30 text-xs mt-5">
            Already have an account?{" "}
            <a href="/login" className="text-[#ff6b81] hover:text-[#ff8fa0] transition-colors">
              Sign in
            </a>
          </p>
        </motion.div>

        {/* Bottom note */}
        <motion.p className="text-center text-white/20 text-[11px] mt-5" variants={itemVariants}>
          By registering you agree to our Terms & Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
}