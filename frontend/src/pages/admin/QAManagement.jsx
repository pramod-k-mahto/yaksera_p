import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function QAManagement() {
  const [qas, setQas] = useState([
    {
      question: "What services do you offer?",
      answer:
        "We provide web development, mobile apps, UI/UX design, and SaaS solutions.",
      status: "Published",
    },
    {
      question: "How long does a project take?",
      answer:
        "It depends on complexity. Usually 2–8 weeks for most projects.",
      status: "Draft",
    },
    {
      question: "Do you provide support after delivery?",
      answer: "Yes, we provide full maintenance and support services.",
      status: "Published",
    },
  ]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-white text-xl font-bold">
            Q&A Management
          </h1>
          <p className="text-white/50 text-sm">
            Manage frequently asked questions shown on website
          </p>
        </div>

        <button className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition">
          + Add Question
        </button>
      </motion.div>

      {/* LIST */}
      <div className="space-y-4">

        <AnimatePresence>
          {qas.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: i * 0.05 }}
              className="
                rounded-2xl p-5
                border border-white/10
                bg-[#111b2e]
                hover:border-white/20
                transition-all duration-300
              "
            >

              {/* TOP */}
              <div className="flex items-start justify-between gap-4">

                <h2 className="text-white font-semibold text-base leading-snug">
                  {item.question}
                </h2>

                <span
                  className={`
                    text-xs px-3 py-1 rounded-full font-medium border
                    ${
                      item.status === "Published"
                        ? "text-green-400 border-green-500/30 bg-green-500/10"
                        : "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
                    }
                  `}
                >
                  {item.status}
                </span>

              </div>

              {/* ANSWER */}
              <p className="text-white/60 text-sm mt-3 leading-relaxed">
                {item.answer}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-4">

                <button className="text-xs px-3 py-1 rounded-lg text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 transition">
                  Edit
                </button>

                <button className="text-xs px-3 py-1 rounded-lg text-red-300 bg-red-500/10 hover:bg-red-500/20 transition">
                  Delete
                </button>

              </div>

            </motion.div>
          ))}
        </AnimatePresence>

      </div>

    </div>
  );
}

export default QAManagement;