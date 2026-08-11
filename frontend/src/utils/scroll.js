// Safe, dependency-free smooth scroll to a section by id.
// Returns false (instead of throwing / warning) when the target isn't on the
// current page — this avoids react-scroll's "target Element not found" errors.
export const scrollToId = (id, offset = 85) => {
  if (typeof document === "undefined") return false;
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: "smooth" });
  return true;
};
