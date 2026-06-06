import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getSingleCaseStudy } from "../services/caseStudies";
import {
  ArrowLeft, Globe, GitBranch, Clock, Building2,
  CheckCircle2, AlertCircle, Loader2, ChevronRight,
  BarChart2, Layers, ExternalLink,
} from "lucide-react";

/* ── tiny helpers ─────────────────────────────────────────────────────────── */
const Tag = ({ children, red }) => (
  <span
    style={{
      padding: "6px 14px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: 600,
      border: red ? "1px solid rgba(232,25,44,0.3)" : "1px solid rgba(13,31,78,0.12)",
      background: red ? "rgba(232,25,44,0.07)" : "rgba(13,31,78,0.04)",
      color: red ? "#e8192c" : "#0d1f4e",
    }}
  >
    {children}
  </span>
);

const SectionHeading = ({ label, title }) => (
  <div className="mb-8">
    <span
      style={{
        color: "#e8192c",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.25em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
    <h2
      style={{
        fontSize: "32px",
        fontWeight: 900,
        color: "#0d1f4e",
        lineHeight: 1.2,
        marginTop: "6px",
      }}
    >
      {title}
    </h2>
  </div>
);

/* ── main ─────────────────────────────────────────────────────────────────── */
function CaseStudiesDetail() {
  const { id } = useParams();
//   console.log(id)
  const navigate  = useNavigate();

  const [study, setStudy]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getSingleCaseStudy(id);
        setStudy(res?.data ?? null);
      } catch {
        setError("Case study not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  /* ── loading ── */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--page-bg)" }}>
        <Loader2 size={36} className="animate-spin text-[#e8192c]" />
      </div>
    );
  }

  /* ── error ── */
  if (error || !study) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center"
        style={{ background: "var(--page-bg)" }}
      >
        <AlertCircle size={40} className="text-red-400" />
        <p style={{ fontSize: "20px", fontWeight: 700, color: "#0d1f4e" }}>{error}</p>
        <button
          onClick={() => navigate("/case-studies")}
          style={{
            background: "#e8192c", color: "#fff", fontWeight: 700,
            padding: "12px 24px", borderRadius: "999px", border: "none", cursor: "pointer",
          }}
        >
          Back to Case Studies
        </button>
      </div>
    );
  }

  /* ── render ── */
  return (
    <div style={{ background: "var(--page-bg)", fontFamily: "var(--font-primary)" }}>

      {/* ── HERO ── */}
      <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img
          src={study.thumbnail}
          alt={study.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/case-studies")}
          className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* HERO CONTENT */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Tag red>{study.category}</Tag>
              {study.featured && (
                <span
                  style={{
                    padding: "6px 14px", borderRadius: "999px", fontSize: "12px",
                    fontWeight: 600, background: "rgba(232,25,44,0.2)",
                    border: "1px solid rgba(232,25,44,0.4)", color: "#fff",
                  }}
                >
                  ★ Featured
                </span>
              )}
            </div>

            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 60px)",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.1,
                maxWidth: "800px",
              }}
            >
              {study.title}
            </h1>

            <p
              style={{
                marginTop: "14px",
                color: "rgba(255,255,255,0.7)",
                fontSize: "16px",
                lineHeight: 1.8,
                maxWidth: "600px",
              }}
            >
              {study.shortDescription}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">

        {/* META ROW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mb-14 grid grid-cols-2 gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-4"
        >
          {[
            { icon: Building2, label: "Industry",  value: study.industry        || "—" },
            { icon: Clock,     label: "Duration",  value: study.projectDuration || "—" },
            { icon: Layers,    label: "Category",  value: study.category        || "—" },
            { icon: BarChart2, label: "Results",   value: study.results?.length ? `${study.results.length} metrics` : "—" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label}>
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                <Icon size={13} /> {label}
              </div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#0d1f4e" }}>{value}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid gap-14 lg:grid-cols-3">

          {/* LEFT — main content */}
          <div className="lg:col-span-2 flex flex-col gap-14">

            {/* OVERVIEW */}
            {study.overview && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <SectionHeading label="Overview" title="About This Project" />
                <p style={{ fontSize: "16px", lineHeight: 1.9, color: "#4a5568" }}>{study.overview}</p>
              </motion.div>
            )}

            {/* PROBLEM */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SectionHeading label="Challenge" title="The Problem" />
              <div
                style={{
                  borderLeft: "3px solid #e8192c",
                  paddingLeft: "20px",
                  color: "#4a5568",
                  fontSize: "16px",
                  lineHeight: 1.9,
                }}
              >
                {study.problem}
              </div>
            </motion.div>

            {/* SOLUTION */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SectionHeading label="Approach" title="Our Solution" />
              <p style={{ fontSize: "16px", lineHeight: 1.9, color: "#4a5568" }}>{study.solution}</p>
            </motion.div>

            {/* CHALLENGES */}
            {study.challenges?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <SectionHeading label="Deep Dive" title="Challenges We Tackled" />
                <div className="flex flex-col gap-5">
                  {study.challenges.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#fff",
                        border: "1px solid rgba(13,31,78,0.08)",
                        borderRadius: "16px",
                        padding: "20px 24px",
                      }}
                    >
                      {c.title && (
                        <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0d1f4e", marginBottom: "8px" }}>
                          {c.title}
                        </h4>
                      )}
                      {c.description && (
                        <p style={{ fontSize: "14px", color: "#718096", lineHeight: 1.8, marginBottom: "10px" }}>
                          {c.description}
                        </p>
                      )}
                      {c.solution && (
                        <div className="flex items-start gap-2">
                          <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-green-500" />
                          <p style={{ fontSize: "14px", color: "#2d3748", lineHeight: 1.8 }}>{c.solution}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SCREENSHOTS */}
            {study.screenshots?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <SectionHeading label="Gallery" title="Project Screenshots" />
                <div className="grid gap-4 md:grid-cols-2">
                  {study.screenshots.map((s, i) => (
                    <div key={i} className="overflow-hidden rounded-2xl border border-gray-100">
                      <img
                        src={s.url}
                        alt={s.caption || `Screenshot ${i + 1}`}
                        className="h-52 w-full object-cover transition duration-500 hover:scale-105"
                      />
                      {s.caption && (
                        <p style={{ padding: "8px 12px", fontSize: "12px", color: "#718096" }}>{s.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT — sidebar */}
          <div className="flex flex-col gap-6">

            {/* RESULTS */}
            {study.results?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{
                  background: "#0d1f4e",
                  borderRadius: "20px",
                  padding: "24px",
                }}
              >
                <p style={{ color: "#e8192c", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>
                  Results
                </p>
                <div className="flex flex-col gap-5">
                  {study.results.map((r, i) => (
                    <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "14px" }}>
                      <p style={{ fontSize: "28px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{r.value}</p>
                      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{r.metric}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TECH STACK */}
            {study.techStack?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{
                  background: "#fff",
                  border: "1px solid rgba(13,31,78,0.08)",
                  borderRadius: "20px",
                  padding: "24px",
                }}
              >
                <p style={{ color: "#e8192c", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {study.techStack.map((t) => <Tag key={t}>{t}</Tag>)}
                </div>
              </motion.div>
            )}

            {/* KEY FEATURES */}
            {study.keyFeatures?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{
                  background: "#fff",
                  border: "1px solid rgba(13,31,78,0.08)",
                  borderRadius: "20px",
                  padding: "24px",
                }}
              >
                <p style={{ color: "#e8192c", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>
                  Key Features
                </p>
                <div className="flex flex-col gap-3">
                  {study.keyFeatures.map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <ChevronRight size={15} className="mt-0.5 shrink-0 text-[#e8192c]" />
                      <p style={{ fontSize: "14px", color: "#2d3748", lineHeight: 1.7 }}>{f}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* LINKS */}
            {(study.liveUrl || study.githubUrl) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col gap-3"
              >
                {study.liveUrl && (
                  <a
                    href={study.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                    style={{
                      background: "#e8192c", color: "#fff", fontWeight: 700,
                      padding: "14px 20px", borderRadius: "999px",
                      textDecoration: "none", fontSize: "14px",
                    }}
                  >
                    <Globe size={16} /> View Live Project <ExternalLink size={14} />
                  </a>
                )}
                {study.githubUrl && (
                  <a
                    href={study.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                    style={{
                      background: "#fff", color: "#0d1f4e", fontWeight: 700,
                      padding: "14px 20px", borderRadius: "999px", border: "1px solid rgba(13,31,78,0.12)",
                      textDecoration: "none", fontSize: "14px",
                    }}
                  >
                    <GitBranch size={16} /> View on GitHub
                  </a>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaseStudiesDetail;