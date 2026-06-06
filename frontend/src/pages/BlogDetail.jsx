import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogById } from "../services/blog";
import ContactForm from "../components/ContactForm";

// Safe date formatter — avoids crash on undefined/invalid dates
const formatDate = (dateStr) => {
  if (!dateStr) return "Unknown date";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "Invalid date" : d.toDateString();
};

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ added error state

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogById(id);
        const data = res?.data?.data || res?.data;
        setBlog(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load blog. Please try again."); // ✅ capture error
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center">Loading blog...</div>;
  }

  // ✅ show error before the generic "not found" fallback
  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }

  if (!blog) {
    return <div className="py-20 text-center text-red-500">Blog not found</div>;
  }

  return (
    <section className="px-6 md:px-12 lg:px-20 py-16 bg-white">
      <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-12 max-w-7xl mx-auto">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }} // ✅ added transition
          className="space-y-8"
        >

          {/* CATEGORY */}
          {blog.category && (
            <p className="text-sm font-bold text-[#e8192c] uppercase tracking-widest">
              {blog.category}
            </p>
          )}

          {/* TITLE */}
          <h1 className="text-4xl md:text-5xl font-black text-[#0d1f4e]">
            {blog.title}
          </h1>

          {/* META INFO */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {blog.author   && <span>👤 {blog.author}</span>}
            {blog.views    && <span>👁 {blog.views} views</span>}
            <span>📅 {formatDate(blog.createdAt)}</span> {/* ✅ safe formatter */}
            {blog.status   && <span>📌 {blog.status}</span>}
          </div>

          {/* TAGS */}
          {blog.tags?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {blog.tags.map((tag) => (
                <span
                  key={tag} // ✅ use value as key when unique
                  className="px-3 py-1 text-xs bg-gray-100 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* IMAGE */}
          {blog.coverImage && (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-[400px] object-cover rounded-xl"
            />
          )}

          {/* EXCERPT */}
          {blog.excerpt && (
            <p className="text-gray-600 text-lg leading-8">{blog.excerpt}</p>
          )}

          {/* CONTENT */}
          {blog.content && (
            <div className="text-gray-700 leading-8 whitespace-pre-line">
              {blog.content}
            </div>
          )}

          {/* SEO SECTION — ✅ only renders when seo data exists */}
          {blog.seo && (
            <div className="mt-10 p-5 border rounded-xl text-black">
              {/* <h3 className="font-bold text-[#0d1f4e] mb-3">SEO Info</h3> */}

              {blog.seo.metaTitle && (
                <p><b>Meta Title:</b> {blog.seo.metaTitle}</p>
              )}
              {blog.seo.metaDescription && (
                <p><b>Description:</b> {blog.seo.metaDescription}</p>
              )}

              {blog.seo.keywords?.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {blog.seo.keywords.map((k) => (
                    <span key={k} className="text-xs bg-white border px-2 py-1 rounded"> {/* ✅ use value as key */}
                      {k}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

        </motion.div>

        {/* RIGHT */}
        <div  className="bg-white text-black" >
          <ContactForm />
        </div>

      </div>
    </section>
  );
}

export default BlogDetail;