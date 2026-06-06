import { motion } from "motion/react";
import OurPreciousClients from "./OurPreciousClients";
import HeroImage from "../assets/HeroImage.png";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  return (
    <div>
      <section className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-14">
          {/* LEFT */}
          <div className="flex-1 max-w-2xl">
            {/* LABEL */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-8"
            >
              <svg width="60" height="16" viewBox="0 0 60 16">
                <path
                  d="M0 8 Q10 2 20 8 Q30 14 40 8 Q50 2 60 8"
                  fill="none"
                  stroke="#0d1f4e"
                  strokeWidth="2"
                />
              </svg>

              <span className="text-xs font-bold tracking-[0.25em] text-[#0d1f4e] uppercase">
                Premium IT Outsourcing Partner
              </span>
            </motion.div>

            {/* TITLE */}
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl font-black leading-[1.05] text-[#0d1f4e]"
            >
              Build Scale <br />
              <span className="text-[#e8192c] inline-block">
                Innovate
              </span> with <br />
              Expert Engineers.
            </motion.h1>

            {/* DESCRIPTION */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-6 text-gray-600 text-lg leading-8 max-w-xl"
            >
              Transform your vision into reality with{" "}
              <span className="text-[#e8192c] font-semibold">YAKSERA</span>{" "}
              world-class IT outsourcing solutions that help businesses grow
              faster and smarter.
            </motion.p>

            {/* BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <button
                onClick={() => {
                  navigate("/contact");
                }}
                className="bg-[#e8192c] hover:bg-[#c8001e] text-white font-semibold text-sm px-8 py-4 rounded-xl transition shadow-md"
              >
                Discuss your ideas
              </button>

              <button
                onClick={() => {
                  navigate("/caseStudies");
                }}
                className="border-2 border-[#e8192c] text-[#e8192c] hover:bg-red-50 font-semibold text-sm px-8 py-4 rounded-xl transition"
              >
                Case Studies
              </button>
            </motion.div>

            {/* STATS */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="border-t border-gray-300 mt-10 pt-8 flex flex-wrap gap-10"
            >
              {[
                { num: "5+", label: "Years of Excellence" },
                { num: "100+", label: "Projects Delivered" },
                { num: "40+", label: "Expert Engineers" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-black text-[#0d1f4e]">
                    {s.num}
                  </div>
                  <div className="text-sm text-[#e8192c] font-semibold mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <motion.div
              className="relative w-full max-w-xl"
              initial={{ x: 500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <img
                src={HeroImage}
                alt="Team"
                className="w-full h-[370px] object-cover rounded-xl"
              />

              {/* BADGE */}
              <div className="absolute bottom-5 left-5 bg-white rounded-2xl shadow-lg px-5 py-4 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />

                <div>
                  <div className="text-xs text-gray-400">
                    Currently Available
                  </div>
                  <div className="text-sm font-bold text-[#0d1f4e]">
                    40+ Engineers Ready to Deploy
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <OurPreciousClients />
    </div>
  );
}

export default Hero;
