import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  Clock3,
  Search,
  Eye,
  Trash2,
  Download,
  Filter,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getJobApplications } from "../../services/jobApplication";

const stats = [
  { title: "Total Applications", value: "1,284", icon: Users },
  { title: "Open Positions", value: "18", icon: Briefcase },
  { title: "Interviews", value: "42", icon: Clock3 },
  { title: "Selected", value: "12", icon: CheckCircle2 },
];

function JobApplied() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getData = async () => {
    try {
      setLoading(true);
      const res = await getJobApplications();
      setApplications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filtered = applications.filter((app) =>
    [app.name, app.email, app.role, app.location]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "reviewed":
        return "bg-blue-500/10 text-blue-300";
      case "interview":
        return "bg-purple-500/10 text-purple-300";
      case "selected":
        return "bg-emerald-500/10 text-emerald-300";
      case "pending":
        return "bg-yellow-500/10 text-yellow-300";
      default:
        return "bg-white/10 text-white/50";
    }
  };

  return (
    <div className="space-y-8">
      {/* TOP */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[30px] md:text-[36px] font-black tracking-tight text-white"
          >
            Job Applications
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-2 max-w-2xl text-sm md:text-[15px] leading-7 text-white/50"
          >
            Manage candidate applications, track hiring progress, review
            resumes, and organize recruitment workflows.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-wrap gap-3"
        >
          <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/80 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:text-white">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex items-center gap-2 rounded-2xl bg-[#e8192c] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(232,25,44,0.28)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_16px_40px_rgba(232,25,44,0.4)]">
            <Download size={16} />
            Export Applicants
          </button>
        </motion.div>
      </div>

      {/* STATS */}
      {/* <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
            >
              <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full bg-[#e8192c]/10 blur-3xl" />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#e8192c]">
                <Icon size={24} />
              </div>
              <div className="mt-6">
                <p className="text-sm text-white/45">{item.title}</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
                  {item.value}
                </h2>
              </div>
            </motion.div>
          );
        })}
      </div> */}

      {/* TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] backdrop-blur-xl"
      >
        {/* HEADER */}
        <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Recent Applications
            </h2>
            <p className="mt-1 text-sm text-white/45">
              Review all candidate submissions and hiring stages.
            </p>
          </div>

          {/* SEARCH */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0f172a] px-4 py-3 lg:w-[340px]">
            <Search size={18} className="text-white/40" />
            <input
              type="text"
              placeholder="Search applicants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />
          </div>
        </div>

        {/* TABLE BODY */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#e8192c]" />
              <span className="ml-3 text-sm text-white/40">
                Loading applications...
              </span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/30">
              <Users size={40} className="mb-3 opacity-30" />
              <p className="text-sm">No applications found</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="border-b border-white/10">
                <tr className="text-left">
                  {[
                    "Applicant",
                    "Contact",
                    "Position",
                    "Experience",
                    "Location",
                    "Status",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white/40"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map((app, index) => (
                  <motion.tr
                    key={app._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="border-b border-white/5 transition-all duration-300 hover:bg-white/[0.03]"
                  >
                    {/* APPLICANT */}
                    <td className="px-6 py-5">
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {app.name}
                        </h3>
                        <p className="mt-1 text-xs text-white/35">
                          {new Date(app.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </td>

                    {/* CONTACT */}
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-white/30" />
                          <span className="text-sm text-white/65">
                            {app.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-white/30" />
                          <span className="text-sm text-white/45">
                            {app.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* POSITION */}
                    <td className="px-6 py-5">
                      <span className="rounded-full border border-[#e8192c]/20 bg-[#e8192c]/10 px-3 py-1.5 text-xs font-semibold text-[#ff7585]">
                        {app.role}
                      </span>
                    </td>

                    {/* EXPERIENCE */}
                    <td className="px-6 py-5">
                      <span className="text-sm text-white/60">
                        {app.experience}
                      </span>
                    </td>

                    {/* LOCATION */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <MapPin size={15} className="text-white/35" />
                        <span className="text-sm text-white/60">
                          {app.location}
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${statusColor(app.status)}`}
                      >
                        {app.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          // onClick={() => window.open(app.resume, "_blank")}
                          title="View Resume"
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/60 transition-all duration-300 hover:border-[#e8192c]/30 hover:bg-[#e8192c]/10 hover:text-[#ff6b81]"
                        >
                          <a
                            href={app.resume}
                            rel="noopener noreferrer"
                            target="_blank"
                            download={true}
                          >
                            CV
                          </a>
                          {/* <Eye size={17} /> */}
                        </button>
                        <button
                          title="Delete Application"
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/60 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default JobApplied;
