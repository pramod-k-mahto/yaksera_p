import { useEffect, useMemo, useState } from "react";
import { getJobVacancies } from "../services/jobVacancy";
import { useNavigate } from "react-router-dom";

const tabs = ["All", "Engineering", "Design", "Internship", "Infrastructure"];

function BulletItem({ text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center mt-0.5 shrink-0">
        <div className="w-2 h-2 rounded-full bg-red-500" />
      </div>
      <p className="text-slate-600 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function MetaPill({ text }) {
  return (
    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
      {text}
    </span>
  );
}

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState(null); // ✅ null initially, not jobs[0]
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const getData = async () => {
    try {
      const response = await getJobVacancies();
      // ✅ API returns { data: { data: [...] } } or { data: [...] } — handle both
      const list = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
      setJobs(list);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // ✅ Auto-select first job once jobs load
  useEffect(() => {
    if (jobs.length > 0 && !selected) {
      setSelected(jobs[0]);
    }
  }, [jobs]);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const matchTab = active === "All" || job.dept === active;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        job.title?.toLowerCase().includes(q) ||
        (job.tags ?? []).join(" ").toLowerCase().includes(q) ||
        job.dept?.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [jobs, active, search]); // ✅ added `jobs` to deps (was missing!)

  // ✅ Use _id (MongoDB), not id
  const displaySelected =
    filtered.find((j) => j._id === selected?._id) || filtered[0] || selected;

  function handleSelect(job) {
    setSelected(job);
  }

  return (
    <section className="w-full bg-[#f8fafc]">
      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
            {jobs.length} Open Positions
          </span>
        </div>

        <div className="max-w-4xl">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-none text-slate-900 mb-8">
            <span className="text-red-600"> Build products</span>
            <br />
            people remember.
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
            Join a small team of engineers and designers building modern digital
            products for startups and growing businesses worldwide.
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pb-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  active === tab
                    ? "bg-slate-900 text-white shadow-lg"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="w-full lg:w-[320px]">
            <input
              type="text"
              placeholder="Search roles or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8">
          {/* LEFT — Job List */}
          <div className="space-y-4">
            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-400 text-sm">
                No roles match your search.
              </div>
            )}
            {filtered.map((job) => {
              const isActive = displaySelected?._id === job._id; // ✅ _id
              return (
                <div
                  key={job._id} // ✅ _id
                  onClick={() => handleSelect(job)}
                  className={`group cursor-pointer rounded-3xl p-6 transition-all duration-300 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-2xl"
                      : "bg-white hover:-translate-y-1 hover:shadow-xl border border-slate-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <p
                        className={`text-xs uppercase tracking-[0.18em] font-semibold mb-3 ${isActive ? "text-white/50" : "text-slate-400"}`}
                      >
                        {job.dept}
                      </p>
                      <h3 className="text-xl text-red-500 font-bold tracking-tight">
                        {job.title}
                      </h3>
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-red-500"
                          : "bg-slate-100 group-hover:bg-slate-900 group-hover:text-white"
                      }`}
                    >
                      →
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-5 text-sm">
                    {/* ✅ API uses `experience`, not `exp` */}
                    {[job.location, job.experience, job.type].map(
                      (item, i, arr) => (
                        <span key={i}>
                          <span
                            className={
                              isActive ? "text-white/70" : "text-slate-500"
                            }
                          >
                            {item}
                          </span>
                          {i < arr.length - 1 && (
                            <span
                              className={`ml-3 ${isActive ? "text-white/30" : "text-slate-300"}`}
                            >
                              •
                            </span>
                          )}
                        </span>
                      ),
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(job.tags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT — Detail Panel */}
          {displaySelected && (
            <div className="lg:sticky lg:top-10 h-fit">
              <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
                {/* Top */}
                <div className="p-8 border-b border-slate-100">
                  <div className="flex items-start justify-between gap-5 mb-8">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-red-500 font-semibold mb-4">
                        {displaySelected.dept}
                      </p>
                      <h2 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                        {displaySelected.title}
                      </h2>
                    </div>
                    {/* <button className="bg-slate-900 hover:bg-black text-white px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200">
                      Apply
                    </button> */}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(displaySelected.tags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div className="p-8">
                  <p className="text-slate-500 text-lg leading-relaxed mb-10">
                    {displaySelected.description}
                  </p>

                  <div className="space-y-8">
                    {/* ✅ API uses `responsibilities`, not `do` */}
                    {(displaySelected.responsibilities ?? []).length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold mb-4">
                          What you'll do
                        </p>
                        <div className="space-y-4">
                          {displaySelected.responsibilities.map((item) => (
                            <BulletItem key={item} text={item} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ✅ API uses `requirements`, not `req` */}
                    {(displaySelected.requirements ?? []).length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold mb-4">
                          Requirements
                        </p>
                        <div className="space-y-4">
                          {displaySelected.requirements.map((item) => (
                            <BulletItem key={item} text={item} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ✅ Bonus: show benefits if present */}
                    {(displaySelected.benefits ?? []).length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold mb-4">
                          Benefits
                        </p>
                        <div className="space-y-4">
                          {displaySelected.benefits.map((item) => (
                            <BulletItem key={item} text={item} />
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold mb-4">
                        Details
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <MetaPill text={displaySelected.location} />
                        <MetaPill text={displaySelected.experience} />{" "}
                        {/* ✅ experience */}
                        <MetaPill text={displaySelected.type} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-slate-100 bg-slate-50">
                  <button
                    onClick={() => {
                      navigate("/jobApplicationForm", {
                        state: {
                          vacancyId: displaySelected._id,
                          title: displaySelected.title,
                        },
                      });
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 active:scale-[0.99] text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-red-200"
                  >
                    Apply for this Role
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pb-24">
        <div className="relative overflow-hidden rounded-[40px] bg-[#0f172a] px-8 md:px-14 py-16">
          <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-red-500/20 blur-3xl rounded-full" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-white/50 text-sm uppercase tracking-[0.2em] font-semibold mb-5">
                Open Application
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-6">
                Don't see your
                <br />
                perfect role?
              </h2>
              <p className="text-white/60 text-lg leading-relaxed max-w-lg">
                We're always looking for exceptional people who care deeply
                about design, engineering, and building impactful products.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="relative flex w-2.5 h-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-green-400" />
                </span>
                <span className="text-xs uppercase tracking-[0.18em] font-semibold text-white/50">
                  We are hiring
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Send us your résumé
              </h3>
              <p className="text-white/60 leading-relaxed mb-8">
                Tell us what you're passionate about and what kind of work
                excites you.
              </p>
              <h1  className="bg-red-500 hover:bg-red-600 active:scale-[0.99] p-3 rounded-2xl text-2xl" > contact@yaksera.com</h1>
              {/* <button
                onClick={() => {
                  navigate("/jobApplicationForm");
                }}
                className="w-full bg-red-500 hover:bg-red-600 active:scale-[0.99] text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-xl shadow-red-500/20"
              >
                Submit Application
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
