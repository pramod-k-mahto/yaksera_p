import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, Building2, CalendarDays, CircleAlert,
  Search, Eye, Trash2, Download, Filter, X, RefreshCw,
} from "lucide-react";
import { getContacts, deleteContact, updateContactStatus } from "../../services/contact";

// ── status config ──────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  new:         "bg-blue-500/10 text-blue-300 border-blue-500/20",
  "in-review": "bg-purple-500/10 text-purple-300 border-purple-500/20",
  contacted:   "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  closed:      "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
};

const STATUS_LABEL = {
  new: "New", "in-review": "In Review", contacted: "Contacted", closed: "Closed",
};

// ── helpers ────────────────────────────────────────────────────────────────────
const fmt = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

// FIX: projectBudget is an object { currency, amount, formatted }
// Always use .formatted for display, falling back gracefully.
const fmtBudget = (budget) => {
  if (!budget) return "—";
  if (typeof budget === "string") return budget;           // legacy string
  return budget.formatted ?? `${budget.currency} ${Number(budget.amount).toLocaleString("en-US")}`;
};

// ── skeleton row ───────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="border-b border-white/5 animate-pulse">
    {[160, 200, 120, 100, 90, 80, 80].map((w, i) => (
      <td key={i} className="px-6 py-5">
        <div className="h-4 rounded-full bg-white/10" style={{ width: w }} />
      </td>
    ))}
  </tr>
);

