import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Eye, Pencil, Trash2, Calendar,
  TrendingUp, Globe, ArrowUpRight, Loader2,
  AlertCircle, RefreshCw, BarChart2,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  getAllCaseStudies,
  deleteCaseStudy,
} from "../../services/caseStudies";

// ── status badge ───────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Published: "bg-green-500/10 text-green-400",
    Draft:     "bg-yellow-500/10 text-yellow-400",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${map[status] ?? "bg-blue-500/10 text-blue-400"}`}>
      {status}
    </span>
  );
};

// ── confirm delete modal ───────────────────────────────────────────────────
const DeleteModal = ({ item, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0f172a] p-8"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
        <Trash2 size={20} className="text-red-400" />
      </div>
      <h3 className="text-lg font-bold">Delete Case Study</h3>
      <p className="mt-2 text-sm leading-6 text-white/50">
        Are you sure you want to delete <span className="font-semibold text-white">{item?.title}</span>? This action cannot be undone.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500 py-3 text-sm font-semibold transition hover:bg-red-600 disabled:opacity-60"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          Delete
        </button>
      </div>
    </motion.div>
  </div>
);

// ── main ───────────────────────────────────────────────────────────────────
function CaseStudiesManagement() {
  const navigate = useNavigate();

  const [studies, setStudies]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [search, setSearch]           = useState("");
  const [categoryFilter, setCategory] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── fetch ──────────────────────────────────────────────────────────────
  const fetchStudies = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllCaseStudies({ admin: "true" });
      setStudies(res?.data ?? []);
    } catch {
      setError("Failed to load case studies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudies(); }, []);

  // ── derived stats ──────────────────────────────────────────────────────
  const total      = studies.length;
  const published  = studies.filter((s) => s.status === "Published").length;
  const featured   = studies.find((s) => s.featured);
  const industries = new Set(studies.map((s) => s.industry).filter(Boolean)).size;

  // ── filter ─────────────────────────────────────────────────────────────
  const CATEGORIES = ["All", "Website", "Mobile App", "AI Solution", "SaaS", "E-Commerce", "Dashboard", "Other"];

  const filtered = studies.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    const matchCat    = categoryFilter === "All" || s.category === categoryFilter;
    return matchSearch && matchCat;
  });

  // ── delete ─────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await deleteCaseStudy(deleteTarget.slug);
      setStudies((prev) => prev.filter((s) => s.slug !== deleteTarget.slug));
      setDeleteTarget(null);
    } catch {
      setError("Failed to delete. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#050816] text-white">

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            item={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleteLoading}
          />
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="inline-flex rounded-full border border-[#e8192c]/20 bg-[#e8192c]/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-[#ff4d67]">
            CASE STUDIES CMS
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
            Case Studies Management
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
            Manage success stories, enterprise projects, business growth reports and detailed client results.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* SEARCH */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <Search size={18} className="text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search case studies..."
              className="bg-transparent text-sm outline-none placeholder:text-white/30"
            />
          </div>

          {/* REFRESH */}
          <button
            onClick={fetchStudies}
            className="flex h-[46px] w-[46px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <RefreshCw size={16} />
          </button>

          {/* ADD */}
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <NavLink
              to="/admin/addCaseStudy"
              className="flex items-center gap-2 rounded-2xl bg-[#e8192c] px-5 py-3 text-sm font-semibold shadow-[0_12px_30px_rgba(232,25,44,0.28)] transition-all duration-300 hover:shadow-[0_18px_40px_rgba(232,25,44,0.38)]"
            >
              <Plus size={18} />
              Add Case Study
            </NavLink>
          </motion.div>
        </div>
      </div>

      {/* STATS */}
      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
        {[
          { label: "Total Studies",  value: total,     sub: `+${total} added`,       color: "text-green-400" },
          { label: "Published",      value: published, sub: "Public portfolio",       color: "text-blue-400"  },
          { label: "Drafts",         value: total - published, sub: "Pending review", color: "text-yellow-400"},
          { label: "Industries",     value: industries, sub: "Global sectors",        color: "text-[#ff4d67]" },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            className="rounded-[28px] border border-white/10 bg-[#0f172a] p-6"
          >
            <p className="text-sm text-white/45">{card.label}</p>
            <h2 className="mt-4 text-5xl font-black">
              {loading ? <Loader2 size={28} className="animate-spin text-white/20" /> : card.value}
            </h2>
            <p className={`mt-3 text-sm ${card.color}`}>{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* CATEGORY FILTER */}
      <div className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
              categoryFilter === cat
                ? "border-[#e8192c]/40 bg-[#e8192c]/10 text-[#ff4d67]"
                : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ERROR */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400"
          >
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TABLE */}
      <div className="mt-6 overflow-hidden rounded-[32px] border border-white/10 bg-[#0f172a]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold">Case Studies</h2>
            <p className="mt-1 text-sm text-white/40">
              {filtered.length} {categoryFilter !== "All" ? categoryFilter : ""} project{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-white/20" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-white/30">
            <BarChart2 size={36} />
            <p className="text-sm">No case studies found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-white/10">
                  {["Project", "Category", "Tech Stack", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className={`px-6 py-5 text-xs font-semibold uppercase tracking-[0.15em] text-white/35 ${h === "Actions" ? "text-right" : "text-left"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, index) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="border-b border-white/5 transition-all duration-300 hover:bg-white/[0.03]"
                  >
                    {/* PROJECT */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="h-14 w-20 shrink-0 rounded-2xl object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <div
                          className="hidden h-14 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8192c] via-[#ff4d67] to-[#ff8ea1]"
                        />
                        <div>
                          <h3 className="max-w-[200px] text-sm font-semibold leading-6">{item.title}</h3>
                          <div className="mt-1 flex items-center gap-1 text-xs text-white/35">
                            <Globe size={11} />
                            {item.industry || "Digital Solution"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-6 py-5">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                        {item.category}
                      </span>
                    </td>

                    {/* TECH STACK */}
                    <td className="px-6 py-5">
                      <span className="text-sm text-white/55">
                        {item.techStack?.slice(0, 3).join(" • ") || "—"}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-white/55">
                        <Calendar size={14} />
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : "—"}
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        {item.liveUrl && (
                          <a
                            href={item.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
                          >
                            <Eye size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => navigate(`/admin/editCaseStudy/${item.slug}`)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 transition hover:bg-[#e8192c]/15 hover:text-[#ff4d67]"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 transition hover:bg-red-500/15 hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FEATURED + PERFORMANCE */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* FEATURED CASE */}
        <motion.div
          whileHover={{ y: -4 }}
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#111827] p-8"
        >
          <div className="absolute right-[-60px] top-[-60px] h-40 w-40 rounded-full bg-[#e8192c]/20 blur-3xl" />
          <div className="relative z-10">
            <span className="inline-flex rounded-full bg-[#e8192c]/10 px-3 py-1 text-xs font-semibold text-[#ff4d67]">
              FEATURED CASE
            </span>
            {featured ? (
              <>
                <h2 className="mt-5 text-3xl font-black leading-tight">{featured.title}</h2>
                <p className="mt-4 max-w-lg text-sm leading-7 text-white/55">{featured.shortDescription}</p>
                <button
                  onClick={() => navigate(`/admin/editCaseStudy/${featured.slug}`)}
                  className="mt-6 flex items-center gap-2 rounded-2xl bg-[#e8192c] px-5 py-3 text-sm font-semibold transition hover:-translate-y-1"
                >
                  View Details <ArrowUpRight size={16} />
                </button>
              </>
            ) : (
              <p className="mt-5 text-sm text-white/40">No featured case study set. Mark one as featured when adding.</p>
            )}
          </div>
        </motion.div>

        {/* PERFORMANCE OVERVIEW */}
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-[32px] border border-white/10 bg-[#0f172a] p-8"
        >
          <h2 className="text-2xl font-bold">Performance Overview</h2>
          <div className="mt-8 space-y-6">
            {[
              { label: "Published Rate", value: total ? Math.round((published / total) * 100) : 0 },
              { label: "With Live URL",  value: total ? Math.round((studies.filter((s) => s.liveUrl).length / total) * 100) : 0 },
              { label: "Featured Set",  value: total ? Math.round((studies.filter((s) => s.featured).length / total) * 100) : 0 },
            ].map((item, index) => (
              <div key={index}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-white/55">{item.label}</span>
                  <span className="text-sm font-semibold">{item.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#e8192c] to-[#ff4d67]"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default CaseStudiesManagement;