import { motion } from 'framer-motion'

// ── brand tokens (match the rest of the site) ─────────────────────────────────
const NAVY = '#0d1f4e'
const RED = '#e8192c'

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
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
    <path d="M12 2a7 7 0 0 1 5 11.95V17a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-3.05A7 7 0 0 1 12 2z" />
    <path d="M9 21h6M10 17v-2M14 17v-2" strokeLinecap="round" />
  </svg>
)

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
    <path d="M12 2l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V5l7-3z" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
  </svg>
)

const IconRocket = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
)

const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
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

const missionVision = [
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
]

// ── decorative dot-grid ────────────────────────────────────────────────────────
const DotGrid = ({ className = '' }) => (
  <div className={`grid grid-cols-6 gap-1.5 ${className}`}>
    {Array.from({ length: 36 }).map((_, i) => (
      <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300/70" />
    ))}
  </div>
)

// ── shared viewport config for scroll-in animations ───────────────────────────
const inView = { once: true, amount: 0.3 }

// ══════════════════════════════════════════════════════════════════════════════
export default function About() {
  return (
    <div className="font-sans bg-white text-gray-800 overflow-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20 py-14 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

          {/* left content */}
          <div className="order-2 lg:order-1">
            <motion.span
              className="inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-wider"
              style={{ borderColor: `${RED}55`, color: RED }}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              About Yaksera
            </motion.span>

            <motion.h1
              className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1]"
              style={{ color: NAVY }}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.08}
            >
              We&apos;re designing a new way to do{' '}
              <span style={{ color: RED }}>Engineering</span>
            </motion.h1>

            <motion.p
              className="mt-5 max-w-xl text-base leading-relaxed text-gray-500"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.18}
            >
              Our digital solutions provide businesses with cutting-edge technology,
              empower teams with the latest tools, and drive real business
              transformation from Nepal to the world.
            </motion.p>

            <motion.svg
              viewBox="0 0 160 60"
              fill="none"
              className="mt-6 h-9 w-36"
              style={{ color: RED }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <motion.path
                d="M10 50 Q60 0 150 20"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, delay: 0.5, ease: 'easeOut' }}
              />
            </motion.svg>
          </div>

          {/* right image cluster — contained, never overlaps text */}
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[22rem] md:h-[22rem]">
              {/* red arc shape behind */}
              <motion.div
                className="absolute -right-4 -bottom-4 h-full w-full rounded-full"
                style={{ background: RED, clipPath: 'ellipse(72% 82% at 68% 60%)' }}
                initial={{ scale: 0.75, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* dot grid accent */}
              <DotGrid className="absolute -left-6 -top-6 opacity-70" />
              {/* circular photo */}
              <motion.div
                className="relative z-10 h-full w-full overflow-hidden rounded-full border-4 border-white shadow-2xl"
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                custom={0.15}
              >
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"
                  alt="Engineer at work"
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SAY YES ──────────────────────────────────────────────────────────── */}
      <section className="bg-gray-50/70">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20 py-14 md:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

            {/* circular image with navy backdrop */}
            <motion.div
              className="flex justify-center lg:justify-start"
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              custom={0}
            >
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[22rem] md:h-[22rem]">
                {/* navy half-circle */}
                <div
                  className="absolute bottom-0 left-1/2 h-1/2 w-full -translate-x-1/2 rounded-b-full"
                  style={{ background: `${NAVY}1a` }}
                />
                {/* full circle photo */}
                <div className="relative z-10 h-full w-full overflow-hidden rounded-full border-8 border-white shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&q=80"
                    alt="Happy professional"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* text */}
            <div>
              <motion.h2
                className="text-3xl md:text-4xl font-extrabold leading-tight"
                style={{ color: NAVY }}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={inView}
                custom={0}
              >
                Making it easy to say <span style={{ color: RED }}>&ldquo;Yes&rdquo;</span>
              </motion.h2>

              <motion.svg
                viewBox="0 0 80 20"
                fill="none"
                className="my-5 h-5 w-20"
                style={{ color: RED }}
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <path d="M5 15 L75 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </motion.svg>

              <motion.p
                className="max-w-xl text-base leading-relaxed text-gray-500"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={inView}
                custom={0.15}
              >
                Forward-thinking enterprises choose YAKSERA to power their digital
                transformation. Our platforms streamline development workflows, secure
                infrastructure, and let them offer a superior experience to their
                customers and employees.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20 py-14 md:py-20">
        {/* label pill */}
        <motion.div
          className="inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold"
          style={{ borderColor: `${RED}66`, color: RED }}
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
        >
          How We Work
        </motion.div>

        <motion.h2
          className="mt-4 text-3xl md:text-4xl font-extrabold"
          style={{ color: NAVY }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.05}
        >
          Our Core Values
        </motion.h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              custom={i * 0.12}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
            >
              <div
                className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: '#fdeaec', color: RED }}
              >
                {v.icon}
              </div>
              <h3 className="mb-3 text-lg font-bold" style={{ color: NAVY }}>{v.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ── MISSION & VISION ─────────────────────────────────────────────── */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* left heading */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            custom={0}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: NAVY }}>
              Our Mission &amp; Vision
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-gray-500">
              Guided by excellence, we bridge the gap between complex technical
              challenges and elegant business solutions.
            </p>
          </motion.div>

          {/* cards */}
          <div className="grid gap-5 sm:grid-cols-2">
            {missionVision.map((card) => (
              <motion.div
                key={card.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={inView}
                custom={card.delay}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
              >
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: '#fdeaec', color: RED }}
                >
                  {card.icon}
                </div>
                <h3 className="mb-2 text-base font-bold" style={{ color: NAVY }}>{card.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
