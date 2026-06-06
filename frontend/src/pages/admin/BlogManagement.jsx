import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search, Plus, Eye, Pencil, Trash2, Calendar, User,
} from "lucide-react";
import { getBlogsAll, deleteBlog } from "../../services/blog";

function BlogManagement() {
  const navigate  = useNavigate();
  const [blogs,       setBlogs]      = useState([]);
  const [deletingId,  setDeletingId] = useState(null);
  const [search,      setSearch]     = useState("");

  useEffect(() => {
    getBlogsAll().then((res) => setBlogs(res.data ?? []));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    setDeletingId(id);
    try {
      await deleteBlog(id);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = blogs.filter((b) =>
    b.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* HEADER */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="inline-flex rounded-full border border-[#e8192c]/20 bg-[#e8192c]/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-[#ff4d67]">
            CONTENT MANAGEMENT
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
            Blog Management
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
            Create, manage, edit and publish company blogs, articles and SEO
            content from one professional dashboard.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* SEARCH */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <Search size={18} className="text-white/40" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm outline-none placeholder:text-white/30"
            />
          </div>

          <motion.button
            onClick={() => navigate("/admin/addNewBlog")}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-2xl bg-[#e8192c] px-5 py-3 text-sm font-semibold shadow-[0_12px_30px_rgba(232,25,44,0.28)] transition-all duration-300 hover:shadow-[0_18px_40px_rgba(232,25,44,0.38)]"
          >
            <Plus size={18} />
            Add New Blog
          </motion.button>
        </div>
      </div>

      {/* STATS */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { label: "Total Blogs",       value: blogs.length,                                      sub: "+12% this month",    subColor: "text-green-400" },
          { label: "Published Articles",value: blogs.filter((b) => b.status === "published").length, sub: "Active SEO Content", subColor: "text-blue-400"  },
          { label: "Total Views",       value: blogs.reduce((a, b) => a + (b.views ?? 0), 0),    sub: "Blog traffic growing", subColor: "text-[#ff4d67]" },
        ].map((stat) => (
          <motion.div key={stat.label} whileHover={{ y: -4 }} className="rounded-[28px] border border-white/10 bg-[#0f172a] p-6">
            <p className="text-sm text-white/45">{stat.label}</p>
            <h2 className="mt-4 text-5xl font-black">{stat.value.toLocaleString()}</h2>
            <p className={`mt-3 text-sm ${stat.subColor}`}>{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* TABLE */}
      <div className="mt-10 overflow-hidden rounded-[32px] border border-white/10 bg-[#0f172a]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold">Blog Articles</h2>
            <p className="mt-1 text-sm text-white/40">Manage all published and draft blogs</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-white/10">
                {["Blog", "Category", "Author", "Status", "Views", "Date", "Actions"].map((h) => (
                  <th key={h} className={`px-6 py-5 text-xs font-semibold uppercase tracking-[0.15em] text-white/35 ${h === "Actions" ? "text-right" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map((blog, index) => (
                <motion.tr
                  key={blog._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 transition-all duration-300 hover:bg-white/[0.03]"
                >
                  {/* BLOG */}
                  <td className="px-6 py-5">
                    <div className="flex items-start gap-4">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="h-14 w-20 rounded-2xl object-cover bg-gradient-to-br from-[#e8192c] to-[#ff4d67]"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                      <div>
                        <h3 className="max-w-[260px] text-sm font-semibold leading-6">{blog.title}</h3>
                        <p className="mt-1 text-xs text-white/35">{blog.excerpt?.slice(0, 60)}…</p>
                      </div>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-6 py-5">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                      {blog.category}
                    </span>
                  </td>

                  {/* AUTHOR */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <User size={14} /> {blog.author}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      blog.status === "published"
                        ? "bg-green-500/10 text-green-400"
                        : blog.status === "draft"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-blue-500/10 text-blue-400"
                    }`}>
                      {blog.status?.charAt(0).toUpperCase() + blog.status?.slice(1)}
                    </span>
                  </td>

                  {/* VIEWS */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-white/65">
                      <Eye size={14} /> {blog.views?.toLocaleString() ?? 0}
                    </div>
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-white/55">
                      <Calendar size={14} />
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/editBlog/${blog._id}`)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 transition-all duration-300 hover:bg-[#e8192c]/15 hover:text-[#ff4d67]"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(blog._id)}
                        disabled={deletingId === blog._id}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 transition-all duration-300 hover:bg-red-500/15 hover:text-red-400 disabled:opacity-40"
                      >
                        {deletingId === blog._id
                          ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                          : <Trash2 size={16} />
                        }
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-sm text-white/30">
                    {search ? `No blogs matching "${search}"` : "No blogs yet. Create your first post."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BlogManagement;