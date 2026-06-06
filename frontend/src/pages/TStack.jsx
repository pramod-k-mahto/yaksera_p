import React from "react";
import { motion } from "framer-motion";

const techs = [
  {
    name: "React",
    color: "#61DAFB",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="3" fill="#61DAFB" />
        <ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.5" />
        <ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(120 16 16)" />
      </svg>
    ),
  },
  {
    name: "Photoshop",
    icon: (
      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#001e36]">
        <span className="text-[#31a8ff] font-bold text-sm">Ps</span>
      </div>
    ),
  },
  {
    name: "Flutter",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <polygon points="1,16 13,4 25,4 13,16" fill="#54C5F8" />
        <polygon points="13,16 25,4 25,28 19,22" fill="#29B6F6" />
        <polygon points="13,22 19,28 25,28 19,22" fill="#01579B" />
        <polygon points="13,16 19,22 13,28 7,22" fill="#29B6F6" />
      </svg>
    ),
  },
  {
    name: "Python",
    icon: (
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
        <path d="M16 2C10 2 10.5 5 10.5 5v3h11v1H8S4 8.5 4 14s3.5 5.5 3.5 5.5H10v-3s-.2-3.5 3.5-3.5h9s3.5.2 3.5-3.5V6.5S26.5 2 16 2z" fill="#366994" />
        <path d="M16 30c6 0 5.5-3 5.5-3v-3h-11v-1h13.5S28 23.5 28 18s-3.5-5.5-3.5-5.5H22v3s.2 3.5-3.5 3.5h-9S6 18.8 6 22.5v5S5.5 30 16 30z" fill="#FFC107" />
      </svg>
    ),
  },
  {
    name: "Next.js",
    icon: (
      <div className="w-8 h-8 rounded-full bg-[#0d1f4e] flex items-center justify-center">
        <span className="text-white font-black text-xs">N</span>
      </div>
    ),
  },
];

export default function TStack() {
  const loop = [...techs, ...techs];

  return (
    <section className="w-full  bg-white overflow-hidden font-sans">

      {/* TITLE */}
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-black ">
          Our   <span className="text-[#e8192c]" >Technology</span>   Stack
        </h2>
      </div>

      {/* MARQUEE */}
      <div className="relative w-full overflow-hidden">

        <motion.div
          className="flex gap-8 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          whileHover={{ animationPlayState: "paused" }}
        >
          {loop.map((tech, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-gray-100 transition"
            >
              {tech.icon}

              {tech.name && (
                <span
                  className="text-[15px] font-semibold whitespace-nowrap"
                  style={{ color: tech.color || "#0d1f4e" }}
                >
                  {tech.name}
                </span>
              )}
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}