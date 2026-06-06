import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBlogsAll } from "../services/blog";

function Blog() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const res = await getBlogsAll();

      const data = res?.data?.data || res?.data || [];

      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading blogs...
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6 md:px-12 lg:px-20 bg-white">
      <h2 className="text-3xl font-black text-[#e8192c] text-center mb-10">
        Blog
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No blogs found
          </p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              onClick={() => navigate(`/blogDetail/${blog._id}`, { state: blog })}
              className="cursor-pointer bg-white border rounded-2xl overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="h-44 w-full object-cover"
              />

              <div className="p-5 space-y-2">
                <p className="text-xs text-[#e8192c] font-semibold">
                  {blog.category}
                </p>

                <h3 className="font-bold text-[#0d1f4e]">
                  {blog.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {blog.excerpt}
                </p>

                <p className="text-sm text-[#e8192c] font-semibold">
                  Read More →
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Blog;