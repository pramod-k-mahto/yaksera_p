import { motion } from "motion/react";

import logo1 from "../assets/rotate/logo1.png";
import logo2 from "../assets/rotate/logo2.png";
import logo3 from "../assets/rotate/logo3.png";

const logos = [
  logo1,
  logo2,
  logo3,
  logo1,
  logo2,
  logo3,
  logo1,
  logo2,
];

function RotateLeft() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
      className="
        relative
        w-[700px]
        h-[700px]
        flex
        items-center
        justify-center
        border 
        rounded-full
        top-40
      "
    >
      {/* OUTER RING */}
      <div
        className="
          absolute
          inset-0
          rounded-full
          border
          border-red-100
        "
      />

      {/* MIDDLE RING */}
      <div
        className="
          w-[460px]
          h-[460px]
          rounded-full
          border-2
          border-red-100
          flex
          items-center
          justify-center
        "
      >
        {/* CENTER GLOW */}
        <div
          className="
            w-[220px]
            h-[220px]
            rounded-full
            bg-gradient-to-br
            from-red-50
            to-white
            blur-[2px]
          "
        />
      </div>

      {/* LOGOS */}
      {logos.map((logo, index) => {
        const angle = (360 / logos.length) * index;

        return (
          <div
            key={index}
            className="absolute"
            style={{
              transform: `
                rotate(${angle}deg)
                translateY(-350px)
              `,
            }}
          >
            <div
              style={{
                transform: `rotate(-${angle}deg)`,
              }}
              className="
                bg-white/90
                backdrop-blur
                p-4
                rounded-2xl
                shadow-lg
                border
                border-red-50
              "
            >
              <img
                className="w-10 h-10 object-contain opacity-60"
                src={logo}
                alt=""
              />
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

export default RotateLeft;