import { motion } from "framer-motion";
import {
  ImagePlus,
  Search,
  Trash2,
  Pencil,
  Eye,
  Upload,
  Grid3X3,
  Download,
  Star,
} from "lucide-react";

const logos = [
  {
    id: 1,
    name: "FinEdge",
    category: "Finance",
    status: "Featured",
    image:
      "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200",
  },
  {
    id: 2,
    name: "NovaTech",
    category: "AI Company",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200",
  },
  {
    id: 3,
    name: "HealthFlow",
    category: "Healthcare",
    status: "Featured",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
  },
  {
    id: 4,
    name: "BuildCraft",
    category: "Construction",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200",
  },
  {
    id: 5,
    name: "CloudSync",
    category: "Cloud Service",
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200",
  },
  {
    id: 6,
    name: "EduSpark",
    category: "Education",
    status: "Featured",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200",
  },
];

const stats = [
  {
    title: "Total Logos",
    value: "248",
    icon: Grid3X3,
  },
  {
    title: "Featured",
    value: "42",
    icon: Star,
  },
  {
    title: "Uploaded",
    value: "18",
    icon: Upload,
  },
  {
    title: "Downloads",
    value: "1.2K",
    icon: Download,
  },
];

function LogoManagement() {
  return (
    <div className="space-y-8">
      {/* TOP */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              text-[30px] md:text-[36px]
              font-black tracking-tight
              text-white
            "
          >
            Logo Management
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="
              mt-2
              max-w-2xl
              text-sm md:text-[15px]
              leading-7
              text-white/50
            "
          >
            Upload, organize, manage, and showcase client logos,
            partner brands, and featured company identities.
          </motion.p>
        </div>

        {/* ACTIONS */}
        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-wrap gap-3"
        >
          <button
            className="
              flex items-center gap-2
              rounded-2xl
              border border-white/10
              bg-white/[0.03]
              px-5 py-3
              text-sm font-semibold text-white/80
              transition-all duration-300
              hover:border-white/20
              hover:bg-white/[0.05]
              hover:text-white
            "
          >
            <Download size={16} />
            Export
          </button>

          <button
            className="
              flex items-center gap-2
              rounded-2xl
              bg-[#e8192c]
              px-5 py-3
              text-sm font-semibold text-white
              shadow-[0_10px_30px_rgba(232,25,44,0.28)]
              transition-all duration-300
              hover:-translate-y-[2px]
              hover:shadow-[0_16px_40px_rgba(232,25,44,0.4)]
            "
          >
            <ImagePlus size={16} />
            Upload Logo
          </button>
        </motion.div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="
                group relative overflow-hidden
                rounded-[28px]
                border border-white/10
                bg-white/[0.03]
                p-6
                backdrop-blur-xl
              "
            >
              <div
                className="
                  absolute right-0 top-0
                  h-28 w-28
                  translate-x-10 -translate-y-10
                  rounded-full
                  bg-[#e8192c]/10
                  blur-3xl
                "
              />

              <div
                className="
                  flex h-14 w-14 items-center justify-center
                  rounded-2xl
                  border border-white/10
                  bg-white/[0.04]
                  text-[#e8192c]
                "
              >
                <Icon size={24} />
              </div>

              <div className="mt-6">
                <p className="text-sm text-white/45">
                  {item.title}
                </p>

                <h2
                  className="
                    mt-2
                    text-3xl font-black tracking-tight
                    text-white
                  "
                >
                  {item.value}
                </h2>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* MAIN BOX */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="
          overflow-hidden
          rounded-[30px]
          border border-white/10
          bg-white/[0.03]
          backdrop-blur-xl
        "
      >
        {/* TOP BAR */}
        <div
          className="
            flex flex-col gap-4
            border-b border-white/10
            px-6 py-5
            lg:flex-row lg:items-center lg:justify-between
          "
        >
          <div>
            <h2 className="text-xl font-bold text-white">
              Brand Logos
            </h2>

            <p className="mt-1 text-sm text-white/45">
              Manage all company and client branding assets.
            </p>
          </div>

          {/* SEARCH */}
          <div
            className="
              flex items-center gap-3
              rounded-2xl
              border border-white/10
              bg-[#0f172a]
              px-4 py-3
              lg:w-[340px]
            "
          >
            <Search size={18} className="text-white/40" />

            <input
              type="text"
              placeholder="Search logos..."
              className="
                w-full bg-transparent
                text-sm text-white
                outline-none
                placeholder:text-white/30
              "
            />
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 xl:grid-cols-3">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.id}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -5 }}
              className="
                group overflow-hidden
                rounded-[26px]
                border border-white/10
                bg-[#0f172a]
              "
            >
              {/* IMAGE */}
              <div className="relative h-[220px] overflow-hidden">
                <img
                  src={logo.image}
                  alt={logo.name}
                  className="
                    h-full w-full object-cover
                    transition-transform duration-500
                    group-hover:scale-105
                  "
                />

                {/* OVERLAY */}
                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-t
                    from-black/80 via-black/20 to-transparent
                  "
                />

                {/* STATUS */}
                <div className="absolute left-4 top-4">
                  <span
                    className={`
                      rounded-full px-3 py-1.5
                      text-xs font-semibold
                      ${
                        logo.status === "Featured"
                          ? "bg-[#e8192c]/20 text-[#ff7b8c]"
                          : logo.status === "Pending"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }
                    `}
                  >
                    {logo.status}
                  </span>
                </div>

                {/* ACTIONS */}
                <div
                  className="
                    absolute right-4 top-4
                    flex gap-2
                    opacity-0
                    transition-all duration-300
                    group-hover:opacity-100
                  "
                >
                  <button
                    className="
                      flex h-10 w-10 items-center justify-center
                      rounded-xl
                      bg-black/40
                      text-white
                      backdrop-blur-md
                      transition-all duration-300
                      hover:bg-[#e8192c]
                    "
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    className="
                      flex h-10 w-10 items-center justify-center
                      rounded-xl
                      bg-black/40
                      text-white
                      backdrop-blur-md
                      transition-all duration-300
                      hover:bg-white/20
                    "
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    className="
                      flex h-10 w-10 items-center justify-center
                      rounded-xl
                      bg-black/40
                      text-white
                      backdrop-blur-md
                      transition-all duration-300
                      hover:bg-red-500
                    "
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {logo.name}
                    </h3>

                    <p className="mt-1 text-sm text-white/45">
                      {logo.category}
                    </p>
                  </div>

                  <div
                    className="
                      rounded-xl
                      border border-white/10
                      bg-white/[0.03]
                      px-3 py-2
                    "
                  >
                    <span className="text-xs font-semibold text-white/60">
                      Logo
                    </span>
                  </div>
                </div>

                {/* FOOTER */}
                <div
                  className="
                    mt-5 flex items-center justify-between
                    border-t border-white/10
                    pt-4
                  "
                >
                  <button
                    className="
                      text-sm font-medium text-white/50
                      transition-colors duration-300
                      hover:text-white
                    "
                  >
                    View Details
                  </button>

                  <button
                    className="
                      rounded-xl
                      bg-[#e8192c]
                      px-4 py-2
                      text-xs font-semibold text-white
                      transition-all duration-300
                      hover:-translate-y-[2px]
                    "
                  >
                    Edit Logo
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default LogoManagement;