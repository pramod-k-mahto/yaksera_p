import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getPortfolios } from "../services/portfolio";

const filters = [
  "All Projects",
  "Web Application",
  // "Web Development",
  "Mobile App",
  "Ai Automation",
  "Ui/Ux",
];

// const container = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: { staggerChildren: 0.1, delayChildren: 0.2 },
//   },
// };

// const fadeUp = {
//   hidden: { opacity: 0, y: 20 },
//   show: { opacity: 1, y: 0 },
// };

function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState("All Projects");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const headerRef = useRef(null);
  const gridRef = useRef(null);

  const headerInView = useInView(headerRef, {
    once: true,
    margin: "-100px",
  });

  const gridInView = useInView(gridRef, {
    once: true,
    margin: "-100px",
  });

  /* ================= FETCH SAFE ================= */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await getPortfolios();
        // console.log("RAW API RESPONSE:", response);
        // SAFE EXTRACTION (prevents crash)
        const data = response?.data?.data || response?.data || [];

        // FINAL SAFETY CHECK
        if (!Array.isArray(data)) {
          console.error("Invalid API format:", data);
          setProjects([]);
          return;
        }
        setProjects(data);
      } catch (err) {
        console.error("API ERROR:", err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  /* ================= SAFE FILTER ================= */
  const filteredProjects = (() => {
    try {
      if (!Array.isArray(projects)) return [];

      if (active === "All Projects") return projects;

      return projects.filter((p) => {
        const category = p?.category?.toLowerCase?.() || "";
        return category === active.toLowerCase();
      });
    } catch (err) {
      console.error("FILTER ERROR:", err);
      return [];
    }
  })();

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <section className="py-20 text-center">
        <p className="text-gray-500">Loading projects...</p>
      </section>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <section className="py-20 text-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="bg-white px-6 md:px-12 lg:px-20 py-20">
      {/* HEADER */}
      <motion.div
        ref={headerRef}
        // variants={container}
        initial="hidden"
        animate={headerInView ? "show" : "hidden"}
        className="flex flex-col lg:flex-row justify-between gap-10 mb-14"
      >
        <motion.div
          // variants={fadeUp}
          className="space-y-3 max-w-xl"
        >
          <span className="text-[#e8192c] border border-[#e8192c]/30 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full">
            Our Work
          </span>

          <h2 className="text-3xl lg:text-4xl font-black text-[#0d1f4e]">
            Featured <span className="text-[#e8192c]">Success Stories</span>
          </h2>

          <p className="text-gray-600 text-sm max-w-md">
            Real results delivered through modern engineering and clean
            execution.
          </p>
        </motion.div>

        {/* FILTERS */}
        <motion.div
          // variants={fadeUp}
          className="flex flex-wrap gap-3 pt-5"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActive(filter)}
              className={`px-4  h-13  rounded-xl text-sm font-semibold transition border ${
                active === filter
                  ? "bg-[#0d1f4e] text-white border-[#0d1f4e]"
                  : "text-[#0d1f4e] border-gray-200 hover:border-[#e8192c] hover:text-[#e8192c]"
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>
      </motion.div>

      {/* GRID */}
      <motion.div
        ref={gridRef}
        // variants={container}
        initial="hidden"
        animate={gridInView ? "show" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-500 text-lg">No projects found</p>
          </div>
        ) : (
          filteredProjects.map((project, index) => (
            <motion.div
              key={project?._id || index}
              // variants={fadeUp}
              onClick={() => {
                // const target =
                //   typeof project?.slug === "string" && project.slug.trim()
                //     ? project.slug
                //     : project?._id;

                navigate("portfolioDetail",{state:project});
              }}
              className="group border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition cursor-pointer bg-white"
            >
              {/* IMAGE */}
              <div className="h-52 overflow-hidden bg-gray-100">
                <img
                  src={project?.image || "/placeholder.png"}
                  alt={project?.title || "project"}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* CONTENT */}
              <div className="p-6 space-y-3">
                <p className="text-sm font-semibold text-[#e8192c]">
                  {project?.category || "Uncategorized"}
                </p>

                <h3 className="text-xl font-black text-[#0d1f4e]">
                  {project?.title || "No title"}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {project?.description || "No description available"}
                </p>

                <button className="text-sm font-semibold text-black flex items-center gap-2">
                  View Case Study
                  <span className="group-hover:translate-x-1 transition">
                    →
                  </span>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </section>
  );
}

export default Portfolio;
