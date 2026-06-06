import React from "react";
import { motion } from "framer-motion";

function StaffManagement() {
  const staff = [
    {
      name: "Aarav Sharma",
      role: "Frontend Developer",
      email: "aarav@company.com",
      status: "Active",
    },
    {
      name: "Sita Karki",
      role: "UI/UX Designer",
      email: "sita@company.com",
      status: "Active",
    },
    {
      name: "Ramesh Yadav",
      role: "Backend Developer",
      email: "ramesh@company.com",
      status: "On Leave",
    },
    {
      name: "Anita Rai",
      role: "Project Manager",
      email: "anita@company.com",
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
          Staff Management
        </h1>

        <button className="px-4 py-2 text-sm font-medium text-white bg-[#e8132f] rounded-lg hover:bg-[#c40d24] transition">
          + Add Staff
        </button>
      </div>

      {/* DESCRIPTION */}
      <p className="text-sm text-white/60 max-w-2xl">
        Manage your team members, roles, and internal company structure.
      </p>

      {/* TABLE */}
      <div className="border border-white/10 rounded-xl overflow-hidden">
        {/* HEADER ROW */}
        <div className="grid grid-cols-4 bg-white/5 text-white/70 text-xs font-medium px-4 py-3">
          <span>Name</span>
          <span>Role</span>
          <span>Email</span>
          <span>Status</span>
        </div>

        {/* ROWS */}
        {staff.map((member, i) => (
          <div
            key={i}
            className="grid grid-cols-4 px-4 py-4 text-sm text-white/80 border-t border-white/10 hover:bg-white/5 transition"
          >
            <span className="font-medium text-white">{member.name}</span>
            <span>{member.role}</span>
            <span>{member.email}</span>

            <span
              className={`text-xs font-semibold ${
                member.status === "Active"
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              {member.status}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default StaffManagement;