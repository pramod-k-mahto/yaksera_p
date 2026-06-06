import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getServicesAll } from "../services/service";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function Services() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const [services, setServices] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getServicesAll();
        setServices(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    getData();
  }, []);

  return (
    <section className="bg-white px-6 md:px-12 lg:px-20 py-20">
      {/* HEADER */}
      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="flex flex-col lg:flex-row justify-between gap-10 mb-14"
      >
        {/* LEFT */}
        <motion.div variants={fadeUp} className="max-w-xl">
          <span className="text-[#e8192c] border border-[#e8192c]/30 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full">
            What We Do
          </span>

          <h2 className="text-3xl lg:text-4xl font-black text-[#0d1f4e] mt-5 leading-tight">
            Engineering Solutions to Drive
            <br />
            Your <span className="text-[#e8192c]">Business Forward</span>
          </h2>
        </motion.div>

        {/* RIGHT */}
        <motion.div variants={fadeUp} className="max-w-md">
          <p className="text-gray-600 leading-7">
            We deliver end-to-end development with senior engineers, modern
            tech, and strong focus on quality and scalability.
          </p>
        </motion.div>
      </motion.div>

      {/* GRID */}
      <motion.div
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[240px]"
      >
        {services.map((service) => (
          <motion.div
            key={service._id}
            variants={fadeUp}
            className={`relative overflow-hidden rounded-2xl group cursor-pointer shadow-lg
              ${service.wide ? "lg:col-span-2" : ""}
              ${service.tall ? "row-span-2" : ""}
            `}
          >
            {/* IMAGE */}
            <img
              src={service.image}
              alt={service.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/75 transition duration-500" />

            {/* CONTENT */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h3 className="text-white font-black text-xl lg:text-2xl">
                {service.title}
              </h3>

              <div className="w-10 h-[3px] bg-[#e8192c] mt-2 rounded-full" />

              <p className="text-white/80 text-sm mt-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition duration-500">
                {service.description}
              </p>

              <button
                onClick={() => navigate(`/servicesDetail/${service._id}`)}
                className="mt-5 p-7 bg-[#e8192c] text-white text-sm font-semibold px-5 py-2 rounded-lg opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition duration-500"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default Services;