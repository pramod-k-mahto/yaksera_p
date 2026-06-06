import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Upload, X, ChevronDown,
  Globe, GitBranch, Clock, Building2, Layers,
  FileText, AlertCircle, Lightbulb, BarChart2,
  ImagePlus, Star, ArrowRight, Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createCaseStudy } from "../../services/caseStudies";

// ── helpers ────────────────────────────────────────────────────────────────
const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

const CATEGORIES = ["Website", "Mobile App", "AI Solution", "SaaS", "E-Commerce", "Dashboard", "Other"];

// ── tiny reusable field wrapper ────────────────────────────────────────────
const Field = ({ label, required, children, hint }) => (
  <div className="flex flex-col gap-2">
    <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
      {label}
      {required && <span className="text-[#e8192c]">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-white/25">{hint}</p>}
  </div>
);

const inputCls = `
  w-full rounded-2xl border border-white/10 bg-white/5
  px-4 py-3 text-sm text-white placeholder:text-white/25
  outline-none transition-all duration-200
  focus:border-[#e8192c]/50 focus:bg-white/8
`;

const textareaCls = `${inputCls} resize-none leading-7`;

// ── section heading ────────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, children }) => (
  <div className="rounded-[28px] border border-white/10 bg-[#0f172a] p-7">
    <div className="mb-6 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8192c]/10">
        <Icon size={16} className="text-[#ff4d67]" />
      </div>
      <h3 className="text-base font-bold">{title}</h3>
    </div>
    <div className="flex flex-col gap-5">{children}</div>
  </div>
);

// ── dynamic list (techStack, keyFeatures) ─────────────────────────────────
const TagList = ({ label, items, setItems, placeholder }) => {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !items.includes(v)) setItems([...items, v]);
    setInput("");
  };
  return (
    <Field label={label}>
      <div className="flex gap-2">
        <input
          className={inputCls}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={add}
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl bg-[#e8192c]/10 text-[#ff4d67] transition hover:bg-[#e8192c]/20"
        >
          <Plus size={18} />
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((t, i) => (
            <span
              key={i}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
            >
              {t}
              <button type="button" onClick={() => setItems(items.filter((_, j) => j !== i))}>
                <X size={12} className="text-white/40 hover:text-red-400" />
              </button>
            </span>
          ))}
        </div>
      )}
    </Field>
  );
};

