import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { scrollToId } from "../utils/scroll";

const NAVY = "#0B2457";
const RED = "#F5222D";

/* ── minimal navy icons ─────────────────────────────────────────── */
const IconWeb = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" /><path d="m8 14 2 2-2 2M13 18h3" />
  </svg>
);
const IconMobile = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="2" width="10" height="20" rx="2.5" /><path d="M11 18h2" />
  </svg>
);
const IconAI = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="7" width="10" height="10" rx="2" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
  </svg>
);
const IconDesign = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19 7-7 3 3-7 7-3-3z" /><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="m2 2 7.586 7.586" /><circle cx="11" cy="11" r="2" />
  </svg>
);

const services = [
  { title: "Web Development", desc: "Scalable, secure, and fast web applications built with modern technologies.", icon: <IconWeb />, tint: "#EAF1FF" },
  { title: "Mobile App Development", desc: "High-performance mobile applications for modern iOS and Android experiences.", icon: <IconMobile />, tint: "#FDECEC" },
  { title: "AI Automation", desc: "Intelligent AI solutions that automate processes, reduce repetitive work, and improve efficiency.", icon: <IconAI />, tint: "#F1ECFF" },
  { title: "UI/UX Design", desc: "User-centered interfaces designed to create simple, intuitive, and engaging digital experiences.", icon: <IconDesign />, tint: "#E7F8F0" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Services() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[#F8FAFD]">
      {/* subtle decoration — very low opacity, non-distracting */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-24 hidden h-40 w-40 lg:block"
        style={{ backgroundImage: `radial-gradient(${NAVY} 1px, transparent 1px)`, backgroundSize: "16px 16px", opacity: 0.06 }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full blur-3xl"
        style={{ background: "rgba(11,36,87,0.05)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-[80px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[42fr_58fr] lg:gap-16">

          {/* ── LEFT · content ─────────────────────────────────── */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:pt-2"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center rounded-full border bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{ borderColor: `${RED}55`, color: RED }}
            >
              What We Do
            </motion.span>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="mt-6 text-[30px] font-black leading-[1.14] tracking-tight sm:text-[38px] lg:text-[42px]"
              style={{ color: NAVY }}
            >
              Engineering Solutions to Drive Your{" "}
              <span style={{ color: RED }}>Business Forward</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-5 max-w-md text-[15px] leading-[1.7] text-slate-500 md:text-base"
            >
              We build scalable, secure, and high-performance digital products
              tailored to your business goals. From idea to deployment and
              beyond, we become your engineering partner at every stage.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
              <button
                onClick={() => navigate("/contact")}
                className="group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5"
                style={{ background: NAVY }}
              >
                Let's Build Together
                <span className="transition-transform group-hover:translate-x-0.5" style={{ color: RED }}>→</span>
              </button>
              <button
                onClick={() => scrollToId("portfolio")}
                className="group inline-flex items-center justify-center gap-2 text-sm font-bold transition-colors sm:justify-start"
                style={{ color: NAVY }}
              >
                Explore our work
                <span className="transition-transform group-hover:translate-x-0.5" style={{ color: RED }}>→</span>
              </button>
            </motion.div>
          </motion.div>

          {/* ── RIGHT · service cards ──────────────────────────── */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5"
          >
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                custom={i}
                onClick={() => navigate("/contact")}
                className="group cursor-pointer rounded-[18px] border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(11,36,87,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_14px_34px_rgba(11,36,87,0.10)]"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: s.tint }}>
                    {s.icon}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:border-transparent group-hover:bg-[#0B2457] group-hover:text-white">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </div>
                <h3 className="mt-5 text-[17px] font-bold" style={{ color: NAVY }}>{s.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-500">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
