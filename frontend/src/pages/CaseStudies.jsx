import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllCaseStudies } from "../services/caseStudies";
import { Loader2, AlertCircle } from "lucide-react";

/* ───────────────── CARD ───────────────── */
function CaseStudyCard({ item, index }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      whileHover={{ y: -10 }}
      className="relative overflow-hidden rounded-2xl"
      style={{ boxShadow: "var(--shadow-lg)" }}
    >
      <div className="relative h-[500px] overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.8 }}
          src={item.thumbnail}
          alt={item.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop";
          }}
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* CONTENT */}
        <div className="absolute bottom-0 left-0 w-full space-y-4 p-8">
          <h2 style={{ color: "#fff", fontSize: "40px", fontWeight: 900, lineHeight: 1.1 }}>
            {item.title}
          </h2>

          {/* TAGS — category + first 2 techStack items */}
          <div className="flex flex-wrap gap-3">
            <span
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(232,25,44,0.2)",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: "999px",
                fontSize: "12px",
                backdropFilter: "blur(10px)",
              }}
            >
              {item.category}
            </span>
            {item.techStack?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  padding: "6px 14px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  backdropFilter: "blur(10px)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* SHORT DESC */}
          {item.shortDescription && (
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "14px",
                lineHeight: 1.7,
                maxWidth: "420px",
              }}
            >
              {item.shortDescription.length > 100
                ? item.shortDescription.slice(0, 100) + "…"
                : item.shortDescription}
            </p>
          )}

          {/* BUTTON */}
          
          <button
            onClick={() => navigate(`/caseStudiesDetail/${item._id}`)}
            style={{
              marginTop: "10px",
              background: "#fff",
              color: "#0d1f4e",
              fontWeight: 700,
              padding: "12px 22px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
            }}
          >
            View Project ↗
          </button>
        </div>

        {/* FEATURED BADGE */}
        {item.featured && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(232,25,44,0.15)",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: "999px",
              fontSize: "11px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              border: "1px solid rgba(232,25,44,0.4)",
              backdropFilter: "blur(10px)",
            }}
          >
            Featured
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ───────────────── SKELETON ───────────────── */
function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-100">
      <div className="h-[500px] animate-pulse bg-gray-200" />
    </div>
  );
}

/* ───────────────── MAIN SECTION ───────────────── */
function CaseStudies() {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await getAllCaseStudies();
        console.log(res)
        setStudies(res?.data ?? []);
      } catch {
        setError("Failed to load case studies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <section
      style={{
        background: "var(--page-bg)",
        padding: "120px 24px",
        fontFamily: "var(--font-primary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND BLUR */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-red-200/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <span
              style={{
                color: "#e8192c",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
              }}
            >
              Portfolio
            </span>
            <h1
              style={{
                fontSize: "52px",
                fontWeight: 900,
                lineHeight: 1.1,
                color: "#0d1f4e",
                maxWidth: "700px",
              }}
            >
              Innovative Case Studies &
              <span style={{ color: "#e8192c" }}> Digital Experiences</span>
            </h1>
          </div>

          <p
            style={{
              maxWidth: "420px",
              fontSize: "16px",
              lineHeight: 1.8,
              color: "var(--text-secondary-default)",
            }}
          >
            Explore premium digital solutions crafted with modern UI/UX,
            scalable architecture, and high-performance development.
          </p>
        </motion.div>

        {/* ERROR */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-10 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600"
            >
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* GRID */}
        {loading ? (
          <div className="grid gap-8 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : studies.length === 0 && !error ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center text-gray-400">
            <p style={{ fontSize: "18px", fontWeight: 600, color: "#0d1f4e" }}>
              No case studies published yet.
            </p>
            <p style={{ fontSize: "14px", color: "var(--text-secondary-default)" }}>
              Check back soon for our latest work.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {studies.map((item, index) => (
              <CaseStudyCard key={item._id} item={item} index={index} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default CaseStudies;