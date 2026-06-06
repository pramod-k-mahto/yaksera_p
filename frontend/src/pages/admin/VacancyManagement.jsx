import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { getJobVacancies, deleteJobVacancy } from "../../services/jobVacancy";
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

function VacancyManagement() {
  const navigate    = useNavigate();
  const [jobs,       setJobs]      = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [deletingId, setDeletingId]= useState(null);

  const getAllVacancy = async () => {
    try {
      setLoading(true);
      const response = await getJobVacancies();
      setJobs(response.data || []);
    } catch (error) {
      console.error(error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getAllVacancy(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vacancy?")) return;
    setDeletingId(id);
    try {
      await deleteJobVacancy(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold text-white">
          Vacancy Management
        </h1>
        <NavLink
          to="/admin/addVacancy"
          className="px-4 py-2 text-sm font-medium text-white bg-[#e8132f] rounded-lg hover:bg-[#c40d24] transition"
        >
          + Add Vacancy
        </NavLink>
      </div>

      <p className="text-sm text-white/60 max-w-2xl">
        Manage job openings, hiring positions, and recruitment status for your company.
      </p>

      {/* TABLE */}
      <div className="border border-white/10 rounded-xl overflow-hidden">
        {/* HEADER ROW */}
        <div className="grid grid-cols-6 bg-white/5 text-white/70 text-xs font-medium px-4 py-3">
          <span className="col-span-2">Job Title</span>
          <span>Type</span>
          <span>Location</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="py-10 text-center text-white/50 text-sm">
            Loading vacancies...
          </div>
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job._id}
              className="grid grid-cols-6 items-center px-4 py-4 text-sm text-white/80 border-t border-white/10 hover:bg-white/5 transition"
            >
              {/* TITLE */}
              <div className="col-span-2">
                <p className="font-medium text-white">{job.title}</p>
                <p className="text-xs text-white/40 mt-0.5">{job.dept}</p>
              </div>

              {/* TYPE */}
              <span className="capitalize">{job.type}</span>

              {/* LOCATION */}
              <span>{job.location}</span>

              {/* STATUS */}
              <span className={`text-xs font-semibold capitalize ${
                job.status === "open"   ? "text-green-400" :
                job.status === "draft"  ? "text-yellow-400" :
                                          "text-red-400"
              }`}>
                {job.status}
              </span>

              {/* ACTIONS */}
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => navigate(`/admin/editVacancy/${job._id}`)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/50 hover:bg-violet-500/20 hover:text-violet-400 transition"
                >
                  <Pencil size={14} />
                </button>

                <button
                  onClick={() => handleDelete(job._id)}
                  disabled={deletingId === job._id}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/50 hover:bg-red-500/20 hover:text-red-400 transition disabled:opacity-40"
                >
                  {deletingId === job._id
                    ? <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    : <Trash2 size={14} />
                  }
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-white/50 text-sm">
            No vacancies found
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default VacancyManagement;