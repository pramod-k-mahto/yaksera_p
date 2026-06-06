import React from "react";
import { motion } from "framer-motion";

function TestimonialManagement() {
  const testimonials = [
    {
      name: "John Doe",
      company: "TechNova Ltd",
      message:
        "Yaksera delivered an amazing website for our company. The performance and design are outstanding.",
      rating: 5,
    },
    {
      name: "Sara Khan",
      company: "Bright Solutions",
      message:
        "Very professional team. They understood our requirements clearly and delivered on time.",
      rating: 4,
    },
    {
      name: "Michael Lee",
      company: "CloudSync",
      message:
        "Great experience working with Yaksera. Highly recommended for SaaS development.",
      rating: 5,
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
          Testimonial Management
        </h1>

        <button className="px-4 py-2 text-sm font-medium text-white bg-[#e8132f] rounded-lg hover:bg-[#c40d24] transition">
          + Add Testimonial
        </button>
      </div>

      {/* DESCRIPTION */}
      <p className="text-sm text-white/60 max-w-2xl">
        Manage client testimonials, reviews, and feedback shown on your website.
      </p>

      {/* TABLE */}
      <div className="border border-white/10 rounded-xl overflow-hidden">
        {/* HEADER */}
        <div className="grid grid-cols-4 bg-white/5 text-white/70 text-xs font-medium px-4 py-3">
          <span>Client</span>
          <span>Company</span>
          <span>Message</span>
          <span>Rating</span>
        </div>

        {/* ROWS */}
        {testimonials.map((item, i) => (
          <div
            key={i}
            className="grid grid-cols-4 px-4 py-4 text-sm text-white/80 border-t border-white/10 hover:bg-white/5 transition"
          >
            <span className="font-medium text-white">{item.name}</span>
            <span>{item.company}</span>

            <span className="truncate pr-3">
              {item.message}
            </span>

            <span className="text-yellow-400 font-semibold">
              {"⭐".repeat(item.rating)}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default TestimonialManagement;