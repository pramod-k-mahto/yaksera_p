import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContactForm from "../components/ContactForm";
import { getServiceBySlug } from "../services/service";

function ServicesDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await getServiceBySlug(id);
        setService(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchService();
  }, [id]);

  const techStack = service?.techStack?.length > 0 ? service.techStack : [
    { name: "HTML",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "CSS",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "React.js",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Node.js",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "MongoDB",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  ];

  return (
    <div className="font-sans text-gray-800 w-full">

      {/* Hero Section */}
      <div className="relative w-full h-72 overflow-hidden bg-gray-900">
        <img
          src={service?.heroImage || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80"}
          alt={service?.title || "Service"}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-end p-8">
          <h1 className="text-white text-3xl font-bold">{service?.title || ""}</h1>
        </div>
      </div>

      {/* Description + Mockup */}
      <div className="max-w-5xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/2 text-gray-600 text-sm leading-relaxed">
          <p>
            {service?.detailDescription ||
              "Incipient Info builds a high-performing and unique web presence for businesses. We ensure your website attracts and retains clients. We aim for higher conversion rates. In this way, our development team focuses on intuitive developments for all types of online platforms. Our expert developers help you in digital transformations through ultimate customer service, engagements, and much more. We understand, differentiate, and carve the solutions for your business purpose –"}
          </p>
        </div>
        <div className="md:w-1/2">
          <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200">
            <img
              src={service?.mockupImage || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"}
              alt="Website Mockup"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Expertise With Emerging Tech */}
      <div className="bg-gray-50 py-14 px-6">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-10">
          Expertise With Emerging Tech
        </h2>
        <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
          {techStack.map((tech) => (
            <div key={tech.name} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-md bg-[#f0f4ff]">
                <img src={tech.icon} alt={tech.name} className="w-9 h-9 object-contain" />
              </div>
              <span className="text-xs text-gray-500 font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Need Immediate Assistance + Contact */}
      <div className="max-w-5xl mx-auto px-6 py-14">

        {/* Top Banner */}
        <div className="text-center mb-10">
          <p className="text-red-500 font-bold text-lg">Need Immediate assistance?</p>
          <p className="text-gray-500 text-sm mt-1">Let's make things happen—your goals, our expertise!</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">

          {/* Left: Info + Map */}
          <div className="md:w-1/2 flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 leading-snug">
                Let's Build Something <br />
                <span className="text-red-500">Extraordinary</span>
              </h2>
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                We're here to help you achieve your business goals. Whether you have questions about
                our services, want to explore collaboration opportunities, or need guidance on your
                next big project, we'd love to hear from you!
              </p>
            </div>

            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>✉️</span>
                <span>yaksera@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>+977-98412345789</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Kathmandu, Nepal</span>
              </div>
            </div>

            {/* Map Card */}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-3 font-semibold text-sm text-gray-700 border-b">Our Presence</div>
              <iframe
                title="Kathmandu Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56516.31625018038!2d85.2910657!3d27.7172453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb978920f33f4d6b0!2sKathmandu%2C%20Nepal!5e0!3m2!1sen!2s!4v1700000000000"
                className="w-full h-40 grayscale"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
              <div className="p-3 text-center">
                <p className="text-xs text-gray-400 tracking-widest uppercase">
                  Nepal / India / UK / Canada / Australia / Germany / Singapore
                </p>
                <span className="text-gray-400 text-sm">→</span>
              </div>
            </div>
          </div>

          {/* Right: Contact Form Component */}
          <ContactForm />

        </div>
      </div>
    </div>
  );
}

export default ServicesDetail;
