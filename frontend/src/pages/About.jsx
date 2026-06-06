import React from 'react'
import { motion } from 'framer-motion'

// ── animation helpers ──────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  }),
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

// ── icons (inline SVG to keep zero deps) ──────────────────────────────────────
const IconBulb = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-red-500" stroke="currentColor" strokeWidth={1.8}>
    <path d="M12 2a7 7 0 0 1 5 11.95V17a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-3.05A7 7 0 0 1 12 2z" />
    <path d="M9 21h6M10 17v-2M14 17v-2" strokeLinecap="round" />
  </svg>
)

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-red-500" stroke="currentColor" strokeWidth={1.8}>
    <path d="M12 2l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V5l7-3z" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-red-500" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
  </svg>
)

const IconRocket = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-red-500" stroke="currentColor" strokeWidth={1.8}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
)

const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-red-500" stroke="currentColor" strokeWidth={1.8}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

// ── value cards data ───────────────────────────────────────────────────────────
const values = [
  {
    icon: <IconBulb />,
    title: 'Innovation',
    desc: "We don't just follow tech trends; we anticipate them. Our team constantly explores emerging technologies to give our clients a competitive edge.",
  },
  {
    icon: <IconShield />,
    title: 'Integrity',
    desc: 'Transparency is our baseline. We build trust through honest communication, rigorous data security, and ethical engineering practices.',
  },
  {
    icon: <IconGlobe />,
    title: 'Impact',
    desc: 'Every line of code we write is aimed at delivering measurable business value. We measure our success by the growth and impact of our partners.',
  },
]

// ── decorative dot-grid ────────────────────────────────────────────────────────
const DotGrid = ({ className }) => (
  <div className={`grid grid-cols-8 gap-1.5 ${className}`}>
    {Array.from({ length: 64 }).map((_, i) => (
      <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300/60" />
    ))}
  </div>
)

// ══════════════════════════════════════════════════════════════════════════════
export default function About() {
  return (
    <div className="font-sans bg-white text-gray-800 overflow-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative flex items-center min-h-[480px] px-10 md:px-20 py-16 overflow-hidden border-l-4 border-green-500">

        {/* left content */}
        <div className="relative z-10 max-w-lg">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold leading-tight text-[#0d1b4b] mb-6"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            We're designing a new<br />
            way to do{' '}
            <motion.span
              className="text-red-600"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.35}
            >
              Engineering
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-sm text-gray-500 leading-relaxed max-w-sm"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
          >
            Our digital solutions provide businesses with cutting-edge technology,
            empower teams with the latest tools, and drive business transformation.
          </motion.p>

          {/* decorative curved line */}
          <motion.svg
            viewBox="0 0 160 60"
            fill="none"
            className="mt-4 w-40 h-10 text-red-400"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
          >
            <motion.path
              d="M10 50 Q60 0 150 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </motion.svg>
        </div>

        {/* right image cluster */}
        <div className="absolute right-10 md:right-20 top-1/2 -translate-y-1/2 flex items-center justify-center">
          {/* big red arc shape */}
          <motion.div
            className="absolute w-80 h-80 bg-red-600 rounded-full"
            style={{ clipPath: 'ellipse(70% 80% at 70% 60%)' }}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* dot grid */}
          <DotGrid className="absolute bottom-0 right-0 opacity-70" />

          {/* circular photo */}
          <motion.div
            className="relative z-10 w-80 h-80 border-white rounded-full overflow-hidden border-4 shadow-2xl"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            custom={0.15}
          >
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"
              alt="Engineer at work"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* ── SAY YES ──────────────────────────────────────────────────────────── */}
      <section className="flex   justify-between flex-col md:flex-row items-center gap-12 px-10 md:px-20 py-20 bg-white">

        {/* circular image with blue half-circle backdrop */}
        <motion.div
          className="relative flex-shrink-0 "
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          custom={0}
        >
          {/* blue half-circle */}
          <div
            className="absolute bottom-0 left-0 w-full h-1/2 bg-[#5b8fa8] rounded-b-full"
          />
          {/* full circle photo */}
          <div className="relative z-10 w-97 h-97 border-8  rounded-full overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&q=80"
              alt="Happy professional"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* text */}
        <div className="max-w-md   ">
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold text-[#0d1b4b] leading-tight mb-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            custom={0}
          >
            Making it easy to<br />
            say{' '}
            <span className="text-red-600">"Yes"</span>
          </motion.h2>

          {/* decorative slash */}
          <motion.svg
            viewBox="0 0 80 20"
            fill="none"
            className="mb-4 w-20 h-5 text-[#5b8fa8]"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ transformOrigin: 'left' }}
          >
            <path d="M5 15 L75 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </motion.svg>

          <motion.p
            className="text-sm text-gray-500 leading-relaxed"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            custom={0.15}
          >
            Forward-thinking enterprises choose YAKSERA to power their digital
            transformation. Our platforms streamline development workflows, secure
            infrastructure, and allow them to offer a superior experience to their
            customers and employees.
          </motion.p>
        </div>
      </section>

      {/* ── CORE VALUES ──────────────────────────────────────────────────────── */}
      <section className="px-10 md:px-20 py-20 bg-gray-50/50">

        {/* label pill */}
        <motion.div
          className="inline-flex items-center border border-red-400 rounded-full px-4 py-1 text-xs text-red-600 font-semibold mb-4"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
        >
          How We Work
        </motion.div>

        <motion.h2
          className="text-3xl font-extrabold text-[#0d1b4b] mb-10"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.05}
        >
          Our Core Values
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={i * 0.12}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
            >
              {/* icon pill */}
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-red-50 mb-6">
                {v.icon}
              </div>
              <h3 className="text-lg font-bold text-[#0d1b4b] mb-3">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ── MISSION & VISION ─────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* left heading */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={0}
          >
            <h2 className="text-3xl font-extrabold text-[#0d1b4b] mb-4">
              Our Mission &amp; Vision
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Guided by excellence, we bridge the gap between complex technical
              challenges and elegant business solutions.
            </p>
          </motion.div>

          {/* cards */}
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: <IconRocket />,
                title: 'Mission',
                desc: 'To empower businesses through scalable, precision-engineered outsourcing services that drive efficiency and sustainable growth in a digital-first economy.',
                delay: 0.1,
              },
              {
                icon: <IconEye />,
                title: 'Vision',
                desc: 'To be the global benchmark for technical outsourcing, recognized for our commitment to integrity, innovation, and the absolute success of our partners.',
                delay: 0.22,
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={card.delay}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 mb-4">
                  {card.icon}
                </div>
                <h3 className="text-base font-bold text-[#0d1b4b] mb-2">{card.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}