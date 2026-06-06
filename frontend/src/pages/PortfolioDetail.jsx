import { NavLink, useLocation } from "react-router-dom";

function PortfolioDetail() {
  const location = useLocation();
  console.log(location?.state)

  const{title,description,tags,image,projectUrl,github}=location.state
  // Example static data (later you can replace with API)
  // const project = {
  //   title: "ERP System",
  //   description:
  //     "A full-stack ERP system built with React, Node.js, and PostgreSQL. It includes authentication, role management, and analytics dashboard.",
  //   tech: ["React", "Node.js", "PostgreSQL", "Tailwind CSS"],
  //   image:
  //     "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200",
  //   live: "#",
  //   github: "#",
  // };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {title}
        </h1>

        {/* <p className="text-slate-400 mb-8">
          Project ID: {id}
        </p> */}

        {/* Image */}
        <div className="rounded-xl overflow-hidden mb-8 border border-slate-800">
          <img
            src={image}
            alt="project"
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-slate-300 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {tags?.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm bg-slate-800 border border-slate-700 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <NavLink
            to={projectUrl}
            target="_blank"
            className="px-5 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium"
          >
            Live Demo
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default PortfolioDetail;