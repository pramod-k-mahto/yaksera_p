import { useRef } from "react";

import m from "../assets/OurClient/m.png";
import cloudescale from "../assets/OurClient/cloudescale.png";
import dataflow from "../assets/OurClient/dataflow.png";
import finext from "../assets/OurClient/finext.png";
import globalbuild from "../assets/OurClient/globalbuild.png";
import innsol from "../assets/OurClient/innsol.png";
import nexatech from "../assets/OurClient/nexatech.png";
import smartflow from "../assets/OurClient/smartflow.png";
import techwave from "../assets/OurClient/techwave.png";

const clients = [
  { img: m, name: "M" },
  { img: cloudescale, name: "CloudScale" },
  { img: smartflow, name: "SmartFlow" },
  { img: dataflow, name: "DataFlow" },
  { img: finext, name: "Finext" },
  { img: globalbuild, name: "GlobalBuild" },
  { img: innsol, name: "Innsol" },
  { img: nexatech, name: "NexaTech" },
  { img: techwave, name: "TechWave" },
];

export default function OurPreciousClients() {
  const sliderRef = useRef(null);

  const moveSlider = (dir) => {
    const el = sliderRef.current;
    if (!el) return;

    const step = 220;

    // pause animation
    el.style.animation = "none";

    el.scrollBy({
      left: dir === "left" ? -step : step,
      behavior: "smooth",
    });

    setTimeout(() => {
      el.style.animation = "scroll 25s linear infinite";
    }, 1200);
  };

  const loopedClients = [...clients, ...clients];

  return (
    <section className="relative overflow-hidden py-20">

      {/* TITLE */}
      <div className="text-center mb-14">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0b2c6f]">
          Our Precious <span className="text-red-500">Clients</span>
        </h1>

        <div className="flex justify-center items-center gap-3 mt-4">
          <div className="w-14 h-1 bg-blue-900 rounded" />
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <div className="w-14 h-1 bg-red-500 rounded" />
        </div>
      </div>

      {/* SLIDER */}
      <div className="relative w-full overflow-hidden">

        {/* fade edges */}
        <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white to-transparent z-10" />

        <div
          ref={sliderRef}
          className="flex gap-6 w-max animate-scroll hover:[animation-play-state:paused]"
        >
          {loopedClients.map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className="w-[180px] h-[160px] flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 hover:shadow-md transition hover:-translate-y-2"
            >
              <div className="w-20 h-20 flex items-center justify-center">
                <img
                  src={client.img}
                  alt={client.name}
                  className="max-w-[70px] max-h-[50px] object-contain brightness-100 contrast-125"
                />
              </div>

              <div className="text-sm font-semibold text-[#16326f]">
                {client.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex text-black justify-center gap-4 mt-8">
        <button
          onClick={() => moveSlider("left")}
          className="w-10 h-10 rounded-full bg-gray-100 shadow-2xl hover:bg-blue-900 hover:text-white transition"
        >
          ‹
        </button>

        <button
          onClick={() => moveSlider("right")}
          className="w-10 h-10 rounded-full bg-gray-100 shadow-2xl hover:bg-blue-900 hover:text-white transition"
        >
          ›
        </button>
      </div>

      {/* ANIMATION */}
      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
      `}</style>

    </section>
  );
}