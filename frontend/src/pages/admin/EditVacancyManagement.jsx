import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobVacancyById, updateJobVacancy } from "../../services/jobVacancy";

const EMPLOYMENT_TYPES = ["full-time", "part-time", "internship", "contract", "remote"];
const STATUSES         = ["open", "closed", "draft"];
const CURRENCIES       = ["USD", "EUR", "GBP", "NPR", "INR", "AUD", "CAD"];

const inputCls =
  "w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40 transition";
const selectCls =
  "w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40 transition cursor-pointer";

// ── shared sub-components ─────────────────────────────────────────────────────

function Label({ children, required }) {
  return (
    <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-1.5">
      {children}{required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
  );
}

function ErrMsg({ msg }) {
  return msg ? <p className="mt-1 text-[11px] text-rose-400">{msg}</p> : null;
}

function SectionCard({ accent, icon, title, children }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-800 bg-slate-900/60">
        <span className={`text-lg ${accent}`}>{icon}</span>
        <h2 className={`text-xs font-bold tracking-widest uppercase ${accent}`}>{title}</h2>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

function TagInput({ label, items, onChange, placeholder }) {
  const [input, setInput] = useState("");
  const add = () => {
    const val = input.trim();
    if (val && !items.includes(val)) { onChange([...items, val]); setInput(""); }
  };
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2 mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className={inputCls + " flex-1"}
        />
        <button type="button" onClick={add}
          className="px-3 py-2 text-sm font-semibold rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition">
          + Add
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {items.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
              {item}
              <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="text-slate-500 hover:text-rose-400 transition ml-0.5 leading-none">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
      <div onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? "bg-violet-600" : "bg-slate-700"}`}>
        <div className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-[22px]" : "translate-x-[3px]"}`} />
      </div>
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
    </label>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  title: "", dept: "", type: "full-time", location: "", experience: "",
  tags: [], description: "", responsibilities: [], requirements: [],
  benefits: [], education: "", openings: 1, applicationDeadline: "",
  featured: false, salary: { min: "", max: "", currency: "USD", isVisible: false },
  status: "open",
};

export default function EditVacancyManagement() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [form,      setForm]     = useState(EMPTY_FORM);
  const [errors,    setErrors]   = useState({});
  const [fetching,  setFetching] = useState(true);
  const [loading,   setLoading]  = useState(false);
  const [toast,     setToast]    = useState(null);

  // ── load ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getJobVacancyById(id);
        const j   = res.data;
        setForm({
          title:               j.title               ?? "",
          dept:                j.dept                ?? "",
          type:                j.type                ?? "full-time",
          location:            j.location            ?? "",
          experience:          j.experience          ?? "",
          tags:                j.tags                ?? [],
          description:         j.description         ?? "",
          responsibilities:    j.responsibilities    ?? [],
          requirements:        j.requirements        ?? [],
          benefits:            j.benefits            ?? [],
          education:           j.education           ?? "",
          openings:            j.openings            ?? 1,
          applicationDeadline: j.applicationDeadline
            ? new Date(j.applicationDeadline).toISOString().slice(0, 16)
            : "",
          featured: j.featured ?? false,
          salary: {
            min:       j.salary?.min       ?? "",
            max:       j.salary?.max       ?? "",
            currency:  j.salary?.currency  ?? "USD",
            isVisible: j.salary?.isVisible ?? false,
          },
          status: j.status ?? "open",
        });
      } catch {
        setToast({ type: "error", msg: "Failed to load vacancy." });
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id]);

  const set       = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setSalary = (key, value) => setForm((f) => ({ ...f, salary: { ...f.salary, [key]: value } }));

  const validate = () => {
    const e = {};
    if (!form.title       || form.title.length < 3)       e.title       = "Title must be at least 3 characters";
    if (!form.dept        || form.dept.length < 2)        e.dept        = "Department is required";
    if (!form.location    || form.location.length < 2)    e.location    = "Location is required";
    if (!form.experience)                                  e.experience  = "Experience is required";
    if (!form.description || form.description.length < 10) e.description = "Description must be at least 10 characters";
    if (!form.openings    || Number(form.openings) < 1)   e.openings    = "At least 1 opening required";
    return e;
  };

  // ── save ─────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    const payload = {
      ...form,
      openings: Number(form.openings),
      salary: {
        ...form.salary,
        min: form.salary.min !== "" ? Number(form.salary.min) : undefined,
        max: form.salary.max !== "" ? Number(form.salary.max) : undefined,
      },
      applicationDeadline: form.applicationDeadline
        ? new Date(form.applicationDeadline).toISOString()
        : undefined,
    };

    try {
      await updateJobVacancy(id, payload);
      setToast({ type: "success", msg: "Vacancy updated successfully!" });
      setTimeout(() => navigate("/admin/vacancy"), 1500);
    } catch (err) {
      setToast({ type: "error", msg: err?.message || "Something went wrong." });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  // ── loading state ─────────────────────────────────────────────────────────────
  if (fetching) {
    return (
      <div className="min-h-screen bg-[#080b12] flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-violet-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 font-sans pb-20">

      {/* TOAST */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-semibold transition-all ${
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
          <span className="text-base">{toast.type === "success" ? "✓" : "✗"}</span>
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0d0f1a] to-[#080b12] border-b border-slate-800/60 px-6 py-12 mb-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate("/admin/vacancy")}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition mb-4"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to Vacancies
          </button>
          <span className="inline-block text-[10px] font-black tracking-[0.2em] uppercase bg-violet-600/20 text-violet-400 border border-violet-500/30 px-3 py-1 rounded-md mb-4">
            HR Portal
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Edit Job Vacancy</h1>
          <p className="text-slate-500 text-sm">Update the details below and save your changes.</p>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-6 space-y-5">

        {/* BASIC INFO */}
        <SectionCard accent="text-violet-400" icon="🧩" title="Basic Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Job Title</Label>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Senior React Developer" className={inputCls} />
              <ErrMsg msg={errors.title} />
            </div>
            <div>
              <Label required>Department</Label>
              <input value={form.dept} onChange={(e) => set("dept", e.target.value)} placeholder="e.g. Engineering" className={inputCls} />
              <ErrMsg msg={errors.dept} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Employment Type</Label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className={selectCls}>
                {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className={selectCls}>
                {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <Label>Openings</Label>
              <input type="number" min="1" value={form.openings} onChange={(e) => set("openings", e.target.value)} className={inputCls} />
              <ErrMsg msg={errors.openings} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Location</Label>
              <input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Kathmandu, Nepal" className={inputCls} />
              <ErrMsg msg={errors.location} />
            </div>
            <div>
              <Label required>Experience Required</Label>
              <input value={form.experience} onChange={(e) => set("experience", e.target.value)} placeholder="e.g. 3+ years" className={inputCls} />
              <ErrMsg msg={errors.experience} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Education</Label>
              <input value={form.education} onChange={(e) => set("education", e.target.value)} placeholder="e.g. Bachelor's in Computer Science" className={inputCls} />
            </div>
            <div>
              <Label>Application Deadline</Label>
              <input type="datetime-local" value={form.applicationDeadline} onChange={(e) => set("applicationDeadline", e.target.value)} className={inputCls + " [color-scheme:dark]"} />
            </div>
          </div>

          <Toggle checked={form.featured} onChange={() => set("featured", !form.featured)} label="Mark as Featured Job" />
        </SectionCard>

        {/* DESCRIPTION */}
        <SectionCard accent="text-amber-400" icon="📝" title="Job Description">
          <div>
            <Label required>Description</Label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
              rows={5} placeholder="Describe the role..." className={inputCls + " resize-y min-h-[120px]"} />
            <ErrMsg msg={errors.description} />
          </div>
        </SectionCard>

        {/* DETAILS */}
        <SectionCard accent="text-emerald-400" icon="📋" title="Role Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <TagInput label="Responsibilities" items={form.responsibilities} onChange={(v) => set("responsibilities", v)} placeholder="Add a responsibility…" />
            <TagInput label="Requirements"     items={form.requirements}    onChange={(v) => set("requirements", v)}    placeholder="Add a requirement…" />
            <TagInput label="Benefits"         items={form.benefits}        onChange={(v) => set("benefits", v)}        placeholder="Add a benefit…" />
            <TagInput label="Skills / Tags"    items={form.tags}            onChange={(v) => set("tags", v)}            placeholder="Add a skill or keyword…" />
          </div>
        </SectionCard>

        {/* SALARY */}
        <SectionCard accent="text-pink-400" icon="💰" title="Compensation">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Min Salary</Label>
              <input type="number" min="0" value={form.salary.min} onChange={(e) => setSalary("min", e.target.value)} placeholder="e.g. 50000" className={inputCls} />
            </div>
            <div>
              <Label>Max Salary</Label>
              <input type="number" min="0" value={form.salary.max} onChange={(e) => setSalary("max", e.target.value)} placeholder="e.g. 80000" className={inputCls} />
            </div>
            <div>
              <Label>Currency</Label>
              <select value={form.salary.currency} onChange={(e) => setSalary("currency", e.target.value)} className={selectCls}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <Toggle checked={form.salary.isVisible} onChange={() => setSalary("isVisible", !form.salary.isVisible)} label="Show salary to applicants" />
        </SectionCard>

        {/* ACTIONS */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigate("/admin/vacancy")}
            className="px-5 py-2.5 text-sm font-semibold rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition"
          >
            ← Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-7 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-sm font-bold tracking-wide shadow-lg shadow-violet-900/40 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Saving…</>
            ) : (
              <>Save Changes →</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}