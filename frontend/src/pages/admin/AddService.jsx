import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createService } from "../../services/service";

const EMPTY_TECH = { name: "", icon: "" };

function AddService() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    detailDescription: "",
    wide: false,
    tall: false,
    order: 0,
    isActive: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [mockupFile, setMockupFile] = useState(null);
  const [techStack, setTechStack] = useState([{ ...EMPTY_TECH }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── field handlers ────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTechChange = (index, field, value) => {
    setTechStack((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    );
  };

  const addTech = () => setTechStack((prev) => [...prev, { ...EMPTY_TECH }]);
  const removeTech = (index) =>
    setTechStack((prev) => prev.filter((_, i) => i !== index));

  // ── submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!imageFile) {
      setError("Service image is required");
      return;
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("detailDescription", form.detailDescription);
    data.append("wide", String(form.wide));
    data.append("tall", String(form.tall));
    data.append("order", String(form.order));
    data.append("isActive", String(form.isActive));
    data.append("techStack", JSON.stringify(techStack));
    data.append("image", imageFile);
    if (heroImageFile) data.append("heroImage", heroImageFile);
    if (mockupFile) data.append("mockupImage", mockupFile);

    try {
      setLoading(true);
      await createService(data);
      navigate("/admin/serviceManagement");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── shared input styles ───────────────────────────────────────────────────
  const inputCls =
    "w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2 rounded-lg outline-none focus:border-[#e8132f]/60 transition placeholder:text-white/30";
  const labelCls =
    "block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 max-w-3xl"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold text-white">
          Add Service
        </h1>
        <button
          type="button"
          onClick={() => navigate("/admin/services")}
          className="text-sm text-white/40 hover:text-white transition"
        >
          ← Back
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* TITLE */}
        <div>
          <label className={labelCls}>Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Web Development"
            required
            className={inputCls}
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className={labelCls}>Short Description * (card text)</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Custom websites built to perform..."
            required
            rows={2}
            className={inputCls}
          />
        </div>

        {/* DETAIL DESCRIPTION */}
        <div>
          <label className={labelCls}>Detail Description (service page)</label>
          <textarea
            name="detailDescription"
            value={form.detailDescription}
            onChange={handleChange}
            placeholder="Full description shown on the service detail page..."
            rows={4}
            className={inputCls}
          />
        </div>

        {/* IMAGES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Card Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-sm text-white/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-white/10 file:text-white hover:file:bg-white/20 transition"
            />
          </div>
          <div>
            <label className={labelCls}>Hero Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setHeroImageFile(e.target.files[0])}
              className="w-full text-sm text-white/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-white/10 file:text-white hover:file:bg-white/20 transition"
            />
          </div>
          <div>
            <label className={labelCls}>Mockup Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMockupFile(e.target.files[0])}
              className="w-full text-sm text-white/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-white/10 file:text-white hover:file:bg-white/20 transition"
            />
          </div>
        </div>

        {/* LAYOUT FLAGS + ORDER */}
        <div className="flex flex-wrap gap-6 items-center">
          <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
            <input
              type="checkbox"
              name="wide"
              checked={form.wide}
              onChange={handleChange}
              className="accent-[#e8132f] w-4 h-4"
            />
            Wide (2 columns)
          </label>
          <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
            <input
              type="checkbox"
              name="tall"
              checked={form.tall}
              onChange={handleChange}
              className="accent-[#e8132f] w-4 h-4"
            />
            Tall (2 rows)
          </label>
          <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="accent-[#e8132f] w-4 h-4"
            />
            Active
          </label>
          <div className="flex items-center gap-2">
            <label className="text-xs text-white/50 uppercase tracking-wider">
              Order
            </label>
            <input
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              min={0}
              className="w-20 bg-white/5 border border-white/10 text-white text-sm px-3 py-2 rounded-lg outline-none focus:border-[#e8132f]/60 transition"
            />
          </div>
        </div>

        {/* TECH STACK */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className={labelCls}>Tech Stack</label>
            <button
              type="button"
              onClick={addTech}
              className="text-xs text-[#e8132f] hover:text-red-400 transition"
            >
              + Add Tech
            </button>
          </div>
          <div className="space-y-2">
            {techStack.map((tech, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={tech.name}
                  onChange={(e) => handleTechChange(i, "name", e.target.value)}
                  placeholder="React.js"
                  className={`${inputCls} flex-1`}
                />
                <input
                  value={tech.icon}
                  onChange={(e) => handleTechChange(i, "icon", e.target.value)}
                  placeholder="https://cdn.jsdelivr.net/.../react-original.svg"
                  className={`${inputCls} flex-[2]`}
                />
                {techStack.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTech(i)}
                    className="text-white/30 hover:text-red-400 transition text-lg leading-none"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#e8132f] text-white text-sm font-medium rounded-lg hover:bg-[#c40d24] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Creating..." : "Create Service"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default AddService;
