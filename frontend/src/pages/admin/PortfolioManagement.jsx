import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getPortfolios, deletePortfolio } from "../../services/portfolio";

function PortfolioManagement() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const fetchPortfolios = async () => {
    const response = await getPortfolios();
    setProjects(response.data);
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    setDeletingId(id);
    try {
      await deletePortfolio(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-white text-xl font-bold">Portfolio Management</h1>
          <p className="text-white/50 text-sm">
            Manage all company projects and case studies
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/addPortfolio")}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition"
        >
          + Add Project
        </button>
      </motion.div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {projects.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-2xl p-4 border border-white/10 bg-[#111b2e] hover:border-white/20 transition-all duration-300"
            >
              {/* TITLE */}
              <h3 className="text-white font-semibold text-base">
                {project.title}
              </h3>

              {/* CATEGORY */}
              <p className="text-white/50 text-sm mt-1">{project.category}</p>

              {/* FOOTER */}
              <div className="mt-4 flex items-center justify-between">
                {/* STATUS */}
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium border ${
                    project.status === "Live"
                      ? "text-green-400 border-green-500/30 bg-green-500/10"
                      : project.status === "In Progress"
                        ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
                        : "text-blue-400 border-blue-500/30 bg-blue-500/10"
                  }`}
                >
                  {project.status}
                </span>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/editPortfolio/${project._id}`)}
                    className="text-xs px-3 py-1 rounded-lg text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(project._id)}
                    disabled={deletingId === project._id}
                    className="text-xs px-3 py-1 rounded-lg text-red-300 bg-red-500/10 hover:bg-red-500/20 transition disabled:opacity-40"
                  >
                    {deletingId === project._id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PortfolioManagement;