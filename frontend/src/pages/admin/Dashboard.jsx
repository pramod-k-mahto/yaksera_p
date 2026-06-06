import { useState, useEffect, useContext } from "react";
import { Outlet, NavLink, useLocation, data } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FileText,
  Users,
  Briefcase,
  MessageSquare,
  Settings,
  FolderKanban,
  BadgeCheck,
} from "lucide-react";
import { UserContext } from "../../context/UserProvider";

/* NAV DATA */
const navItems = [
  {
    section: "CONTENT",
    items: [
      { label: "Blog", path: "blogManagement", icon: FileText },
      { label: "Portfolio", path: "portfolioManagement", icon: Briefcase },
      { label: "Projects", path: "projectsManagement", icon: FolderKanban },
      { label: "Case Studies", path: "caseStudiesManagement", icon: Briefcase },
    ],
  },
  {
    section: "USERS",
    items: [
      { label: "Clients", path: "clientsManagement", icon: Users },
      { label: "Staff", path: "staffManagement", icon: Users },
      { label: "Job Applied", path: "jobApplied", icon: BadgeCheck },
    ],
  },
  {
    section: "BUSINESS",
    items: [
      { label: "Services", path: "serviceManagement", icon: Settings },
      { label: "Vacancies", path: "vacancyManagement", icon: Briefcase },
      {
        label: "Testimonials",
        path: "testimonialManagement",
        icon: MessageSquare,
      },
      { label: "Contact", path: "contactFormManagement", icon: MessageSquare },
      { label: "Logos", path: "logoManagement", icon: BadgeCheck },
      { label: "Q&A", path: "qAManagement", icon: MessageSquare },
    ],
  },
];

function Dashboard() {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState(280);

  const { user } = useContext(UserContext);

  // console.log(user)

  const min = 80;
  const max = 320;

  /* AUTO SCROLL FIX */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  /* DRAG RESIZE */
  const startDrag = (e) => {
    const startX = e.clientX;
    const startWidth = width;

    const onMove = (event) => {
      const newWidth = startWidth + (event.clientX - startX);

      if (newWidth >= min && newWidth <= max) {
        setWidth(newWidth);

        if (newWidth < 120) setCollapsed(true);
        else setCollapsed(false);
      }
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <div className="flex h-screen bg-[#0b1220] text-white overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <motion.aside
        animate={{ width: collapsed ? 80 : width }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative h-screen bg-[#0f172a] border-r border-white/10 flex flex-col overflow-hidden"
      >
        {/* TOP */}
        <div className="flex items-center justify-between h-[72px] px-4 border-b border-white/10">
          {!collapsed && (
            <div>
              <h1 className="text-sm font-semibold">Admin Panel</h1>
              <p className="text-xs text-white/40">Yaksera</p>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white/60 hover:text-white"
          >
            {collapsed ? "☰" : "✕"}
          </button>
        </div>

        {/* NAV (ONLY THIS SCROLLS) */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
          {navItems.map((group) => (
            <div key={group.section}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] tracking-widest text-white/30">
                  {group.section}
                </p>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `
                        flex items-center gap-3 px-3 py-3 rounded-xl
                        transition-all duration-200
                        ${
                          isActive
                            ? "text-[#e8192c]"
                            : "text-white/60 hover:text-white"
                        }
                        `
                      }
                    >
                      <Icon size={18} />

                      {!collapsed && (
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* RESIZE HANDLE (FIXED, NEVER HIDDEN) */}
        {!collapsed && (
          <div
            onMouseDown={startDrag}
            className="absolute top-0 right-0 h-full w-1 cursor-ew-resize hover:bg-[#e8192c]/40"
          />
        )}
      </motion.aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <div className="h-[72px] border-b border-white/10 flex items-center justify-between px-5">
          <h2 className="text-sm text-white/60">Dashboard</h2>

          <div className="text-xs text-white/40">
            <NavLink to="/admin/profile">
              <img
                className="w-10 h-10 rounded-full border border-white object-cover"
                src={user?.profile || "/default-avatar.png"}
                alt="profile"
              />
            </NavLink>
          </div>
        </div>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
