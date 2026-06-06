import { motion } from "framer-motion";
import ContactForm from "../components/ContactForm";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d },
  }),
};

const contactInfo = [
  { icon: "✉️", label: "yakserasolutions@gmail.com" },
  { icon: "📞", label: "+977-9768534410" },
  { icon: "📞", label: "+977-9712082575" },
  { icon: "📞", label: "+977-9860267997" },
  { icon: "📍", label: "Location: Madhyapur Thimi-5, Bhaktapur" },
];

function Contact() {
  return (
    <main
      className="min-h-screen bg-[#f9fafb]"
      style={{ fontFamily: "'DM Sans', sans-serif", color: "#111827" }}
    >
      {/* HEADER */}
      <motion.section
        className="text-center py-10 border-b border-gray-200"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-lg font-extrabold text-[#e8192c]">
          Need Immediate Assistance?
        </h2>
        <p className="text-sm text-gray-500 mt-1.5">
          Let's make things happen — your goals, our expertise!
        </p>
      </motion.section>

      {/* CONTENT */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-20 py-20 overflow-hidden">
        {/* background blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-red-200/30 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gray-200/40 blur-3xl rounded-full pointer-events-none" />

        <div className="relative grid lg:grid-cols-2 gap-14 items-start">

          {/* LEFT */}
          <div>
            <motion.h1
              className="text-5xl lg:text-6xl font-black leading-[1.05] text-[#0d1f4e]"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
            >
              Let's Build Something
              <span className="block text-red-600">Extraordinary</span>
            </motion.h1>

            <motion.p
              className="mt-5 text-lg text-gray-500 leading-relaxed max-w-md"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.1}
            >
              We're here to help you achieve your business goals.
            </motion.p>

            <motion.div
              className="mt-10 space-y-4"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.18}
            >
              {contactInfo.map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-sm">
                    {icon}
                  </span>
                  <span className="font-semibold text-sm">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — form component */}
          <ContactForm />

        </div>
      </section>
    </main>
  );
}

export default Contact;