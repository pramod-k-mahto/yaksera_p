import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { getServicesAll, deleteService } from "../../services/service";

function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [error, setError]       = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await getServicesAll();
      setServices(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleDelete = async (slug) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await deleteService(slug);
      setServices((prev) => prev.filter((s) => s.slug !== slug));
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold text-white">
          Service Management
        </h1>
        <NavLink
          to="/admin/addService"
          className="px-4 py-2 text-sm font-medium text-white bg-[#e8132f] rounded-lg hover:bg-[#c40d24] transition"
        >
          + Add Service
        </NavLink>
      </div>

      {/* DESCRIPTION */}
      <p className="text-sm text-white/60 max-w-2xl leading-relaxed">
        Manage all IT services offered by your company such as Web Development,
        Mobile Apps, UI/UX Design, and Cloud Solutions. You can add, edit, or
        remove services anytime.
      </p>

      {/* CONTENT AREA */}
      <div className="border border-white/10 rounded-xl p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">All Services</h2>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="bg-transparent border border-white/10 text-sm text-white/70 px-3 py-2 rounded-lg outline-none focus:border-white/30 transition"
          />
        </div>

        {/* STATES */}
        {loading && (
          <div className="mt-10 text-center text-white/40 text-sm">Loading...</div>
        )}

        {error && (
          <div className="mt-10 text-center text-red-400 text-sm">{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="mt-10 text-center text-white/40 text-sm">
            No services found. Click "+ Add Service" to create your first one.
          </div>
        )}

        {/* TABLE */}
        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white/70">
              <thead>
                <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                  <th className="pb-3 text-left">Image</th>
                  <th className="pb-3 text-left">Title</th>
                  <th className="pb-3 text-left">Slug</th>
                  <th className="pb-3 text-left">Order</th>
                  <th className="pb-3 text-left">Status</th>
                  <th className="pb-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((service) => (
                  <tr key={service._id} className="hover:bg-white/5 transition">
                    <td className="py-3 pr-4">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-12 h-10 object-cover rounded-lg"
                      />
                    </td>
                    <td className="py-3 pr-4 font-medium text-white">
                      {service.title}
                    </td>
                    <td className="py-3 pr-4 text-white/40 font-mono text-xs">
                      {service.slug}
                    </td>
                    <td className="py-3 pr-4">{service.order}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          service.isActive
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 flex items-center gap-3">
                      <NavLink
                        to={`/admin/editService/${service.slug}`}
                        className="text-xs text-blue-400 hover:text-blue-300 transition"
                      >
                        Edit
                      </NavLink>
                      <button
                        onClick={() => handleDelete(service.slug)}
                        className="text-xs text-red-400 hover:text-red-300 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ServiceManagement;