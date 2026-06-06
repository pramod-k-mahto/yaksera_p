import { NavLink, useNavigate } from "react-router-dom";

export default function Call() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#1d2b64] w-full">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-16 sm:py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left */}
        <div className="flex-1 text-center lg:text-left">
          <p className="text-white/60 text-sm font-medium mb-4 tracking-wide">
            Let's Build Something Great
          </p>

          <h2 className="text-white text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-8">
            Ready to start your
            <br className="hidden sm:block" /> next project?
          </h2>

          <button
            onClick={() => {
              navigate("/contact");
            }}
            className="bg-[#d0271d] hover:bg-[#b01f17] active:scale-95 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg"
          >
            Contact Us
          </button>
        </div>

        {/* Right Card */}
        <div className="w-full max-w-sm lg:max-w-[360px] bg-white rounded-2xl shadow-2xl p-6 sm:p-7">
          {/* Status */}
          <div className="flex items-center gap-2 mb-5">
            <span className="relative flex w-2.5 h-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-green-500" />
            </span>
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-gray-400">
              Available for Project
            </span>
          </div>

          {/* Avatars */}
          <div className="flex items-center gap-1 mb-5">
            <img
              src="https://i.pravatar.cc/40?img=51"
              alt="designer"
              className="w-10 h-10 rounded-full border-2 border-white shadow"
            />
            <span className="text-gray-300 text-base font-light mx-1">+</span>
            <div className="w-10 h-10 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center border-2 border-white -ml-2.5">
              You
            </div>
          </div>

          {/* Text */}
          <h3 className="text-gray-900 text-[17px] font-bold mb-1">
            Quick 15-minute call
          </h3>

          <p className="text-gray-400 text-sm mb-6">
            Pick a time that works for you.
          </p>

          {/* CTA */}
          <NavLink 
           target="_blank"
          to="https://calendar.app.google/PwmeVrwpLHT6CnbRA"

          
            className="w-full p-9 bg-[#d0271d] hover:bg-[#b01f17] active:scale-[0.98] text-white font-bold text-sm py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-red-200"
          >
            Book a free call
          </NavLink>
        </div>
      </div>
    </section>
  );
}
