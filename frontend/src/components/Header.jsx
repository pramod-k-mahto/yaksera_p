import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scrollToId } from "../utils/scroll";
import logo from "../assets/logo.png";
import { UserContext } from "../context/UserProvider";
import { logout } from "../services/users";

const navItems = [
  { label: "Services", section: "services" },
  { label: "Portfolio", section: "portfolio" },
  { label: "Blog", section: "blog" },
  { label: "Testimonials", section: "testimonials" },
  { label: "Process", section: "process" },
];

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { loading, user, setUser, setLoading } = useContext(UserContext);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  const scrollToSection = (section) => {
    setIsOpen(false);
    if (location.pathname !== "/") {
      // Defer the scroll to after Home mounts.
      sessionStorage.setItem("scrollTarget", section);
      navigate("/");
    } else {
      scrollToId(section);
    }
  };
    const logoutUser = async () => {
      let data = await logout();
      // console.log(data);
      // console.log(data);
      if (data?.status == 200) {
        setUser(null);
        alert(data?.message);
        return navigate("/login"); // Redirect to admin dashboard after successful login
      }
    };

  return (
    <>
      {/* HEADER */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0d275c] backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 md:px-10">

          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Yaksera" className="h-9 md:h-11 object-contain" />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => scrollToSection(item.section)}
                className="text-[14px] font-medium text-white/70 hover:text-white transition"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* RIGHT SIDE — Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <div className="h-[18px] w-px bg-white/20" />
                <Link
                  to="/login"
                  className="text-[14px] font-medium text-white/80 hover:text-white transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-[14px] font-semibold text-white border border-white/30 rounded-full px-4 py-1.5 hover:bg-white/10 transition"
                >
                  Register
                </Link>
                <div className="h-[18px] w-px bg-white/20" />
              </>
            ) : (
              <>
                <div className="h-[18px] w-px bg-white/20" />
                <span className="text-[14px] text-white/60">
                  {user.name || user.email}
                </span>
                <button
                  onClick={logoutUser}
                  className="text-[14px] font-medium text-white/80 hover:text-white transition"
                >
                  Log out
                </button>
                <div className="h-[18px] w-px bg-white/20" />
              </>
            )}
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#e8132f] px-5 py-2.5 text-sm font-semibold text-white hover:scale-[1.02] transition"
            >
              Start Project →
            </Link>
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden flex flex-col gap-[5px]"
          >
            <span className="h-[2px] w-5 bg-white" />
            <span className="h-[2px] w-5 bg-white" />
            <span className="h-[2px] w-3 bg-white" />
          </button>
        </div>
      </header>

      {/* SPACER */}
      <div className="h-[74px]" />

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed right-0 top-0 z-50 h-full w-[80%] bg-[#0b1220]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <div className="p-5 border-b border-white/10 flex justify-between">
                <img src={logo} className="h-8" />
                <button onClick={() => setIsOpen(false)}>✕</button>
              </div>

              <div className="flex flex-col p-5 gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.section}
                    onClick={() => scrollToSection(item.section)}
                    className="text-left text-white/70 hover:text-white"
                  >
                    {item.label}
                  </button>
                ))}

                {/* AUTH — Mobile */}
                <div className="border-t border-white/10 pt-4 mt-1 flex flex-col gap-3">
                  {!user ? (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="text-white/70 hover:text-white"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="text-white/70 hover:text-white"
                      >
                        Register
                      </Link>
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-white/40">
                        {user.name || user.email}
                      </span>
                      <button
                        onClick={logoutUser}
                        className="text-left text-white/70 hover:text-white"
                      >
                        Log out
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="absolute bottom-0 w-full p-5 border-t border-white/10">
                <Link
                  to="/contact"
                  className="block text-center bg-[#e8132f] text-white py-3 rounded-xl"
                >
                  Start Project →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;