// ── challenges dynamic list ────────────────────────────────────────────────
const ChallengeList = ({ items, setItems }) => {
  const add = () => setItems([...items, { title: "", description: "", solution: "" }]);
  const update = (i, key, val) => setItems(items.map((c, j) => (j === i ? { ...c, [key]: val } : c)));
  const remove = (i) => setItems(items.filter((_, j) => j !== i));
  return (
    <Field label="Challenges">
      <div className="flex flex-col gap-4">
        {items.map((c, i) => (
          <div key={i} className="relative rounded-2xl border border-white/10 bg-white/5 p-5">
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-4 top-4 text-white/30 hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
            <div className="flex flex-col gap-3">
              <input className={inputCls} placeholder="Challenge title" value={c.title} onChange={(e) => update(i, "title", e.target.value)} />
              <textarea className={textareaCls} rows={2} placeholder="Describe the challenge..." value={c.description} onChange={(e) => update(i, "description", e.target.value)} />
              <textarea className={textareaCls} rows={2} placeholder="How did you solve it?" value={c.solution} onChange={(e) => update(i, "solution", e.target.value)} />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-2 rounded-2xl border border-dashed border-white/15 px-4 py-3 text-sm text-white/40 transition hover:border-[#e8192c]/30 hover:text-[#ff4d67]"
        >
          <Plus size={16} /> Add Challenge
        </button>
      </div>
    </Field>
  );
};

// ── results dynamic list ───────────────────────────────────────────────────
const ResultList = ({ items, setItems }) => {
  const add = () => setItems([...items, { metric: "", value: "" }]);
  const update = (i, key, val) => setItems(items.map((r, j) => (j === i ? { ...r, [key]: val } : r)));
  const remove = (i) => setItems(items.filter((_, j) => j !== i));
  return (
    <Field label="Results / Metrics">
      <div className="flex flex-col gap-3">
        {items.map((r, i) => (
          <div key={i} className="flex items-center gap-3">
            <input className={inputCls} placeholder='Metric (e.g. "Page Speed")' value={r.metric} onChange={(e) => update(i, "metric", e.target.value)} />
            <input className={inputCls} placeholder='Value (e.g. "60% faster")' value={r.value} onChange={(e) => update(i, "value", e.target.value)} />
            <button type="button" onClick={() => remove(i)} className="shrink-0 text-white/30 hover:text-red-400">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-2 rounded-2xl border border-dashed border-white/15 px-4 py-3 text-sm text-white/40 transition hover:border-[#e8192c]/30 hover:text-[#ff4d67]"
        >
          <Plus size={16} /> Add Result
        </button>
      </div>
    </Field>
  );
};

// ── main component ─────────────────────────────────────────────────────────
function AddCaseStudy() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // basic
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [category, setCategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [projectDuration, setProjectDuration] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState("Draft");

  // arrays
  const [techStack, setTechStack] = useState([]);
  const [keyFeatures, setKeyFeatures] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [results, setResults] = useState([]);

  // content
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");

  // files
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [screenshots, setScreenshots] = useState([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState([]);

  // ── handlers ──────────────────────────────────────────────────────────
  const handleTitleChange = (val) => {
    setTitle(val);
    if (!slugManual) setSlug(slugify(val));
  };

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleScreenshots = (e) => {
    const files = Array.from(e.target.files);
    setScreenshots((prev) => [...prev, ...files]);
    setScreenshotPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeScreenshot = (i) => {
    setScreenshots((prev) => prev.filter((_, j) => j !== i));
    setScreenshotPreviews((prev) => prev.filter((_, j) => j !== i));
  };

  // ── submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !category || !shortDescription || !problem || !solution) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!thumbnail) {
      setError("Thumbnail image is required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("category", category);
    formData.append("shortDescription", shortDescription);
    formData.append("industry", industry);
    formData.append("projectDuration", projectDuration);
    formData.append("problem", problem);
    formData.append("solution", solution);
    formData.append("liveUrl", liveUrl);
    formData.append("githubUrl", githubUrl);
    formData.append("featured", featured);
    formData.append("status", status);

    // arrays → JSON strings (parseJsonFields in controller handles this)
    formData.append("techStack", JSON.stringify(techStack));
    formData.append("keyFeatures", JSON.stringify(keyFeatures));
    formData.append("challenges", JSON.stringify(challenges));
    formData.append("results", JSON.stringify(results));

    // files
    formData.append("thumbnail", thumbnail);
    screenshots.forEach((file) => formData.append("screenshots", file));

    try {
      setLoading(true);
      await createCaseStudy(formData);
      navigate("/admin/caseStudiesManagement");
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* HEADER */}
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="inline-flex rounded-full border border-[#e8192c]/20 bg-[#e8192c]/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-[#ff4d67]">
            NEW CASE STUDY
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
            Add Case Study
          </h1>
          <p className="mt-3 text-sm leading-7 text-white/45">
            Fill in the details below. Fields marked <span className="text-[#e8192c]">*</span> are required.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* featured toggle */}
          <button
            type="button"
            onClick={() => setFeatured((f) => !f)}
            className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
              featured
                ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                : "border-white/10 bg-white/5 text-white/50"
            }`}
          >
            <Star size={16} />
            {featured ? "Featured" : "Set Featured"}
          </button>

          {/* status toggle */}
          <button
            type="button"
            onClick={() => setStatus((s) => (s === "Draft" ? "Published" : "Draft"))}
            className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
              status === "Published"
                ? "border-green-500/30 bg-green-500/10 text-green-400"
                : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
            }`}
          >
            {status}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* ── BASIC INFO ── */}
        <Section icon={FileText} title="Basic Information">
          <Field label="Title" required>
            <input className={inputCls} placeholder="e.g. Enterprise ERP Platform" value={title} onChange={(e) => handleTitleChange(e.target.value)} />
          </Field>

          <Field label="Slug" hint="Auto-generated from title. Edit to customise.">
            <input
              className={inputCls}
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
              placeholder="enterprise-erp-platform"
            />
          </Field>

          <div className="grid grid-cols-1 gap-5 text-black md:grid-cols-2">
            <Field label="Category" required>
              <div className="relative">
                <select
                  className={`${inputCls} appearance-none    `}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option  value="" disabled>Select category…</option>
                  {CATEGORIES.map((c) => <option className="text-black" key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
              </div>
            </Field>

            <Field label="Industry">
              <input className={inputCls} placeholder="e.g. Healthcare, Fintech" value={industry} onChange={(e) => setIndustry(e.target.value)} />
            </Field>
          </div>

          <Field label="Short Description" required hint={`${shortDescription.length}/300`}>
            <textarea className={textareaCls} rows={3} maxLength={300} placeholder="Brief summary shown on listing cards…" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
          </Field>

          <Field label="Project Duration">
            <input className={inputCls} placeholder='e.g. "3 months" or "Jan 2024 – Apr 2024"' value={projectDuration} onChange={(e) => setProjectDuration(e.target.value)} />
          </Field>
        </Section>

        {/* ── THUMBNAIL ── */}
        <Section icon={ImagePlus} title="Thumbnail">
          <Field label="Thumbnail Image" required>
            {thumbnailPreview ? (
              <div className="relative w-full overflow-hidden rounded-2xl border border-white/10">
                <img src={thumbnailPreview} alt="thumbnail" className="h-52 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setThumbnail(null); setThumbnailPreview(""); }}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-500/80"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-white/15 py-10 transition hover:border-[#e8192c]/40 hover:bg-white/[0.02]">
                <Upload size={28} className="text-white/30" />
                <span className="text-sm text-white/40">Click to upload thumbnail</span>
                <span className="text-xs text-white/20">PNG, JPG, WEBP — max 5MB</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleThumbnail} />
              </label>
            )}
          </Field>
        </Section>

        {/* ── CONTENT ── */}
        <Section icon={Lightbulb} title="Problem & Solution">
          <Field label="Problem" required>
            <textarea className={textareaCls} rows={4} placeholder="What problem did the client face?" value={problem} onChange={(e) => setProblem(e.target.value)} />
          </Field>
          <Field label="Solution" required>
            <textarea className={textareaCls} rows={4} placeholder="How did you solve it?" value={solution} onChange={(e) => setSolution(e.target.value)} />
          </Field>
        </Section>

        {/* ── TECH & FEATURES ── */}
        <Section icon={Layers} title="Tech Stack & Features">
          <TagList label="Tech Stack" items={techStack} setItems={setTechStack} placeholder='e.g. "Next.js" then press Enter' />
          <TagList label="Key Features" items={keyFeatures} setItems={setKeyFeatures} placeholder='e.g. "Real-time dashboard" then press Enter' />
        </Section>

        {/* ── CHALLENGES ── */}
        <Section icon={AlertCircle} title="Challenges">
          <ChallengeList items={challenges} setItems={setChallenges} />
        </Section>

        {/* ── RESULTS ── */}
        <Section icon={BarChart2} title="Results & Metrics">
          <ResultList items={results} setItems={setResults} />
        </Section>

        {/* ── SCREENSHOTS ── */}
        <Section icon={ImagePlus} title="Screenshots">
          <Field label="Project Screenshots" hint="Up to 10 images">
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-white/15 px-4 py-4 transition hover:border-[#e8192c]/40 hover:bg-white/[0.02]">
              <Upload size={18} className="text-white/30" />
              <span className="text-sm text-white/40">Click to add screenshots</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleScreenshots} />
            </label>
            {screenshotPreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {screenshotPreviews.map((src, i) => (
                  <div key={i} className="relative overflow-hidden rounded-2xl border border-white/10">
                    <img src={src} alt={`screenshot-${i}`} className="h-28 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeScreenshot(i)}
                      className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 hover:bg-red-500/80"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>
        </Section>

        {/* ── LINKS ── */}
        <Section icon={Globe} title="Links">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Live URL">
              <div className="relative">
                <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input className={`${inputCls} pl-10`} placeholder="https://yourproject.com" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} />
              </div>
            </Field>
            <Field label="GitHub URL">
              <div className="relative">
                <GitBranch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input className={`${inputCls} pl-10`} placeholder="https://github.com/..." value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
              </div>
            </Field>
          </div>
        </Section>

        {/* ── ERROR ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400"
            >
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SUBMIT ── */}
        <div className="flex items-center justify-end gap-4 pb-10">
          <button
            type="button"
            onClick={() => navigate("/admin/case-studies")}
            className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/10"
          >
            Cancel
          </button>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-2xl bg-[#e8192c] px-6 py-3 text-sm font-semibold shadow-[0_12px_30px_rgba(232,25,44,0.28)] transition-all duration-300 hover:shadow-[0_18px_40px_rgba(232,25,44,0.38)] disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Publishing…</>
            ) : (
              <><ArrowRight size={16} /> Publish Case Study</>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
}

export default AddCaseStudy;