// ── detail modal ───────────────────────────────────────────────────────────────
function DetailModal({ contact, onClose, onStatusChange }) {
  const [saving, setSaving] = useState(false);

  const handleStatusUpdate = async (status) => {
    setSaving(true);
    try {
      await updateContactStatus(contact._id, status);
      onStatusChange(contact._id, status);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative z-10 w-full max-w-lg rounded-[28px] border border-white/10 bg-[#0d1117] p-8 shadow-2xl"
          initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        >
          <button onClick={onClose} className="absolute right-5 top-5 text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>

          <h2 className="text-xl font-black text-white mb-1">{contact.fullName}</h2>
          <p className="text-xs text-white/40 mb-6">{contact._id}</p>

          <div className="space-y-3 text-sm">
            {[
              { label: "Email",     value: contact.email },
              { label: "Phone",     value: `${contact.phone?.countryCode ?? ""} ${contact.phone?.number ?? "—"}`.trim() },
              // FIX: render budget object correctly
              { label: "Budget",    value: fmtBudget(contact.projectBudget) },
              { label: "Submitted", value: fmt(contact.createdAt) },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-3">
                <span className="w-20 flex-shrink-0 text-white/40">{label}</span>
                <span className="text-white/80">{value || "—"}</span>
              </div>
            ))}

            {contact.projectDetails && (
              <div className="flex gap-3">
                <span className="w-20 flex-shrink-0 text-white/40">Details</span>
                <span className="text-white/80 leading-relaxed">{contact.projectDetails}</span>
              </div>
            )}
          </div>

          {/* status update */}
          <div className="mt-6">
            <p className="text-xs text-white/40 mb-3 font-semibold uppercase tracking-widest">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_LABEL).map(([key, label]) => (
                <button
                  key={key}
                  disabled={saving || contact.status === key}
                  onClick={() => handleStatusUpdate(key)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-all
                    ${contact.status === key
                      ? STATUS_STYLES[key] + " opacity-100 cursor-default"
                      : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
function ContactFormManagement() {
  const [contacts, setContacts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("");
  const [selected, setSelected]     = useState(null);
  const [deleting, setDeleting]     = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  // FIX: Accept page param and update pagination.page from the API response,
  //      so the active page highlight in the pagination bar is always correct.
  const loadContacts = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter) params.append("status", statusFilter);
      if (search)       params.append("search", search);

      const res = await getContacts(`?${params.toString()}`);

      console.log(res.data.inquiries)
      setContacts(res.data.inquiries);
      // FIX: spread API pagination but force `page` from our request arg,
      //      in case the backend omits or mismatches the current page field.
      setPagination({ ...res.pagination, page });
    } catch (e) {
      setError(e.message || "Failed to load contacts.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    // Reset to page 1 whenever filter or search changes
    const t = setTimeout(() => loadContacts(1), search ? 400 : 0);
    return () => clearTimeout(t);
  }, [loadContacts, search]);

  // ── delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this contact?")) return;
    setDeleting(id);
    try {
      await deleteContact(id);
      setContacts((p) => p.filter((c) => c._id !== id));
      setPagination((p) => ({ ...p, total: Math.max(0, p.total - 1) }));
    } catch (e) {
      alert(e.message || "Delete failed.");
    } finally {
      setDeleting(null);
    }
  };

  // ── status update (from modal) ─────────────────────────────────────────────
  const handleStatusChange = (id, status) => {
    setContacts((p) => p.map((c) => (c._id === id ? { ...c, status } : c)));
    setSelected((p) => (p?._id === id ? { ...p, status } : p));
  };

  // FIX: Stats — total comes from pagination (full dataset).
  //      Per-status counts are page-scoped but labeled clearly.
  //      "New Leads" / "In Review" / "Closed" count from the current page only.
  const stats = [
    { title: "Total Requests", value: pagination.total?.toLocaleString(), icon: Mail },
    { title: "New (this page)",      value: contacts.filter((c) => c.status === "new").length,        icon: CircleAlert },
    { title: "In Review (this page)", value: contacts.filter((c) => c.status === "in-review").length, icon: CalendarDays },
    { title: "Closed (this page)",   value: contacts.filter((c) => c.status === "closed").length,     icon: Building2 },
  ];

  // ── export CSV ─────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const header = ["Name", "Email", "Phone", "Budget", "Status", "Date"];
    const rows = contacts.map((c) => [
      c.fullName,
      c.email,
      `${c.phone?.countryCode ?? ""} ${c.phone?.number ?? ""}`.trim(),
      // FIX: export the formatted budget string, not [object Object]
      fmtBudget(c.projectBudget),
      c.status,
      fmt(c.createdAt),
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "contacts.csv";
    a.click();
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* detail modal */}
      {selected && (
        <DetailModal
          contact={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* TOP ──────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            className="text-[30px] md:text-[36px] font-black tracking-tight text-white">
            Contact Form Management
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-2 max-w-2xl text-sm md:text-[15px] leading-7 text-white/50">
            Manage all incoming client inquiries, leads, project requests,
            consultation bookings, and support conversations from your website.
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
          className="flex flex-wrap gap-3">
          <button onClick={() => loadContacts(1)}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/80 transition-all hover:border-white/20 hover:bg-white/[0.05] hover:text-white">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-2 rounded-2xl bg-[#e8192c] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(232,25,44,0.28)] transition-all hover:-translate-y-[2px] hover:shadow-[0_16px_40px_rgba(232,25,44,0.4)]">
            <Download size={16} />
            Export CSV
          </button>
        </motion.div>
      </div>

      {/* STATS ────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.title}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }} whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
              <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full bg-[#e8192c]/10 blur-3xl" />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#e8192c]">
                <Icon size={24} />
              </div>
              <div className="mt-6">
                <p className="text-sm text-white/45">{item.title}</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-white">{item.value}</h2>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* TABLE ────────────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] backdrop-blur-xl">

        {/* TABLE HEADER */}
        <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Client Inquiries</h2>
            <p className="mt-1 text-sm text-white/45">
              {loading ? "Loading…" : `${pagination.total} total requests`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* status filter */}
            <div className="relative">
              <select value={statusFilter} onChange={(e) => setStatus(e.target.value)}
                className="appearance-none rounded-2xl border border-white/10 bg-[#0f172a] pl-4 pr-10 py-3 text-sm text-white/70 outline-none focus:border-white/20">
                <option value="">All Status</option>
                {Object.entries(STATUS_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            </div>

            {/* search */}
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0f172a] px-4 py-3 lg:w-[280px]">
              <Search size={18} className="text-white/40 flex-shrink-0" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contacts…"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
              {search && (
                <button onClick={() => setSearch("")} className="text-white/30 hover:text-white/70">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* error */}
        {error && (
          <div className="mx-6 my-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            ⚠ {error} —{" "}
            <button className="underline hover:text-red-200" onClick={() => loadContacts(1)}>retry</button>
          </div>
        )}

        {/* TABLE BODY */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-white/10">
              <tr className="text-left">
                {["Client", "Email", "Phone", "Budget", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-sm text-white/30">
                    No contacts found.
                  </td>
                </tr>
              ) : (
                contacts.map((contact, index) => (
                  <motion.tr key={contact._id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-white/5 transition-all duration-300 hover:bg-white/[0.03]">

                    {/* CLIENT */}
                    <td className="px-6 py-5">
                      <h3 className="text-sm font-semibold text-white">{contact.fullName}</h3>
                      <p className="mt-0.5 text-xs text-white/35 font-mono">{contact._id.slice(-8).toUpperCase()}</p>
                    </td>

                    {/* EMAIL */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-white/30 flex-shrink-0" />
                        <span className="text-sm text-white/65">{contact.email}</span>
                      </div>
                    </td>

                    {/* PHONE */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-white/30 flex-shrink-0" />
                        <span className="text-sm text-white/55">
                          {contact.phone?.countryCode} {contact.phone?.number || "—"}
                        </span>
                      </div>
                    </td>

                    {/* BUDGET — FIX: use fmtBudget() to handle object shape */}
                    <td className="px-6 py-5">
                      <span className="rounded-full border border-[#e8192c]/20 bg-[#e8192c]/10 px-3 py-1.5 text-xs font-semibold text-[#ff7585]">
                        {fmtBudget(contact.projectBudget)}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-5">
                      <span className="text-sm text-white/55">{fmt(contact.createdAt)}</span>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${STATUS_STYLES[contact.status] ?? "bg-white/10 text-white/50"}`}>
                        {STATUS_LABEL[contact.status] ?? contact.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelected(contact)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/60 transition-all hover:border-[#e8192c]/30 hover:bg-[#e8192c]/10 hover:text-[#ff6b81]">
                          <Eye size={17} />
                        </button>
                        <button onClick={() => handleDelete(contact._id)}
                          disabled={deleting === contact._id}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/60 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-40">
                          {deleting === contact._id
                            ? <RefreshCw size={15} className="animate-spin" />
                            : <Trash2 size={17} />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
            <p className="text-xs text-white/40">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => loadContacts(p)}
                  className={`h-9 w-9 rounded-xl text-sm font-semibold transition-all
                    ${p === pagination.page
                      ? "bg-[#e8192c] text-white"
                      : "border border-white/10 text-white/50 hover:border-white/20 hover:text-white"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ContactFormManagement;