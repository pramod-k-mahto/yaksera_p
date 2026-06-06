import React, { useState, useEffect } from 'react'

const steps = [
  {
    number: "01",
    title: "Research",
    subtitle: "Discovery & Analysis",
    desc: "We deep-dive into your business goals, target audience, and market landscape to build a solid foundation.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    color: "bg-red-600",
    textColor: "text-red-600",
    borderColor: "border-red-600",
  },
  {
    number: "02",
    title: "Planning",
    subtitle: "Strategy & Roadmap",
    desc: "We define the project scope, architecture, timelines and resource allocation for seamless execution.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
    color: "bg-[#0d1b3e]",
    textColor: "text-[#0d1b3e]",
    borderColor: "border-[#0d1b3e]",
  },
  {
    number: "03",
    title: "Design",
    subtitle: "UI/UX Creation",
    desc: "Our designers craft pixel-perfect interfaces that balance aesthetics with intuitive user experience.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="13.5" cy="6.5" r="2.5"/><path d="M17 12H3l4-8"/><path d="M12 12v8H8l-1-4"/>
      </svg>
    ),
    color: "bg-red-600",
    textColor: "text-red-600",
    borderColor: "border-red-600",
  },
  {
    number: "04",
    title: "Development",
    subtitle: "Build & Engineer",
    desc: "Expert engineers write clean, scalable code using modern tech stacks with agile sprints and daily standups.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    color: "bg-[#0d1b3e]",
    textColor: "text-[#0d1b3e]",
    borderColor: "border-[#0d1b3e]",
  },
  {
    number: "05",
    title: "Testing",
    subtitle: "QA & Validation",
    desc: "Rigorous quality assurance across devices and browsers ensures your product is bug-free before launch.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11m0 0H5l-2 4h18l-2-4h-4m-4 0V3"/>
      </svg>
    ),
    color: "bg-red-600",
    textColor: "text-red-600",
    borderColor: "border-red-600",
  },
  {
    number: "06",
    title: "Launch",
    subtitle: "Deploy & Support",
    desc: "We handle deployment, monitor performance, and provide ongoing support to keep your product running flawlessly.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/>
      </svg>
    ),
    color: "bg-[#0d1b3e]",
    textColor: "text-[#0d1b3e]",
    borderColor: "border-[#0d1b3e]",
  },
]

const scrollItems = [...steps, ...steps, ...steps]

function Process() {
  const [activeStep, setActiveStep] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length)
    }, 2800)
    return () => clearInterval(t)
  }, [paused])

  return (
    <div className="bg-white py-16 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* HEADER (UNCHANGED UI) */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span className="inline-block border border-red-500 text-red-500 text-xs font-medium rounded-full px-4 py-1 mb-4 tracking-widest uppercase">
              Our Process
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#0d1b3e] leading-tight">
              How We <span className="text-red-600">Work</span>
            </h2>
            <p className="text-gray-400 text-sm mt-3 max-w-md leading-relaxed">
              A proven six-step process refined over 12+ years — from discovery to deployment, we handle everything.
            </p>
          </div>

          <div className="flex gap-2 items-center">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActiveStep(i); setPaused(true) }}
                className={`rounded-full transition-all duration-300 ${
                  activeStep === i
                    ? 'w-8 h-3 bg-red-600'
                    : 'w-3 h-3 bg-gray-200 hover:bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ACTIVE CARD (UNCHANGED UI) */}
        <div
          className="mb-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className={`relative rounded-3xl p-8 md:p-12 border-2 ${steps[activeStep].borderColor} bg-white shadow-lg overflow-hidden`}>

            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">

              <div className={`w-16 h-16 rounded-2xl ${steps[activeStep].color} text-white flex items-center justify-center`}>
                {steps[activeStep].icon}
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-sm font-bold ${steps[activeStep].textColor}`}>
                    Step {steps[activeStep].number}
                  </span>
                  <span className="text-gray-300">·</span>
                  <span className="text-sm text-gray-400">{steps[activeStep].subtitle}</span>
                </div>

                <h3 className="text-3xl md:text-4xl font-black text-[#0d1b3e] mb-3">
                  {steps[activeStep].title}
                </h3>

                <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl">
                  {steps[activeStep].desc}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* SCROLL STRIP (UNCHANGED UI) */}
        <div
          className="overflow-hidden relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="flex gap-5"
            style={{
              animation: 'scrollLeft 30s linear infinite',
              width: 'max-content',
            }}
          >
            {scrollItems.map((step, idx) => (
              <div
                key={idx}
                onClick={() => { setActiveStep(idx % steps.length); setPaused(true) }}
                className={`cursor-pointer shrink-0 w-64 rounded-2xl border-2 p-6 transition-all duration-300 ${
                  activeStep === idx % steps.length
                    ? `${step.borderColor} bg-gray-50 shadow-md`
                    : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${step.color} text-white flex items-center justify-center`}>
                    {step.icon}
                  </div>
                  <span className={`text-2xl font-black opacity-20 ${step.textColor}`}>
                    {step.number}
                  </span>
                </div>

                <div className={`text-xs font-bold mb-1 ${step.textColor}`}>
                  {step.subtitle}
                </div>

                <div className="text-base font-black text-[#0d1b3e] mb-2">
                  {step.title}
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  )
}

export default Process