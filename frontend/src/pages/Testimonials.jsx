import React, { useState, useEffect, useRef } from 'react'
import { getTestimonials } from '../services/testimonial'

const testimonials = [
  {
    id: 1,
    quote: "They translated our ideas into a clean, modern digital presence that feels exactly right for our brand.",
    name: "Ethan Miller",
    role: "Director",
    stars: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan",
  },
  {
    id: 2,
    quote: "The team instantly grasped what we needed and delivered a seamless experience that exceeded every expectation.",
    name: "Sophia Reyes",
    role: "Data Science Consultant",
    stars: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
  },
  {
    id: 3,
    quote: "Outstanding work from start to finish. The attention to detail and communication throughout the project was exceptional.",
    name: "James Carter",
    role: "Product Manager",
    stars: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
  {
    id: 4,
    quote: "They brought our vision to life with incredible precision. Our conversion rate improved significantly after launch.",
    name: "Aisha Patel",
    role: "Marketing Director",
    stars: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha",
  },
  {
    id: 5,
    quote: "Professional, creative, and highly skilled team. They delivered on time and the results speak for themselves.",
    name: "Marcus Lee",
    role: "CEO, TechStart",
    stars: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
  },
]

function Stars({ count, total = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: total }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < count ? "#e8192c" : "#e5e7eb"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const trackRef = useRef(null)
  const intervalRef = useRef(null)

  const getData = async () => {
    const data = await getTestimonials();
    console.log(data.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const visibleCount = 2
  const total = testimonials.length

  const prev = () => setCurrent(c => (c - 1 + total) % total)
  const next = () => setCurrent(c => (c + 1) % total)

  useEffect(() => {
    if (paused) return
    intervalRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % total)
    }, 3000)
    return () => clearInterval(intervalRef.current)
  }, [paused, total])

  const visibleCards = Array.from({ length: visibleCount }, (_, i) =>
    testimonials[(current + i) % total]
  )

  return (
    <div className="bg-white min-h-screen py-14 px-6 md:px-12 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
          <div>
            <span className="inline-block border border-[#e8192c] text-[#e8192c] text-xs font-medium rounded-full px-4 py-1 mb-4 tracking-widest">
              TESTIMONIALS
            </span>

            <h2 className="text-3xl md:text-4xl font-black text-[#0d1f4e] leading-tight">
              WHAT OUR <span className="text-[#e8192c]">CLIENTS SAY</span>
            </h2>
          </div>

          <div className="md:max-w-sm">
            <p className="text-gray-500 text-sm leading-relaxed">
              Don't take our word for it – hear from the people we've helped scale.
              We're proud to be a trusted technology partner for global businesses across every industry.
            </p>

            <div className="flex flex-wrap gap-0.5 mt-3">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full ${
                    i < 4
                      ? 'w-2.5 h-2.5 bg-[#0d1f4e]'
                      : i < 10
                      ? 'w-2 h-2 bg-gray-400'
                      : 'w-1.5 h-1.5 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Cards Slider */}
        <div
          className="overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            ref={trackRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500"
          >
            {visibleCards.map((t, idx) => (
              <div
                key={`${t.id}-${idx}`}
                className="border border-gray-200 rounded-2xl p-7 flex flex-col justify-between min-h-[240px] shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <p className="text-[#0d1f4e] text-lg md:text-xl font-normal leading-snug mb-8">
                  {t.quote}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full bg-gray-200 object-cover border border-gray-200"
                    />

                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-[#0d1f4e]">
                        {t.name}
                      </span>
                      <span className="text-gray-400">—</span>
                      <span className="text-gray-500">{t.role}</span>
                    </div>
                  </div>

                  <Stars count={t.stars} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <div className="flex-1 h-px bg-gray-200" />

          <button
            onClick={prev}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-[#0d1f4e] hover:text-[#0d1f4e]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={next}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-[#0d1f4e] hover:text-[#0d1f4e]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className="font-bold text-[#0d1f4e] text-sm">Excellent</span>
          <Stars count={5} />
          <span className="text-gray-500 text-sm">
            4.9 out of 5 based on 40+ reviews
          </span>
        </div>

      </div>
    </div>
  )
}

export default Testimonials