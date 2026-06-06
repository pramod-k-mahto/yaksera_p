import { motion } from "framer-motion";

import l from "../assets/abc.png";
export default function ComingSoon() {
  return (
    <div className="min-h-screen flex  items-center justify-center bg-blue-950 text-gray-800 px-6">
      {/* background glow */}
      <div className="absolute w-[400px] h-[400px] bg-red-100 rounded-full blur-3xl opacity-40" />

      <div className="relative text-center max-w-md">
        <div className="flex justify-center items-center m-auto  ">
          <img className="w-60 " src={l} alt="logo" />
        </div>
        {/* animated badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center px-4 py-1 mb-6 text-xs font-semibold text-red-600 border border-red-200 rounded-full bg-red-50"
        >
          🚧 Under Construction
        </motion.div>

        {/* title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="text-4xl md:text-5xl font-extrabold text-[#0d1b4b]"
        >
          Coming Soon...
        </motion.h1>

        {/* subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-4 text-sm text-white leading-relaxed"
        >
          We’re building something powerful behind the scenes. Stay tuned — this
          page will be live very soon.
        </motion.p>

        {/* loader animation */}
        <motion.div
          className="mt-10 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="w-3 h-3 bg-red-500 rounded-full animate-bounce" />
          <span className="w-3 h-3 bg-red-400 rounded-full animate-bounce [animation-delay:0.1s]" />
          <span className="w-3 h-3 bg-red-300 rounded-full animate-bounce [animation-delay:0.2s]" />
        </motion.div>

        {/* optional button */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* <button
            className="px-6 py-2 text-sm font-semibold text-white bg-red-600 rounded-full hover:bg-red-700 transition"
          >
            Notify Me
          </button> */}
        </motion.div>
      </div>
    </div>
  );
}
