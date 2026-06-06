import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById, updateBlog } from "../../services/blog";

// ── helpers (same as AddNewBlog) ──────────────────────────────────────────────
const slugify = (str) =>
  str.toLowerCase().trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const CATEGORIES = [
  "Technology", "Business", "Design", "Marketing",
  "Science", "Health", "Travel", "Lifestyle", "Other",
];
const STATUSES = ["draft", "published", "archived"];

const validate = (data) => {
  const errors = {};
  if (!data.title || data.title.length < 3)   errors.title    = "Title must be at least 3 characters.";
  if (!data.slug  || data.slug.length  < 3)   errors.slug     = "Slug must be at least 3 characters.";
  if (!data.category || data.category.length < 2) errors.category = "Category is required.";
  if (!data.excerpt || data.excerpt.length < 10)  errors.excerpt  = "Excerpt must be at least 10 characters.";
  if (!data.content || data.content.length < 20)  errors.content  = "Content must be at least 20 characters.";
  if (!data.author  || data.author.length  < 2)   errors.author   = "Author is required.";
  if (data.seo?.metaDescription?.length > 160)    errors.seoMetaDescription = "Meta description should be under 160 characters.";
  return errors;
};

// ── shared primitive components ───────────────────────────────────────────────
function Field({ label, error, required, hint, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint  && !error && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-rose-500 flex items-center gap-1">
        <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
        {error}
      </p>}
    </div>
  );
}

