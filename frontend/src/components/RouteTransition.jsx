import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

/**
 * RouteTransition
 * -------------------------------------------------------------------------
 * Plays the same "open-bar" reveal (as the YakseraIntro) on every page
 * navigation. On a route change it covers the screen with vertical navy bars
 * BEFORE the browser paints the new page (so there is no flash of the new
 * content), then slides the bars open — alternating up / down, from the center
 * outward — to unveil the new page.
 *
 * Notes:
 *  - Only fires on pathname changes, so the header's scroll-to-section menu
 *    items (Services, Portfolio, …) — which stay on the home page — are not
 *    affected. Real page links (About, Contact, Login, Case Studies, …) are.
 *  - Skips the very first paint; the initial entrance is owned by YakseraIntro.
 *  - pointer-events: none, so it never blocks interaction during the reveal.
 */

// Yaksera dark navy (matches the header / brand background & the intro bars).
const NAVY = "#0d275c";

// Number of vertical bars. Match YakseraIntro for a consistent feel.
const NBARS = 8;

export default function RouteTransition() {
  const { pathname } = useLocation();
  const wrapRef = useRef(null);
  const barRefs = useRef([]);
  const firstRender = useRef(true);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const bars = barRefs.current;
    if (!wrap) return;

    // Don't transition on the initial load — YakseraIntro handles that.
    if (firstRender.current) {
      firstRender.current = false;
      gsap.set(wrap, { autoAlpha: 0 });
      gsap.set(bars, { yPercent: 0 });
      return;
    }

    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    // Cover the screen synchronously (this layout effect runs before the
    // browser paints), so the freshly rendered page never flashes uncovered.
    gsap.set(wrap, { autoAlpha: 1 });
    gsap.set(bars, { yPercent: 0 });

    // Hide the overlay again once the reveal finishes.
    const tl = gsap.timeline({
      onComplete: () => gsap.set(wrap, { autoAlpha: 0 }),
    });

    if (reduced) {
      // Reduced motion: a quick fade instead of the sliding bars.
      tl.to(wrap, { autoAlpha: 0, duration: 0.3, ease: "power2.out" }, 0.05);
    } else {
      tl.to(
        bars,
        {
          yPercent: (i) => (i % 2 === 0 ? -100 : 100),
          duration: 0.6,
          ease: "power4.inOut",
          stagger: { each: 0.04, from: "center" },
        },
        0.05
      );
    }

    return () => tl.kill();
  }, [pathname]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998, // just below YakseraIntro (9999)
        pointerEvents: "none",
        opacity: 0,
        visibility: "hidden",
      }}
    >
      {Array.from({ length: NBARS }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            barRefs.current[i] = el;
          }}
          style={{
            position: "absolute",
            top: "-2px",
            height: "calc(100% + 4px)",
            // +1px width overlap hides sub-pixel seams between adjacent bars.
            width: `calc(100% / ${NBARS} + 1px)`,
            left: `calc(${i} * 100% / ${NBARS})`,
            background: NAVY,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
