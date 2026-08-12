import { motion } from "framer-motion";

import smartflow from "../assets/OurClient/smartflow.png";
import dataflow from "../assets/OurClient/dataflow.png";
import finext from "../assets/OurClient/finext.png";
import globalbuild from "../assets/OurClient/globalbuild.png";
import innsol from "../assets/OurClient/innsol.png";
import nexatech from "../assets/OurClient/nexatech.png";
import techwave from "../assets/OurClient/techwave.png";
import m from "../assets/OurClient/m.png";

// Real client logos, preserved exactly — no invented names or descriptions.
const clients = [
  { img: smartflow, name: "SmartFlow" },
  { img: dataflow, name: "DataFlow" },
  { img: finext, name: "Finext" },
  { img: globalbuild, name: "GlobalBuild" },
  { img: innsol, name: "Innsol" },
  { img: nexatech, name: "NexaTech" },
  { img: techwave, name: "TechWave" },
  { img: m, name: "Momentum" },
];

const NAVY = "#071B47";
const RED = "#F21D3A";
const MUTED = "#64748B";
const BORDER = "rgba(7,27,71,0.10)";

export default function OurPreciousClients() {
  return (
    <section className="relative overflow-hidden bg-[#F8FAFC]">
      {/* extremely subtle decorative outline circle, mostly off-canvas */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 hidden h-[560px] w-[560px] rounded-full border lg:block"
        style={{ borderColor: "rgba(7,27,71,0.05)" }}
      />

      <div className="relative mx-auto max-w-[1280px] px-5 py-24 sm:px-8 md:py-28 lg:py-[120px]">
        <div className="flex flex-col gap-14 lg:flex-row lg:items-stretch lg:gap-0">

          {/* ── LEFT · editorial intro ─────────────────────────── */}
          <div className="lg:w-[34%] lg:shrink-0 lg:pr-14">
            {/* eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-6 flex items-center gap-3"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: RED }} />
              <span className="text-[12px] font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>
                Selected Clients
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-[34px] font-extrabold leading-[1.1] tracking-tight sm:text-[42px] lg:text-[52px] lg:leading-[1.08]"
              style={{ color: NAVY }}
            >
              Built with businesses that <span style={{ color: RED }}>trust&nbsp;us</span> to deliver.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-6 max-w-[420px] text-[16px] leading-[1.65] md:text-[17px]"
              style={{ color: MUTED }}
            >
              From growing businesses to ambitious digital products, we work
              closely with our clients to turn ideas into reliable software.
            </motion.p>

            {/* understated partnership detail — no fabricated numbers */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-9 flex items-start gap-3"
            >
              <span className="mt-1 h-9 w-[3px] rounded-full" style={{ background: RED }} />
              <p className="text-[14px] font-medium leading-[1.6]" style={{ color: NAVY }}>
                Trusted partnerships.<br className="hidden sm:block" /> Real products. Long-term collaboration.
              </p>
            </motion.div>
          </div>

          {/* ── SEPARATOR · distinctive Yaksera detail (desktop) ─── */}
          <div className="relative hidden shrink-0 flex-col items-center px-8 lg:flex">
            <span className="mb-3 h-2 w-2 rounded-full" style={{ background: RED }} />
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.28em]"
              style={{ color: MUTED, writingMode: "vertical-rl" }}
            >
              Partners&nbsp;/&nbsp;01
            </span>
            <span
              className="mt-3 w-px flex-1"
              style={{ background: `linear-gradient(to bottom, ${RED}, ${RED}22 45%, transparent)` }}
            />
          </div>

          {/* ── RIGHT · continuous logo wall ───────────────────── */}
          <div className="lg:flex-1">
            <div
              className="grid grid-cols-2 overflow-hidden rounded-xl border-l border-t"
              style={{ borderColor: BORDER }}
            >
              {clients.map((client, i) => (
                <motion.div
                  key={client.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 2) * 0.05 + Math.floor(i / 2) * 0.05 }}
                  className="group flex min-h-[130px] items-center justify-center border-b border-r px-6 transition-colors duration-200 hover:bg-white sm:min-h-[150px] sm:px-10"
                  style={{ borderColor: BORDER }}
                >
                  <img
                    src={client.img}
                    alt={client.name}
                    loading="lazy"
                    className="max-h-14 w-auto max-w-[190px] object-contain opacity-[0.8] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:opacity-100 sm:max-h-16 sm:max-w-[220px]"
                  />
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
