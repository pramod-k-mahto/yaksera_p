import { useEffect, useState } from "react";
import map from "../assets/map.svg";

const countries = ["Nepal", "USA", "UK", "UAE", "Canada", "Australia", "Germany", "Singapore"];

export default function GlobalDelivery() {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(true), []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full bg-[#111c3b] max-w-5xl rounded-2xl overflow-hidden relative">

        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(30,80,180,0.12) 0%, transparent 60%)",
          }}
        />

        <div className="flex flex-col md:flex-row items-center relative z-10">

          {/* LEFT */}
          <div
            className={`md:w-2/5 p-8 md:p-12 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <h2 className="text-white text-3xl md:text-4xl font-black leading-tight mb-4">
              Global
              <br />
              Delivery
            </h2>

            <p className="text-blue-200 text-sm md:text-base opacity-80 max-w-[280px] leading-relaxed">
              Serving clients across 8+ countries with distributed delivery
              teams and 24/7 support.
            </p>
          </div>

          {/* RIGHT — map image only */}
          <div
            className={`md:w-3/5 relative transition-all duration-700 delay-300 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <img src={map} alt="World map" className="w-full block" />
          </div>

        </div>

        {/* Country name row — bottom right */}
        <div className="relative bg-[#121e3f] z-10 px-8 md:px-12 pb-3 flex justify-end">
          <p className="text-[11px] tracking-widest text-blue-300/50 font-medium">
            {countries.map((c, i) => (
              <span key={c}>
                {c}
                {i < countries.length - 1 && <span className="mx-1.5">·</span>}
              </span>
            ))}
          </p>
        </div>

      </div>
    </div>
  );
}