function Input({ error, ...props }) {
  return (
    <input
      className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-offset-1 bg-white ${
        error ? "border-rose-400 focus:border-rose-400 focus:ring-rose-200"
              : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"}`}
      {...props}
    />
  );
}

function Textarea({ error, rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none resize-y transition focus:ring-2 focus:ring-offset-1 bg-white ${
        error ? "border-rose-400 focus:border-rose-400 focus:ring-rose-200"
              : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"}`}
      {...props}
    />
  );
}

function Select({ error, children, ...props }) {
  return (
    <select
      className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-offset-1 bg-white ${
        error ? "border-rose-400 focus:border-rose-400 focus:ring-rose-200"
              : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"}`}
      {...props}
    >
      {children}
    </select>
  );
}

function SectionHeading({ icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
      <span className="text-lg">{icon}</span>
      <div>
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ── cover image upload (same behaviour as AddNewBlog) ─────────────────────────
function CoverImageUpload({ value, preview, onChange, error }) {
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) onChange(file);
  };

  return (
    <div className="flex flex-col gap-2">
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer py-10 transition ${
            error ? "border-rose-300 bg-rose-50/40 hover:bg-rose-50"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-indigo-300"}`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${error ? "bg-rose-100" : "bg-indigo-50"}`}>
            <svg className={`w-6 h-6 ${error ? "text-rose-400" : "text-indigo-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3 3h18"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700">Drop image here or <span className="text-indigo-600">browse</span></p>
            <p className="text-xs text-slate-400 mt-1">Leave empty to keep current cover</p>
          </div>
          <input ref={inputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f); }} className="hidden" />
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 h-52">
          <img src={preview} alt="Cover preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-3">
            <button type="button" onClick={() => inputRef.current?.click()} className="px-3 py-1.5 rounded-lg bg-white/90 text-xs font-medium text-slate-800 hover:bg-white transition">Change</button>
            <button type="button" onClick={() => onChange(null)} className="px-3 py-1.5 rounded-lg bg-rose-500/90 text-xs font-medium text-white hover:bg-rose-600 transition">Remove</button>
          </div>
          {value?.name && (
            <div className="absolute bottom-2 left-2 right-2">
              <span className="inline-block max-w-full truncate bg-black/50 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-sm">{value.name}</span>
            </div>
          )}
          <input ref={inputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f); }} className="hidden" />
        </div>
      )}
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  title: "", slug: "", category: "", tags: "", highlight: false,
  excerpt: "", content: "", coverImage: null, author: "",
  status: "draft", publishedAt: "",
  seo: { metaTitle: "", metaDescription: "", keywords: "" },
};

export default function EditBlog() {
  const { id }       = useParams();
  const navigate     = useNavigate();

  const [form,         setForm]        = useState(EMPTY_FORM);
  const [coverPreview, setCoverPreview]= useState(null);
  const [errors,       setErrors]      = useState({});
  const [touched,      setTouched]     = useState({});
  const [fetching,     setFetching]    = useState(true);
  const [submitting,   setSubmitting]  = useState(false);
  const [submitResult, setSubmitResult]= useState(null);
  const [charCounts,   setCharCounts]  = useState({ excerpt: 0, content: 0 });

  // ── load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBlogById(id);
        const b   = res.data;
        setForm({
          title:      b.title       ?? "",
          slug:       b.slug        ?? "",
          category:   b.category    ?? "",
          tags:       Array.isArray(b.tags) ? b.tags.join(", ") : "",
          highlight:  b.highlight   ?? false,
          excerpt:    b.excerpt     ?? "",
          content:    b.content     ?? "",
          coverImage: null,                // always null — user must re-upload to change
          author:     b.author      ?? "",
          status:     b.status      ?? "draft",
          publishedAt: b.publishedAt ? new Date(b.publishedAt).toISOString().slice(0, 16) : "",
          seo: {
            metaTitle:       b.seo?.metaTitle       ?? "",
            metaDescription: b.seo?.metaDescription ?? "",
            keywords: Array.isArray(b.seo?.keywords) ? b.seo.keywords.join(", ") : "",
          },
        });
        setCharCounts({ excerpt: b.excerpt?.length ?? 0, content: b.content?.length ?? 0 });
        // show existing cover as preview (string URL, not a File)
        if (b.coverImage) setCoverPreview(b.coverImage);
      } catch {
        setSubmitResult({ success: false, message: "Failed to load blog post." });
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id]);

  // ── cover handler ─────────────────────────────────────────────────────────
  const handleCoverImage = useCallback((file) => {
    if (!file) {
      setForm((p) => ({ ...p, coverImage: null }));
      setCoverPreview(null);
      return;
    }
    setForm((p) => ({ ...p, coverImage: file }));
    setCoverPreview(URL.createObjectURL(file));
    setErrors((p) => { const c = { ...p }; delete c.coverImage; return c; });
  }, []);

  // ── field handler ─────────────────────────────────────────────────────────
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("seo.")) {
      const key = name.split(".")[1];
      setForm((p) => ({ ...p, seo: { ...p.seo, [key]: value } }));
    } else {
      const val = type === "checkbox" ? checked : value;
      setForm((p) => {
        const next = { ...p, [name]: val };
        if (name === "title" && !touched.slug) next.slug = slugify(val);
        return next;
      });
      if (name === "excerpt" || name === "content")
        setCharCounts((p) => ({ ...p, [name]: value.length }));
    }
    setErrors((p) => { const c = { ...p }; delete c[name]; return c; });
  }, [touched.slug]);

  const handleBlur = useCallback((e) => {
    setTouched((p) => ({ ...p, [e.target.name]: true }));
  }, []);

  // ── save ──────────────────────────────────────────────────────────────────
  const handleSave = async (e, statusOverride) => {
    e.preventDefault();
    setSubmitResult(null);

    const payload = {
      ...form,
      status: statusOverride || form.status,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      publishedAt: form.publishedAt || undefined,
      seo: {
        metaTitle:       form.seo.metaTitle,
        metaDescription: form.seo.metaDescription,
        keywords: form.seo.keywords
          ? form.seo.keywords.split(",").map((k) => k.trim()).filter(Boolean)
          : [],
      },
    };

    // coverImage not required on edit (keep existing if null)
    const errs = validate({ ...payload, coverImage: payload.coverImage ?? "existing" });
    if (Object.keys(errs).length) {
      setErrors(errs);
      setTouched(Object.keys(errs).reduce((a, k) => ({ ...a, [k]: true }), {}));
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();

      // only append new cover if user picked one
      if (payload.coverImage instanceof File) {
        fd.append("coverImage", payload.coverImage);
      }

      const scalars = ["title", "slug", "category", "author", "status", "excerpt", "content", "highlight"];
      scalars.forEach((k) => { if (payload[k] != null) fd.append(k, payload[k]); });

      if (payload.publishedAt) fd.append("publishedAt", payload.publishedAt);
      payload.tags.forEach((t) => fd.append("tags[]", t));
      fd.append("seo[metaTitle]",       payload.seo.metaTitle       ?? "");
      fd.append("seo[metaDescription]", payload.seo.metaDescription  ?? "");
      payload.seo.keywords.forEach((kw) => fd.append("seo[keywords][]", kw));

      await updateBlog(id, fd);
      setSubmitResult({ success: true, message: "Blog post updated successfully!" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitResult({ success: false, message: err.message || "Failed to update blog post." });
    } finally {
      setSubmitting(false);
    }
  };

  const hasErr = (name) => touched[name] && errors[name];

  // ── loading ───────────────────────────────────────────────────────────────
  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* PAGE HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-mono tracking-wide uppercase">
            <span className="cursor-pointer hover:text-slate-600" onClick={() => navigate("/admin/blogs")}>Dashboard</span>
            <span>›</span><span>Blogs</span><span>›</span>
            <span className="text-indigo-500">Edit Post</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Edit Blog Post</h1>
          <p className="text-sm text-slate-500 mt-1">Update content and republish when ready.</p>
        </div>

        {/* RESULT BANNER */}
        {submitResult && (
          <div className={`mb-6 rounded-xl px-5 py-4 text-sm flex items-start gap-3 border ${
            submitResult.success
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"}`}>
            <span className="text-lg leading-none mt-0.5">{submitResult.success ? "✅" : "❌"}</span>
            <p>{submitResult.message}</p>
          </div>
        )}

        <form onSubmit={(e) => handleSave(e)} noValidate className="space-y-6">

          {/* SECTION 1 — Core */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <SectionHeading icon="📝" title="Core Information" subtitle="The essential details of your post" />

            <Field label="Title" required error={hasErr("title") && errors.title}>
              <Input name="title" value={form.title} onChange={handleChange} onBlur={handleBlur} error={hasErr("title")} placeholder="Post title" maxLength={200} />
            </Field>

            <Field label="Slug" required error={hasErr("slug") && errors.slug} hint="Auto-generated from title. You can customize it.">
              <div className={`flex items-center rounded-lg border overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 bg-white transition ${hasErr("slug") ? "border-rose-400" : "border-slate-200"}`}>
                <span className="px-3 text-xs text-slate-400 bg-slate-50 border-r border-slate-200 py-2.5 select-none font-mono">/blog/</span>
                <input name="slug" value={form.slug} onChange={handleChange} onBlur={handleBlur} placeholder="your-post-slug" className="flex-1 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none font-mono bg-white" />
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Category" required error={hasErr("category") && errors.category}>
                <Select name="category" value={form.category} onChange={handleChange} onBlur={handleBlur} error={hasErr("category")}>
                  <option value="">Select category…</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Field>
              <Field label="Status">
                <Select name="status" value={form.status} onChange={handleChange}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </Select>
              </Field>
            </div>

            <Field label="Author" required error={hasErr("author") && errors.author}>
              <Input name="author" value={form.author} onChange={handleChange} onBlur={handleBlur} error={hasErr("author")} placeholder="e.g. Jane Doe" />
            </Field>
          </div>

          {/* SECTION 2 — Content */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <SectionHeading icon="✍️" title="Content" subtitle="Write the body and summary of your post" />

            <Field label="Excerpt" required error={hasErr("excerpt") && errors.excerpt} hint={`${charCounts.excerpt}/300 characters`}>
              <Textarea name="excerpt" rows={3} value={form.excerpt} onChange={handleChange} onBlur={handleBlur} error={hasErr("excerpt")} placeholder="A short summary…" maxLength={300} />
            </Field>

            <Field label="Content" required error={hasErr("content") && errors.content} hint={`${charCounts.content} characters (min 20)`}>
              <Textarea name="content" rows={10} value={form.content} onChange={handleChange} onBlur={handleBlur} error={hasErr("content")} placeholder="Write your full blog post here. Markdown is supported…" />
            </Field>
          </div>

          {/* SECTION 3 — Media & Tags */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <SectionHeading icon="🖼️" title="Media & Tags" subtitle="Cover image and post metadata" />

            <Field label="Cover Image" hint="Leave empty to keep the current cover image.">
              <CoverImageUpload value={form.coverImage} preview={coverPreview} onChange={handleCoverImage} error={hasErr("coverImage")} />
            </Field>

            <Field label="Tags" hint="Comma-separated — e.g. react, tutorial, webdev">
              <Input name="tags" value={form.tags} onChange={handleChange} placeholder="react, tutorial, webdev" />
              {form.tags && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">#{tag}</span>
                  ))}
                </div>
              )}
            </Field>

            <div className="grid grid-cols-2 gap-4 items-start">
              <div className="flex items-center gap-3 pt-1">
                <input type="checkbox" name="highlight" id="highlight" checked={form.highlight} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 accent-indigo-500 cursor-pointer" />
                <label htmlFor="highlight" className="text-sm text-slate-700 cursor-pointer select-none">Mark as highlight post</label>
              </div>
              <Field label="Publish Date" hint="Leave blank to keep as draft">
                <Input name="publishedAt" type="datetime-local" value={form.publishedAt} onChange={handleChange} />
              </Field>
            </div>
          </div>

          {/* SECTION 4 — SEO */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <SectionHeading icon="🔍" title="SEO" subtitle="Optional — improves search engine discoverability" />

            <Field label="Meta Title" hint="Defaults to post title if blank">
              <Input name="seo.metaTitle" value={form.seo.metaTitle} onChange={handleChange} placeholder="Custom SEO title…" maxLength={60} />
            </Field>

            <Field label="Meta Description" error={hasErr("seoMetaDescription") && errors.seoMetaDescription} hint={`${form.seo.metaDescription.length}/160 characters`}>
              <Textarea name="seo.metaDescription" rows={2} value={form.seo.metaDescription} onChange={handleChange} error={hasErr("seoMetaDescription")} placeholder="Short description for search engine results…" maxLength={160} />
            </Field>

            <Field label="Keywords" hint="Comma-separated SEO keywords">
              <Input name="seo.keywords" value={form.seo.keywords} onChange={handleChange} placeholder="react, blog, tutorial" />
            </Field>
          </div>

          {/* ACTION BAR */}
          <div className="flex items-center justify-between gap-4 pt-2 pb-6">
            <button
              type="button"
              onClick={() => navigate("/admin/blogs")}
              className="px-5 py-2.5 rounded-xl text-sm text-slate-600 border border-slate-200 hover:bg-slate-50 transition font-medium"
            >
              ← Back
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={submitting}
                onClick={(e) => handleSave(e, "draft")}
                className="px-5 py-2.5 rounded-xl text-sm text-slate-700 border border-slate-200 hover:bg-slate-50 transition font-medium disabled:opacity-50"
              >
                Save as Draft
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={(e) => handleSave(e, "published")}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition disabled:opacity-60 flex items-center gap-2 shadow-sm shadow-indigo-200"
              >
                {submitting ? (
                  <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Saving…</>
                ) : (
                  <>Update Post <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg></>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}