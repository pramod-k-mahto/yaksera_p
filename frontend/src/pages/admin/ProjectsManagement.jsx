import { useState } from "react";
import { motion } from "framer-motion";
// import Card from "../../components/admin/Card";

function ProjectsManagement() {
  const [projects] = useState([
    {
      title: "Enterprise CRM System",
      client: "TechCorp Ltd",
      status: "Live",
      type: "Web App",
    },
    {
      title: "AI Analytics Dashboard",
      client: "DataWave",
      status: "In Progress",
      type: "SaaS",
    },
    {
      title: "E-Commerce Platform",
      client: "ShopNest",
      status: "Completed",
      type: "Web Development",
    },
    {
      title: "Mobile Banking App",
      client: "FinBank",
      status: "Live",
      type: "Fintech",
    },
  ]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-white text-xl font-bold">
            Projects Management
          </h1>
          <p className="text-white/50 text-sm">
            Manage all client and internal projects
          </p>
        </div>

        <button className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition">
          + New Project
        </button>
      </motion.div>

      {/* CONTENT */}
      {/* <Card title="All Projects"> */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="
                rounded-2xl p-4
                border border-white/10
                bg-[#111b2e]
                hover:border-white/20
                transition-all duration-300
              "
            >

              {/* TITLE */}
              <h3 className="text-white font-semibold text-base">
                {p.title}
              </h3>

              {/* CLIENT */}
              <p className="text-white/50 text-sm mt-1">
                Client: {p.client}
              </p>

              {/* TYPE */}
              <p className="text-white/40 text-xs mt-1">
                {p.type}
              </p>

              {/* FOOTER */}
              <div className="mt-4 flex items-center justify-between">

                {/* STATUS */}
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium border ${
                    p.status === "Live"
                      ? "text-green-400 border-green-500/30 bg-green-500/10"
                      : p.status === "In Progress"
                      ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
                      : "text-blue-400 border-blue-500/30 bg-blue-500/10"
                  }`}
                >
                  {p.status}
                </span>

                {/* ACTIONS */}
                <div className="flex gap-2">

                  <button className="text-xs px-3 py-1 rounded-lg text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 transition">
                    Edit
                  </button>

                  <button className="text-xs px-3 py-1 rounded-lg text-red-300 bg-red-500/10 hover:bg-red-500/20 transition">
                    Delete
                  </button>

                </div>
              </div>

            </motion.div>
          ))}

        </div>

      {/* </Card> */}
    </div>
  );
}

export default ProjectsManagement;