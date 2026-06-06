import { useState } from "react";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    q: "1. How long does a typical project take?",
    a: "Most projects take 2–4 weeks depending on scope, number of revisions, and communication speed.",
  },
  {
    q: "2. Do you work with startups or only large brands?",
    a: "We work with everyone — from early-stage startups to established enterprises. Great design isn't reserved for big budgets.",
  },
  {
    q: "3. What's included in your design packages?",
    a: "Our packages typically include discovery, wireframes, UI design, responsive layouts, and a handoff-ready Figma file with documentation.",
  },
  {
    q: "4. Do you provide development services too?",
    a: "Yes! We offer full-stack development with React, Next.js, and modern tooling. Ask us about our design + build bundles.",
  },
  {
    q: "5. How do we start a project?",
    a: 'Simple — click "Let\'s Talk" below, fill out a short brief, and we\'ll schedule a free 30-minute discovery call within 24 hours.',
  },
  {
    q: "6. Can you help with ongoing updates after launch?",
    a: "Absolutely. We offer flexible retainer plans for ongoing design support, iterations, and feature additions post-launch.",
  },
];

const avatars = [
  "https://i.pravatar.cc/40?img=11",
  "https://i.pravatar.cc/40?img=22",
  "https://i.pravatar.cc/40?img=33",
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
 const navigate= useNavigate()

  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <section className="min-h-screen bg-[#f9f9f7] flex flex-col items-center justify-center px-4 py-6 sm:py-14 font-sans">

      {/* Header */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-400">
            › GOT QUESTIONS ‹
          </span>

          <span className="font-serif italic text-[#d0271d] text-lg ml-2 relative top-1">
            Let's clear things up ↙
          </span>
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
          We've  <span  className="text-[#e8192c]" >got</span>  answers
        </h2>
      </div>

      {/* FAQ Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 px-6 sm:px-8 py-2">

        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`border-gray-100 ${i !== 0 ? "border-t" : ""}`}
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-start justify-between gap-4 py-6 text-left"
            >
              <span className="text-base sm:text-[17px] font-semibold text-gray-800 leading-snug">
                {faq.q}
              </span>

              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xl font-light mt-0.5 transition-all duration-300 ${
                  open === i
                    ? "bg-[#d0271d] rotate-45"
                    : "bg-gray-900 rotate-0"
                }`}
              >
                +
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-350 ease-in-out ${
                open === i ? "max-h-48 pb-6" : "max-h-0"
              }`}
            >
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                {faq.a}
              </p>
            </div>
          </div>
        ))}

      </div>

      {/* Footer CTA */}
      <div className="mt-10 flex flex-col items-center gap-3">

        <div className="flex items-center">
          {avatars.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="team"
              width={36}
              height={36}
              className={`rounded-full border-2 border-white ${
                i !== 0 ? "-ml-2.5" : ""
              }`}
            />
          ))}
        </div>

        <p className="text-gray-800 font-medium text-[15px]">
          Still have questions?
        </p>

        <button 
        
        
          onClick={()=>{
            navigate("/contact")
          }}

        className="bg-[#d0271d] hover:bg-[#b01f17] active:scale-95 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200 shadow-md shadow-red-200">
          Let's Talk
        </button>

      </div>

    </section>
  );
}