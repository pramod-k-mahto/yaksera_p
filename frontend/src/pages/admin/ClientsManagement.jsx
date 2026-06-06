import React from "react";
import { motion } from "framer-motion";

function ClientsManagement() {
  const clients = [
    {
      name: "TechNova Ltd",
      industry: "Software",
      country: "USA",
      project: "E-commerce Platform",
      status: "Active",
    },
    {
      name: "Bright Solutions",
      industry: "Finance",
      country: "UK",
      project: "CRM System",
      status: "Active",
    },
    {
      name: "CloudSync",
      industry: "Cloud Services",
      country: "UAE",
      project: "SaaS Dashboard",
      status: "Inactive",
    },
    {
      name: "NextGen Corp",
      industry: "AI/ML",
      country: "India",
      project: "AI Analytics Tool",
      status: "Active",
    },
  ];

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
          Clients Management
        </h1>

        <button className="px-4 py-2 text-sm font-medium text-white bg-[#e8132f] rounded-lg hover:bg-[#c40d24] transition">
          + Add Client
        </button>
      </div>

      {/* DESCRIPTION */}
      <p className="text-sm text-white/60 max-w-2xl">
        Manage all company clients, their industries, and projects you have delivered.
      </p>

      {/* TABLE */}
      <div className="border border-white/10 rounded-xl overflow-hidden">
        {/* HEADER */}
        <div className="grid grid-cols-5 bg-white/5 text-white/70 text-xs font-medium px-4 py-3">
          <span>Client</span>
          <span>Industry</span>
          <span>Country</span>
          <span>Project</span>
          <span>Status</span>
        </div>

        {/* ROWS */}
        {clients.map((client, i) => (
          <div
            key={i}
            className="grid grid-cols-5 px-4 py-4 text-sm text-white/80 border-t border-white/10 hover:bg-white/5 transition"
          >
            <span className="font-medium text-white">{client.name}</span>
            <span>{client.industry}</span>
            <span>{client.country}</span>
            <span>{client.project}</span>

            <span
              className={`text-xs font-semibold ${
                client.status === "Active"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {client.status}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default ClientsManagement;