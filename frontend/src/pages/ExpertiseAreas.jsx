import React from "react";

const industries = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Healthcare",
    description: "Modernizing patient care through integrated digital health ecosystems and secure data management.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 10v11M16 10v11M12 10v11" />
      </svg>
    ),
    title: "Real Estate",
    description: "Revolutionizing property management and investment through proptech innovation and spatial analytics.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "Hospitality",
    description: "Enhancing guest experiences and operational efficiency with contactless technology and CRM mastery.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Fintech",
    description: "Building secure, scalable payment gateways and automated financial advisory tools for the future of money.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Ecommerce",
    description: "Optimizing conversion funnels and supply chains through AI-driven personalization and logistics tech.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    title: "Education",
    description: "Empowering learning institutions with LMS platforms and adaptive digital curricula for hybrid environments.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    title: "Fashion",
    description: "Bridging luxury and technology with immersive virtual try-ons and sustainable manufacturing tracking.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Jewelry",
    description: "Digitalizing the high-end retail experience through blockchain provenance and 3D product visualization.",
  },
];

function ExpertiseAreas() {
  return (
    <section className="w-full bg-white px-6 py-16 md:px-12 lg:px-20 font-sans">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-14">

        <div>
          <span className="inline-block border border-red-500 text-red-500 text-xs font-semibold tracking-widest uppercase px-4 py-1 rounded-full mb-4">
            Expertise Areas
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0a1628] leading-tight">
            Industries We <span className="text-red-500">Transform</span>
          </h2>
        </div>

        <div className="lg:max-w-sm xl:max-w-md mt-2">
          <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-4">
            We are happily serving clients from different industries. Here are a few to define our unerring development approach.
          </p>

          <div className="flex items-center gap-[3px] flex-wrap">
            {Array.from({ length: 36 }).map((_, i) => (
              <span
                key={i}
                className={`rounded-full ${
                  i % 5 === 0 ? "w-2 h-2 bg-red-500" : "w-1.5 h-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {industries.map(({ icon, title, description }) => (
          <div
            key={title}
            className="group border border-gray-100 rounded-2xl p-7 flex flex-col gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white"
          >
            {/* Icon Box */}
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#0a1628] transition-colors duration-300">
              {icon}
            </div>

            {/* Title */}
            <h3 className="text-[#0a1628] text-lg font-black group-hover:text-red-500 transition-colors duration-300">
              {title}
            </h3>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed">
              {description}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}

export default ExpertiseAreas;