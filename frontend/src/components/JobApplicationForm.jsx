import { useState } from "react";
import { applyJobApplications } from "../services/jobApplication";
import { useLocation } from "react-router-dom";
const STEPS = ["Personal", "Experience", "Links", "Cover Letter"];
const initialForm = {
  vacancy: "",
  name: "",
  email: "",
  phone: "",
  role: "",
  experience: "",
  location: "",
  skills: "",
  coverLetter: "",
  portfolio: "",
  linkedin: "",
  github: "",
};

function ProgressBar({ step }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300 ${
                  done
                    ? "bg-slate-900 border-slate-900 text-white"
                    : active
                      ? "bg-white border-red-500 text-red-500"
                      : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                {done ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`mt-1.5 text-[11px] font-medium whitespace-nowrap ${active ? "text-red-500" : done ? "text-slate-700" : "text-slate-400"}`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 mb-5 transition-all duration-500 ${done ? "bg-slate-900" : "bg-slate-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, required, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/8 transition-all";

export default function JobApplicationForm() {
  const { state } = useLocation();
  console.log(state);
  const vacancyId = state?.vacancyId;
  const jobTitle = state?.title;

  const [step, setStep] = useState(0);

  const [form, setForm] = useState({ ...initialForm, vacancy: vacancyId });
  const [resumeFile, setResumeFile] = useState(null); // ✅ actual File object
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  // ✅ Handle PDF file selection with validation
  function handleResumeChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrors((err) => ({ ...err, resume: "Only PDF files are accepted" }));
      setResumeFile(null);
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setErrors((err) => ({ ...err, resume: "File size must be under 5MB" }));
      setResumeFile(null);
      e.target.value = "";
      return;
    }

    setResumeFile(file);
    setErrors((err) => ({ ...err, resume: "" }));
  }

  function validateStep() {
    const errs = {};
    if (step === 0) {
      if (!form.name.trim()) errs.name = "Name is required";
      if (!form.email.trim()) errs.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.email))
        errs.email = "Enter a valid email";
      if (!form.phone.trim()) errs.phone = "Phone is required";
      if (!form.location.trim()) errs.location = "Location is required";
    }
    if (step === 1) {
      if (!form.role.trim()) errs.role = "Current/desired role is required";
      if (!form.experience.trim()) errs.experience = "Experience is required";
      if (!resumeFile) errs.resume = "Resume PDF is required"; // ✅ check file not URL
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }
  function next() {
    if (validateStep()) setStep((s) => s + 1);
  }
  function back() {
    setStep((s) => s - 1);
  }
  async function submit() {
    if (!validateStep()) return;
    setLoading(true);
    setApiError("");

    try {
      // ✅ Use FormData — NOT JSON — because we're sending a file
      const formData = new FormData();
      formData.append("vacancy", form.vacancy);
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("role", form.role);
      formData.append("experience", form.experience);
      formData.append("location", form.location);
      formData.append("coverLetter", form.coverLetter);
      formData.append("portfolio", form.portfolio);
      formData.append("linkedin", form.linkedin);
      formData.append("github", form.github);
      formData.append("resume", resumeFile); // ✅ actual PDF file

      // skills as array items
      const skillsArray = form.skills
        ? form.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      skillsArray.forEach((skill) => formData.append("skills[]", skill));

      const data = await applyJobApplications(formData);
      console.log(data);

      if (!data) throw new Error(data?.message || "Submission failed");
      setSubmitted(true);
    } catch (err) {
      setApiError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-200/60 p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Application Submitted!
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            Thanks for applying for{" "}
            <span className="font-semibold text-slate-700">{jobTitle}</span>.
            We'll review your application and get back to you soon.
          </p>
          {/* <button
            onClick={() => {
              setSubmitted(false);
              setStep(0);
              setForm({ ...initialForm, vacancy: vacancyId });
              setResumeFile(null);
            }}
            className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-sm font-semibold hover:bg-black transition-colors"
          >
            Submit another application
          </button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-red-500 font-semibold mb-3">
          Job Application
        </p>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
          {jobTitle}
        </h1>
        <p className="text-slate-500 text-sm">
          Fill in the form below. Fields marked with{" "}
          <span className="text-red-500">*</span> are required.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-24">
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-200/60 p-8 sm:p-10">
          <ProgressBar step={step} />

          {/* Step 0 — Personal */}
          {step === 0 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Full Name" required>
                  <input
                    className={inputCls}
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </Field>
                <Field label="Email Address" required>
                  <input
                    className={inputCls}
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Phone Number" required>
                  <input
                    className={inputCls}
                    type="tel"
                    placeholder="+977 98XXXXXXXX"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                  )}
                </Field>
                <Field label="Current Location" required>
                  <input
                    className={inputCls}
                    placeholder="Kathmandu, Nepal"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                  />
                  {errors.location && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.location}
                    </p>
                  )}
                </Field>
              </div>
            </div>
          )}

          {/* Step 1 — Experience */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Current / Desired Role" required>
                  <input
                    className={inputCls}
                    placeholder="Frontend Engineer"
                    value={form.role}
                    onChange={(e) => set("role", e.target.value)}
                  />
                  {errors.role && (
                    <p className="mt-1 text-xs text-red-500">{errors.role}</p>
                  )}
                </Field>
                <Field label="Years of Experience" required>
                  <select
                    className={inputCls}
                    value={form.experience}
                    onChange={(e) => set("experience", e.target.value)}
                  >
                    <option value="">Select experience</option>
                    <option>0–1 years</option>
                    <option>1–2 years</option>
                    <option>2–4 years</option>
                    <option>4–6 years</option>
                    <option>6–10 years</option>
                    <option>10+ years</option>
                  </select>
                  {errors.experience && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.experience}
                    </p>
                  )}
                </Field>
              </div>
              <Field
                label="Skills"
                hint="Comma-separated: React, TypeScript, Node.js"
              >
                <input
                  className={inputCls}
                  placeholder="React, TypeScript, Tailwind CSS"
                  value={form.skills}
                  onChange={(e) => set("skills", e.target.value)}
                />
              </Field>

              {/* ✅ PDF Upload Field */}
              <Field label="Resume (PDF)" required hint="Max 5MB · PDF only">
                <div
                  className={`relative w-full border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer
                    ${resumeFile ? "border-green-400 bg-green-50" : errors.resume ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"}`}
                  onClick={() =>
                    document.getElementById("resume-input").click()
                  }
                >
                  <input
                    id="resume-input"
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={handleResumeChange}
                  />
                  {resumeFile ? (
                    <div className="flex flex-col items-center gap-2">
                      {/* PDF icon */}
                      <svg
                        className="w-10 h-10 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-sm font-semibold text-green-700">
                        {resumeFile.name}
                      </p>
                      <p className="text-xs text-green-500">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB · Click
                        to change
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        className="w-10 h-10 text-slate-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      <p className="text-sm font-medium text-slate-600">
                        Click to upload your resume
                      </p>
                      <p className="text-xs text-slate-400">
                        PDF only · Max 5MB
                      </p>
                    </div>
                  )}
                </div>
                {errors.resume && (
                  <p className="mt-1 text-xs text-red-500">{errors.resume}</p>
                )}
              </Field>
            </div>
          )}

          {/* Step 2 — Links */}
          {step === 2 && (
            <div className="space-y-5">
              <Field
                label="Portfolio URL"
                hint="Your personal website or portfolio"
              >
                <input
                  className={inputCls}
                  placeholder="https://yourportfolio.com"
                  value={form.portfolio}
                  onChange={(e) => set("portfolio", e.target.value)}
                />
              </Field>
              <Field label="LinkedIn Profile">
                <input
                  className={inputCls}
                  placeholder="https://linkedin.com/in/yourname"
                  value={form.linkedin}
                  onChange={(e) => set("linkedin", e.target.value)}
                />
              </Field>
              <Field label="GitHub Profile">
                <input
                  className={inputCls}
                  placeholder="https://github.com/yourname"
                  value={form.github}
                  onChange={(e) => set("github", e.target.value)}
                />
              </Field>
            </div>
          )}

          {/* Step 3 — Cover Letter */}
          {step === 3 && (
            <div className="space-y-5">
              <Field
                label="Cover Letter"
                hint="Tell us why you're a great fit for this role (optional)"
              >
                <textarea
                  className={`${inputCls} resize-none`}
                  rows={8}
                  placeholder="Hi, I'm excited to apply for this role because..."
                  value={form.coverLetter}
                  onChange={(e) => set("coverLetter", e.target.value)}
                />
              </Field>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 space-y-2.5">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-400 font-semibold mb-3">
                  Review your details
                </p>
                {[
                  ["Name", form.name],
                  ["Email", form.email],
                  ["Phone", form.phone],
                  ["Location", form.location],
                  ["Role", form.role],
                  ["Experience", form.experience],
                  ["Skills", form.skills],
                  ["Resume", resumeFile?.name],
                ].map(([label, val]) =>
                  val ? (
                    <div key={label} className="flex gap-3 text-sm">
                      <span className="text-slate-400 w-24 shrink-0">
                        {label}
                      </span>
                      <span className="text-slate-700 font-medium">{val}</span>
                    </div>
                  ) : null,
                )}
              </div>
              {apiError && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                  {apiError}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
            {step > 0 ? (
              <button
                onClick={back}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}
            {step < STEPS.length - 1 ? (
              <button
                onClick={next}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-black transition-colors"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={loading}
                className="px-8 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
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
                    Submitting…
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
