import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import website from "../assets/demo/website.gif";
import ani from "../assets/demo/ani.gif";
import computer from "../assets/demo/computer.gif";
import box from "../assets/demo/box.gif";

/* ─── fade-up preset ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
});

/* ══════════════════════════════════════════
   CARD — REAL ESTATE
══════════════════════════════════════════ */
function RealEstateCard() {
  const listings = [
    {
      name: "Lagonia Apartment",
      price: "$998,500",
      tag: "Luxury",
      color: "#e8192c",
    },
    {
      name: "Marina Heights",
      price: "$1,240,000",
      tag: "New",
      color: "#0d1f4e",
    },
    {
      name: "Greenview Villa",
      price: "$750,000",
      tag: "Sale",
      color: "#e8192c",
    },
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((p) => (p + 1) % listings.length);
    }, 2600);

    return () => clearInterval(t);
  }, []);

  const l = listings[active];

  return (
    <motion.div
      {...fadeUp(0.18)}
      className="w-full min-h-[260px] rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-lg"
    >
      {/* NAV */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-xs font-bold tracking-wider text-[#0d1f4e]">
          BN Apartments
        </span>

        <div className="flex gap-4 text-[10px] text-gray-400">
          <span>Home</span>
          <span>About</span>
          <span>Contact</span>
        </div>

        <span className="text-sm">🔍</span>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col sm:flex-row gap-5 p-4">

        {/* LEFT */}
        <div className="flex-1">
          <AnimatePresence mode="wait">

            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >

              <h2 className="text-xl font-black text-[#0d1f4e] leading-tight">
                Buy Elite
                <br />
                Real Estate
              </h2>

              <p className="text-sm text-gray-500 mt-3 mb-4">
                Smart investments for modern living spaces.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                animate={{ borderColor: l.color, color: l.color }}
                className="border px-4 py-2 rounded-lg text-xs font-bold bg-white"
              >
                VIEW ESTATE →
              </motion.button>

            </motion.div>

          </AnimatePresence>
        </div>

        {/* RIGHT VISUAL */}
        <div className="w-full sm:w-[120px] h-[160px] rounded-2xl bg-gradient-to-br from-[#0d1f4e] to-[#e8192c] relative flex items-end justify-center">

          <span className="text-4xl mb-2">🏢</span>

          <div className="absolute inset-0 grid grid-cols-3 gap-1 p-2 opacity-40">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 1.6,
                  delay: i * 0.1,
                  repeat: Infinity,
                }}
                className="bg-yellow-300 rounded-sm"
              />
            ))}
          </div>

        </div>
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-2 py-3">
        {listings.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === active ? 18 : 6,
              background: i === active ? "#e8192c" : "#e5e7eb",
            }}
            className="h-1 rounded-full"
          />
        ))}
      </div>

      {/* BOTTOM BAR */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, background: l.color }}
          exit={{ opacity: 0 }}
          className="flex justify-between items-center px-4 py-3 text-white"
        >
          <div>
            <p className="text-[10px] opacity-70 tracking-widest">
              SPECIAL PRICE
            </p>
            <p className="font-bold text-sm">{l.name}</p>
          </div>

          <div className="text-right">
            <p className="font-black">{l.price}</p>
            <span className="text-[10px] bg-white/20 px-2 py-1 rounded-full">
              {l.tag}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   ROOT
══════════════════════════════════════════ */
export default function Demo() {
  return (
    <section className="bg-white px-6 md:px-12 lg:px-20 py-20">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between gap-8 mb-14"
      >

        <div>
          <span className="text-[#e8192c] border border-[#e8192c]/30 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full">
            DEMO
          </span>

          <h1 className="text-3xl lg:text-5xl font-black text-[#0d1f4e] mt-4 leading-tight">
            Explore Our <span  className="text-[#e8192c]" >Industry Expertise</span>
          </h1>
        </div>

        <p className="text-gray-500 max-w-md  mt-20">
          We build digital solutions across multiple industries including tech,
          finance, healthcare, and education.
        </p>

      </motion.div>

      {/* CONTENT */}
      <div className="space-y-6">

        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.img {...fadeUp(0.05)} src={website} className="rounded-2xl" />
          <motion.img {...fadeUp(0.1)} src={computer} className="rounded-2xl" />
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <motion.img {...fadeUp(0.08)} src={ani} className="rounded-2xl" />

          <motion.img {...fadeUp(0.14)} src={box} className="rounded-2xl" />

          <RealEstateCard />

        </div>

      </div>

    </section>
  );
}