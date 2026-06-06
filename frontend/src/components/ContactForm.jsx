import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitContact } from "../services/contact.js";
import { NavLink } from "react-router-dom";

// ── country codes ──────────────────────────────────────────────────────────────
const countryCodes = [
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+1", country: "USA / Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+30", country: "Greece", flag: "🇬🇷" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+972", country: "Israel", flag: "🇮🇱" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+975", country: "Bhutan", flag: "🇧🇹" },
  { code: "+960", country: "Maldives", flag: "🇲🇻" },
  { code: "+95", country: "Myanmar", flag: "🇲🇲" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
  { code: "+886", country: "Taiwan", flag: "🇹🇼" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
];

// ── currencies restricted to schema enum: NPR | USD | INR ─────────────────────
// FIX: All locales set to "en-US" so formatted numbers use standard
//      comma grouping (e.g. "150,000") instead of Indian grouping ("1,50,000").
//      This matches what the server schema expects in the `formatted` field.
const currencies = [
  { code: "NPR", symbol: "Rs.", label: "Nepali Rupee", locale: "en-US" },
  { code: "USD", symbol: "$", label: "US Dollar", locale: "en-US" },
  { code: "INR", symbol: "₹", label: "Indian Rupee", locale: "en-US" },
];

const INITIAL_FORM = {
  fullName: "",
  email: "",
  countryCode: "+977",
  phone: "",
  currency: "NPR",
  projectBudget: "",
  projectDetails: "",
};

// ── helpers ────────────────────────────────────────────────────────────────────
const FieldError = ({ msg }) =>
  msg ? <p className="text-xs text-red-500 mt-1 pl-1">{msg}</p> : null;

function Toast({ message, type, onClose }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.35 }}
          className="fixed top-6 right-6 z-50 flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl max-w-sm"
          style={{
            background: type === "success" ? "#dcfce7" : "#fee2e2",
            border: `1.5px solid ${type === "success" ? "#86efac" : "#fca5a5"}`,
          }}
        >
          <span className="text-lg">{type === "success" ? "✅" : "❌"}</span>
          <div className="flex-1">
            <p
              className="text-sm font-semibold"
              style={{ color: type === "success" ? "#166534" : "#991b1b" }}
            >
              {type === "success" ? "Message Sent!" : "Something went wrong"}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: type === "success" ? "#15803d" : "#b91c1c" }}
            >
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const Chevron = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ══════════════════════════════════════════════════════════════════════════════
function ContactForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const selectedCurrency =
    currencies.find((c) => c.code === form.currency) || currencies[0];

  const handle = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleBudget = (e) => {
    // Strip everything except digits
    const value = e.target.value.replace(/[^0-9]/g, "");
    setForm((p) => ({ ...p, projectBudget: value }));
    if (errors.projectBudget) setErrors((p) => ({ ...p, projectBudget: "" }));
  };

  // FIX: Always use "en-US" locale so formatting is "150,000" not "1,50,000"
  const formatNumber = (num) => {
    if (!num) return "";
    try {
      return Number(num).toLocaleString("en-US");
    } catch {
      return num;
    }
  };

  const validate = () => {
    const e = {};

    const trimmedName = form.fullName.trim();
    if (!trimmedName || trimmedName.length < 2)
      e.fullName = "Full name must be at least 2 characters.";
    else if (trimmedName.length > 100)
      e.fullName = "Full name cannot exceed 100 characters.";

    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Please enter a valid email address.";

    // FIX: Sanitize phone — digits only, min 7 digits
    const digitsOnly = form.phone.trim().replace(/\D/g, "");
    if (!digitsOnly) e.phone = "Phone number is required.";
    else if (digitsOnly.length < 7)
      e.phone = "Please enter a valid phone number.";

    if (!form.projectBudget || Number(form.projectBudget) <= 0)
      e.projectBudget = "Please enter a valid budget amount.";

    const trimmedDetails = form.projectDetails.trim();
    if (!trimmedDetails) e.projectDetails = "Project details are required.";
    else if (trimmedDetails.length < 10)
      e.projectDetails = "Project details must be at least 10 characters.";

    return e;
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const amount = Number(form.projectBudget);

    // FIX: Build `formatted` with en-US locale so it matches "Rs. 150,000"
    //      exactly as in Postman — no Indian grouping, no surprises.
    const formatted = `${selectedCurrency.symbol} ${amount.toLocaleString("en-US")}`;

    // FIX: Strip all non-digit characters from phone number before sending,
    //      so the server receives clean digits only (e.g. "9841234567").
    const phoneDigits = form.phone.trim().replace(/\D/g, "");

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: {
        countryCode: form.countryCode,
        number: phoneDigits, // ← digits only, matches Postman
      },
      projectBudget: {
        currency: form.currency,
        amount,
        formatted, // ← "Rs. 150,000" not "Rs. 1,50,000"
      },
      projectDetails: form.projectDetails.trim(),
    };

    setLoading(true);
    try {
      const res = await submitContact(payload);
      showToast(
        res.message || "Your message has been sent successfully!",
        "success",
      );
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (err) {
      console.error("API error:", err);
      showToast(err.message || "Failed to send. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />

      <motion.div
      className="w-[500px]"
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        style={{
          
          background: "#fff",
          borderRadius: "28px",
          padding: "36px 40px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.09)",
        }}
      >
        <h2 className="text-2xl font-black text-red-500">Contact Form</h2>
        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
          Fill out the form below, and our team will get back to you promptly.
          Let's connect and create solutions together.
        </p>

        <div className="mt-7 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-[#0d1f4e]">
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handle}
              placeholder="Enter your full name"
              maxLength={100}
              className={`w-full h-12 px-4 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-red-100 transition-all
                ${errors.fullName ? "border-red-400" : "border-gray-200 focus:border-red-400"}`}
            />
            <FieldError msg={errors.fullName} />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-[#0d1f4e]">
              Business email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handle}
              placeholder="Enter your email address"
              className={`w-full h-12 px-4 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-red-100 transition-all
                ${errors.email ? "border-red-400" : "border-gray-200 focus:border-red-400"}`}
            />
            <FieldError msg={errors.email} />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-[#0d1f4e]">
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-shrink-0">
                <select
                  name="countryCode"
                  value={form.countryCode}
                  onChange={handle}
                  className="h-12 pl-3 pr-8 text-sm border border-gray-200 rounded-xl bg-gray-50 font-semibold text-gray-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all appearance-none cursor-pointer"
                  style={{ minWidth: "110px" }}
                >
                  {countryCodes.map((c) => (
                    <option key={`${c.code}-${c.country}`} value={c.code}>
                      {c.flag} {c.code} {c.country}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
              <input
                name="phone"
                value={form.phone}
                onChange={handle}
                placeholder="Enter your contact number"
                className={`flex-1 h-12 px-4 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-red-100 transition-all
                  ${errors.phone ? "border-red-400" : "border-gray-200 focus:border-red-400"}`}
              />
            </div>
            <FieldError msg={errors.phone} />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-[#0d1f4e]">
              Project Budget <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-shrink-0">
                <select
                  name="currency"
                  value={form.currency}
                  onChange={handle}
                  className="h-12 pl-3 pr-8 text-sm border border-gray-200 rounded-xl bg-gray-50 font-semibold text-gray-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all appearance-none cursor-pointer"
                  style={{ minWidth: "110px" }}
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} {c.code}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
              <input
                name="projectBudget"
                type="text"
                inputMode="numeric"
                value={formatNumber(form.projectBudget)}
                onChange={handleBudget}
                placeholder={`Enter amount in ${selectedCurrency.code}`}
                className={`flex-1 h-12 px-4 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-red-100 transition-all
                  ${errors.projectBudget ? "border-red-400" : "border-gray-200 focus:border-red-400"}`}
              />
            </div>
            <FieldError msg={errors.projectBudget} />
            <p className="text-xs text-gray-400 mt-1 pl-1">
              {form.projectBudget
                ? `You entered: ${selectedCurrency.symbol} ${formatNumber(form.projectBudget)} (${selectedCurrency.code} — ${selectedCurrency.label})`
                : `Select a currency and enter any amount (e.g. ${selectedCurrency.symbol} 15,000)`}
            </p>
          </div>

          {/* Project Details */}
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-[#0d1f4e]">
              Project Details <span className="text-red-500">*</span>
            </label>
            <textarea
              name="projectDetails"
              value={form.projectDetails}
              onChange={handle}
              rows={4}
              placeholder="Describe your project in detail (minimum 10 characters)"
              className={`w-full p-4 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-red-100 transition-all resize-none
                ${errors.projectDetails ? "border-red-400" : "border-gray-200 focus:border-red-400"}`}
            />
            <div className="flex items-center justify-between mt-1 pl-1">
              <FieldError msg={errors.projectDetails} />
              <p className="text-xs text-gray-400 ml-auto">
                {form.projectDetails.trim().length} / 10 min chars
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              className="flex-1 h-12 rounded-full text-white font-bold text-sm shadow-lg shadow-red-200 transition-colors flex items-center justify-center gap-2"
              style={{
                background: loading ? "#f87171" : "#e8192c",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="white"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Sending…
                </>
              ) : (
                "Send Message"
              )}
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 h-12 rounded-full border-2 border-[#e8192c] text-[#e8192c] font-bold text-sm hover:bg-red-50 transition-colors"
            >
              <NavLink
                target="_blank"
                to="https://calendar.app.google/PwmeVrwpLHT6CnbRA"
              >
                Book a call
              </NavLink>
            </motion.button>
          </div>

          <p className="text-center text-[10px] font-bold tracking-widest text-gray-400 pt-1">
            TYPICAL RESPONSE TIME UNDER 12 HOURS
          </p>
        </div>
      </motion.div>
    </>
  );
}

export default ContactForm;
