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
    <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-amber-400/80 mb-1.5">
      {label}
    </label>
    <input
      name={name}
      type={type}
      value={type !== "file" ? value : undefined}
      onChange={onChange}
      placeholder={placeholder}
      accept={accept}
      className={`w-full bg-zinc-900/60 border ${
        error ? "border-red-500/70" : "border-zinc-700/60"
      } text-zinc-100 placeholder-zinc-600 rounded-lg px-4 py-3 text-sm
        focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20
        transition-all duration-200 font-mono`}
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
    <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-amber-400/80 mb-1.5">
      {label}
    </label>
    <label className={`flex items-center gap-3 w-full bg-zinc-900/60 border ${
      error ? "border-red-500/70" : "border-zinc-700/60"
    } border-dashed rounded-lg px-4 py-3 cursor-pointer
      hover:border-amber-400/50 transition-all duration-200 group`}>
      <input type="file" name={name} accept="image/*" onChange={onChange} className="hidden" />
      {preview ? (
        <img src={preview} alt="preview" className="w-10 h-10 rounded-md object-cover ring-1 ring-amber-400/30" />
      ) : (
        <div className="w-10 h-10 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-amber-400/60 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
        </div>
      )}
      <span className="text-zinc-500 text-xs font-mono group-hover:text-zinc-400 transition-colors">
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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.5">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Account Created
          </h2>
          <p className="text-zinc-500 text-sm font-mono">Check your email to verify your account.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-400/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/[0.04] rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.008%22%3E%3Ccircle cx=%221%22 cy=%221%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      </div>

      <motion.div
        className="relative w-full max-w-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-10" variants={itemVariants}>
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-1.5 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400/80 text-[11px] font-semibold tracking-[0.15em] uppercase font-mono">
              Create Account
            </span>
          </div>
          <h1 className="text-4xl font-bold text-zinc-100 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Join Yaksera
          </h1>
          <p className="text-zinc-500 text-sm mt-2 font-mono">Fill in your details to get started</p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-8 backdrop-blur-sm shadow-2xl shadow-black/40"
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
                <div className="flex-1 h-px bg-zinc-800" />
                <span className="text-zinc-600 text-[11px] font-mono tracking-wider uppercase">Optional Images</span>
                <div className="flex-1 h-px bg-zinc-800" />
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
                    <p className="text-red-400 text-xs font-mono">{apiError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={status === "loading"}
                className="relative w-full bg-amber-400 text-zinc-950 font-bold text-sm py-3.5 rounded-xl
                  disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden
                  hover:bg-amber-300 transition-colors duration-200 tracking-wide mt-2"
                whileHover={{ scale: status === "loading" ? 1 : 1.01 }}
                whileTap={{ scale: status === "loading" ? 1 : 0.98 }}
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full inline-block"
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
          <p className="text-center text-zinc-600 text-xs font-mono mt-5">
            Already have an account?{" "}
            <a href="/login" className="text-amber-400/80 hover:text-amber-400 transition-colors">
              Sign in
            </a>
          </p>
        </motion.div>

        {/* Bottom note */}
        <motion.p className="text-center text-zinc-700 text-[11px] font-mono mt-5" variants={itemVariants}>
          By registering you agree to our Terms & Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
}