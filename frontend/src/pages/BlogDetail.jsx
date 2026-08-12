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

// Newer posts store rich HTML; older posts are plain text. Detect which so we
// can render HTML safely and keep legacy line breaks intact.
const looksLikeHtml = (s) => /<\/?[a-z][\s\S]*>/i.test(s || "");

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
    <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-10 md:py-16 bg-white">
      {/* Styling for rich-text blog content rendered from HTML */}
      <style>{`
        .blog-content h2 { font-size: 1.75rem; font-weight: 800; color: #0d1f4e; margin: 1.5rem 0 0.75rem; }
        .blog-content h3 { font-size: 1.35rem; font-weight: 700; color: #0d1f4e; margin: 1.25rem 0 0.5rem; }
        .blog-content p { margin: 0.75rem 0; }
        .blog-content ul { list-style: disc; padding-left: 1.5rem; margin: 0.75rem 0; }
        .blog-content ol { list-style: decimal; padding-left: 1.5rem; margin: 0.75rem 0; }
        .blog-content li { margin: 0.25rem 0; }
        .blog-content a { color: #e8192c; text-decoration: underline; }
        .blog-content blockquote { border-left: 4px solid #e8192c; padding-left: 1rem; color: #475569; font-style: italic; margin: 1rem 0; }
        .blog-content img { max-width: 100%; border-radius: 0.5rem; margin: 1rem 0; }
      `}</style>
      <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-8 lg:gap-12 max-w-7xl mx-auto">

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
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0d1f4e] leading-tight break-words">
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
              className="w-full h-52 sm:h-72 md:h-96 lg:h-[400px] object-cover rounded-xl"
            />
          )}

          {/* EXCERPT */}
          {blog.excerpt && (
            <p className="text-gray-600 text-base sm:text-lg leading-7 sm:leading-8">{blog.excerpt}</p>
          )}

          {/* CONTENT */}
          {blog.content && (
            looksLikeHtml(blog.content) ? (
              <div
                className="blog-content text-gray-700 leading-8"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            ) : (
              <div className="text-gray-700 leading-8 whitespace-pre-line">
                {blog.content}
              </div>
            )
          )}

          {/* SEO meta (metaTitle / metaDescription / keywords) is intentionally
              NOT rendered on the page — it belongs in <head> tags, not visible
              body content. */}

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