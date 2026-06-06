import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import people from "../assets/whyyaksera/people.png";

const features = [
  { icon: "⚙️", title: "Quality First", desc: "Rigorous QA & testing standards." },
  { icon: "🔄", title: "Agile Approach", desc: "Rapid iterations and delivery." },
  { icon: "💰", title: "Cost Effective", desc: "Optimized offshore delivery." },
  { icon: "🏆", title: "Elite Talent", desc: "Top 3% engineering expertise." },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function WhyYaksera() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="bg-white flex items-center justify-center px-6 md:px-12 lg:px-20 py-20"
    >
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

        {/* LEFT */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="space-y-6"
        >

          {/* TITLE */}
          <motion.h2
            variants={fadeUp}
            className="text-3xl lg:text-4xl font-black text-[#0d1f4e] leading-tight"
          >
            Why Choose{" "}
            <span className="text-[#e8192c]">YAKSERA?</span>
          </motion.h2>

          {/* DESCRIPTION */}
          <motion.p
            variants={fadeUp}
            className="text-gray-600 text-base leading-7 max-w-md"
          >
            We combine deep technical expertise with a{" "}
            <span className="text-[#e8192c] font-semibold">
              transparent, collaborative
            </span>{" "}
            approach to deliver{" "}
            <span className="text-[#e8192c] font-semibold">
              scalable software
            </span>{" "}
            that drives real business results.
          </motion.p>

          {/* FEATURES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">

            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="flex gap-3 items-start"
              >
                {/* ICON BOX */}
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#e8192c]/10 border  border-[#e8192c]/20 text-sm shrink-0">
                  {f.icon}
                </div>

                {/* TEXT */}
                <div className="font-semibold"  >
                  <h6 className="text-md font-semibold text-[#e8192c]">
                    {f.title}
                  </h6>
                  <p className="text-sm text-gray-500 leading-snug">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}

          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative w-full"
        >

          <div className="rounded-2xl overflow-hidden relative shadow-lg">

            {/* IMAGE */}
            <img
              src={people}
              alt="Team collaboration"
              className="w-full h-[280px] sm:h-[340px] lg:h-[420px] object-cover"
            />

            {/* BADGE */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="absolute bottom-5 left-5 bg-[#e8192c] text-white px-5 py-3 rounded-xl shadow-lg"
            >
              <p className="text-2xl sm:text-3xl font-black leading-none">
                98%
              </p>
              <p className="text-[10px] tracking-widest mt-1 opacity-90">
                CLIENT RETENTION
              </p>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default WhyYaksera;