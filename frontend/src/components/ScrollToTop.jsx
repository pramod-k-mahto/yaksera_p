import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Reset scroll to the top whenever the route (pathname) changes, so a new page
// never opens scrolled to where the previous page was.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
