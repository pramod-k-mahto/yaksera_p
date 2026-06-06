import logo from "../assets/logo.png";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { scroller } from "react-scroll";
import { FaLinkedin } from "react-icons/fa6";
import { AiFillTikTok } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa";
import { GrInstagram } from "react-icons/gr";

const services = [
  "Web Development",
  "Mobile Apps",
  "Software Development",
  "UI/UX Design",
];

const quickLinks = [
  { name: "About Us", path: "/about" },
  { name: "Case Studies", path: "/caseStudies" },
  { name: "Our Services", section: "services" }, // ONLY SCROLL
  { name: "Career", path: "/hire" },
];

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ ONLY SCROLL FUNCTION (for services)
  const scrollToSection = (section) => {
    if (location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        scroller.scrollTo(section, {
          smooth: true,
          duration: 500,
          offset: -85,
        });
      }, 300);
    } else {
      scroller.scrollTo(section, {
        smooth: true,
        duration: 500,
        offset: -85,
      });
    }
  };

  return (
    <footer className="bg-[#0d1f4e] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* LOGO */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img src={logo} alt="logo" className="w-44" />
            <p className="mt-5 text-slate-300 text-sm">
              Premium IT outsourcing solutions for businesses worldwide
            </p>
          </div>

          {/* SERVICES */}
          <div>
            <h3 className="text-red-500 font-semibold mb-5 uppercase">
              Services
            </h3>

            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-slate-300 text-sm hover:text-white transition cursor-pointer">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* QUICK LINKS (MIXED) */}
          <div>
            <h3 className="text-red-500 font-semibold mb-5 uppercase">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {/* 🔥 SCROLL ONLY FOR SERVICES */}
                  {link.section ? (
                    <button
                      onClick={() => scrollToSection(link.section)}
                      className="text-slate-300 text-sm hover:text-white transition"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <NavLink
                      to={link.path}
                      className="text-slate-300 text-sm hover:text-white transition"
                    >
                      {link.name}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-red-500 font-semibold mb-5 uppercase">
              Contact
            </h3>

            <p className="text-slate-300 text-sm mb-2">
              Email: contact@yaksera.com
            </p>

            <div className="text-slate-300 text-sm mb-4 space-y-1">
              <p>Phone: 9768534410 | 9860267997 | 9712082575</p>
            </div>

            <div className="flex gap-3">
              <NavLink   target="_blank"  to='https://www.facebook.com/share/16qwURL1if/?mibextid=wwXIfr' >
                <FaFacebookF size={20} />
              </NavLink>
              <NavLink  target="_blank" to='https://www.linkedin.com/in/yaksera' >
                <FaLinkedin size={20} />
              </NavLink>
              <NavLink  target="_blank"  to="https://www.tiktok.com/@yaksera?_r=1&_t=ZS-96T4DlBHdzT"  >
                <AiFillTikTok size={20} />
              </NavLink>
              <NavLink  target="_blank" to='https://www.instagram.com/yakserasolutions?igsh=b254M3NsdHpvcm5r&utm_source=qr'  >
                <GrInstagram size={20} />
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-slate-700">
        <div className="text-center py-5 text-slate-400 text-sm">
          © 2026 YAKSERA SOLUTIONS PRIVATE LTD. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
