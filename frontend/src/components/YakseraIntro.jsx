import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import logo from "../assets/logo.png";

/**
 * YakseraIntro
 * -------------------------------------------------------------------------
 * Premium fullscreen entrance animation that sits ABOVE the already-rendered
 * homepage and then reveals it. It does not modify any existing site element.
 *
 * Sequence: logo -> first large photo -> 10 photos stack in the center ->
 * big center zoom (~92-96vh) -> cinematic hold -> explosive outward spread
 * (main photo stays exactly centered) -> hold -> photos fade outward ->
 * existing homepage revealed underneath.
 *
 * Plays once per browser session. Flip ALWAYS_PLAY_INTRO to true while
 * developing to replay on every load. Set it back to false before deploying.
 */

// ---- DEV ONLY: force the intro to play on every load ---------------------
const ALWAYS_PLAY_INTRO = false; // TODO: keep false for production
// --------------------------------------------------------------------------

const SESSION_KEY = "yakseraIntroPlayed";

// Yaksera dark navy (matches the existing header / brand background).
const NAVY = "#0d275c";

// 10 real project screenshots. Each card takes its image's own aspect ratio
// so the FULL screenshot is always visible — never cropped. Drop your own
// images into public/images/intro/ (01.jpg .. 10.jpg); if an image has a
// very different shape, update its `ar` (width / height) here.
const introImages = [
  { src: "/images/intro/01.jpg", ar: 1600 / 768 },
  { src: "/images/intro/02.jpg", ar: 1600 / 761 },
  { src: "/images/intro/03.jpg", ar: 1600 / 764 },
  { src: "/images/intro/04.jpg", ar: 1448 / 1086 },
  { src: "/images/intro/05.jpg", ar: 1600 / 762 },
  { src: "/images/intro/06.jpg", ar: 1448 / 1086 },
  { src: "/images/intro/07.jpg", ar: 1600 / 765 },
  { src: "/images/intro/08.jpg", ar: 1448 / 1086 },
  { src: "/images/intro/09.jpg", ar: 1600 / 758 },
  { src: "/images/intro/10.jpg", ar: 1448 / 1086 },
];

// The top/main photograph that stays perfectly centered during the BOOM.
const MAIN_INDEX = introImages.length - 1; // last one stacked = on top

// Tiny, deterministic per-photo variation for the CENTRAL STACK phase.
// (small x/y/rotation/scale so the stack feels hand-placed, not a rigid pile)
const stackVariation = [
  { x: 0, y: 0, rot: 0.0, s: 1.0 },
  { x: -14, y: 8, rot: -2.4, s: 0.99 },
  { x: 16, y: -6, rot: 2.0, s: 1.0 },
  { x: -8, y: -12, rot: -1.4, s: 0.985 },
  { x: 12, y: 12, rot: 1.8, s: 1.0 },
  { x: -18, y: -4, rot: -2.8, s: 0.99 },
  { x: 10, y: -10, rot: 1.2, s: 0.995 },
  { x: -6, y: 14, rot: -1.0, s: 1.0 },
  { x: 18, y: 4, rot: 2.6, s: 0.99 },
  { x: 0, y: 0, rot: 0.0, s: 1.0 }, // main photo — dead center
];

// Small deterministic rotations for the surrounding cards after the BOOM
// (editorial feel — the positions themselves stay mathematically balanced).
const explodeRot = [-8, 6, -5, 9, -7, 5, -9, 7, -6];

// Number of vertical navy bars that make up the backdrop and then slide open
// (alternating up/down) to reveal the homepage as the final transition.
const NBARS = 8;

export default function YakseraIntro() {
  // Decide up-front (before first paint) whether the intro should run at all.
  const [shouldPlay] = useState(() => {
    if (typeof window === "undefined") return false;
    if (ALWAYS_PLAY_INTRO) return true;
    try {
      return sessionStorage.getItem(SESSION_KEY) !== "true";
    } catch {
      return true;
    }
  });

  const [done, setDone] = useState(!shouldPlay);

  const rootRef = useRef(null);
  const logoRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const barsWrapRef = useRef(null);
  const barRefs = useRef([]);

  const finish = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      /* ignore storage errors (private mode etc.) */
    }
    document.body.style.overflow = "";
    setDone(true);
  };

  // Lock body scroll only while the intro is active.
  useEffect(() => {
    if (done) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [done]);

  useLayoutEffect(() => {
    if (done) return;

    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    // Hard safety net: whatever happens (an error building the timeline, a
    // tab left in the background, an animation that never reports complete),
    // the intro must never permanently block the website.
    const watchdog = setTimeout(finish, 14000);

    // ---- Preload logo + all photos, with a safety timeout so a slow image
    // ---- can never permanently block the site. --------------------------
    let cancelled = false;
    const preload = (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = img.onerror = () => resolve();
        img.src = src;
      });

    const assetsReady = Promise.all(
      [logo, ...introImages.map((i) => i.src)].map(preload)
    );
    const timeout = new Promise((resolve) => setTimeout(resolve, 2500));

    let ctx;
    let mm;

    Promise.race([assetsReady, timeout]).then(() => {
      if (cancelled || !rootRef.current) return;

      // ---- Reduced motion: quick logo fade, then reveal. No explosion. ----
      if (reduced) {
        ctx = gsap.context(() => {
          const tl = gsap.timeline({ onComplete: finish });
          tl.set(cardRefs.current, { autoAlpha: 0 });
          gsap.set(logoRef.current, { xPercent: -50, yPercent: -50 });
          tl.fromTo(
            logoRef.current,
            { autoAlpha: 0, scale: 0.9 },
            { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out" }
          )
            .to(logoRef.current, { autoAlpha: 0, duration: 0.35 }, "+=0.25")
            // Bars slide open (quick) to reveal the homepage.
            .to(
              barRefs.current,
              {
                yPercent: (i) => (i % 2 === 0 ? -100 : 100),
                duration: 0.5,
                ease: "power3.inOut",
                stagger: { each: 0.03, from: "center" },
              },
              "-=0.05"
            );
        }, rootRef);
        return;
      }

      // ---- Full cinematic sequence, responsive via matchMedia. ------------
      ctx = gsap.context(() => {
        mm = gsap.matchMedia();

        const build = (cfg) => () => {
          const cards = cardRefs.current;
          const vw = window.innerWidth;
          const vh = window.innerHeight;

          const surrounding = cards.filter((_, i) => i !== MAIN_INDEX);

          // Center of gravity is enforced by center-anchoring every card
          // (xPercent/yPercent -50) and spreading on an ellipse whose points
          // are evenly spaced — so the composition can never drift right.
          const explodeTargets = (radiusScale = 1, fade = false) => {
            let s = 0;
            return surrounding.map((el) => {
              const angle = (-90 + s * (360 / surrounding.length)) * (Math.PI / 180);
              const pos = {
                el,
                x: Math.cos(angle) * vw * cfg.rx * radiusScale,
                y: Math.sin(angle) * vh * cfg.ry * radiusScale,
                rot: explodeRot[s % explodeRot.length],
                fade,
              };
              s += 1;
              return pos;
            });
          };

          // Base state: everything center-anchored, hidden.
          gsap.set(cards, {
            xPercent: -50,
            yPercent: -50,
            x: 0,
            y: 0,
            rotation: 0,
            autoAlpha: 0,
            scale: cfg.stack,
            force3D: true,
            willChange: "transform, opacity",
          });
          gsap.set(logoRef.current, {
            xPercent: -50,
            yPercent: -50,
            autoAlpha: 0,
            scale: 0.72,
            filter: "blur(8px)",
          });

          const tl = gsap.timeline({ onComplete: finish });

          // 1) LOGO — opacity/scale/blur in, brief hold, fade out.
          tl.to(
            logoRef.current,
            { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "power2.out" },
            0.3
          ).to(logoRef.current, { autoAlpha: 0, duration: 0.3, ease: "power1.inOut" }, 1.5);

          // 2) FIRST PHOTO already large, dead center.
          tl.set(cards[0], { zIndex: 10 }, 1.8).to(
            cards[0],
            {
              autoAlpha: 1,
              scale: cfg.stack * stackVariation[0].s,
              duration: 0.5,
              ease: "power2.out",
            },
            1.8
          );

          // 3) STACK the remaining photos into ONE central pile (staggered).
          cards.forEach((el, i) => {
            if (i === 0) return;
            const v = stackVariation[i] || { x: 0, y: 0, rot: 0, s: 1 };
            const t = 1.9 + i * cfg.stagger;
            gsap.set(el, { zIndex: 10 + i });
            tl.fromTo(
              el,
              { autoAlpha: 0, x: v.x * 1.6, y: v.y * 1.6 - 30, rotation: v.rot, scale: cfg.stack * 0.94 },
              {
                autoAlpha: 1,
                x: v.x,
                y: v.y,
                rotation: v.rot,
                scale: cfg.stack * v.s,
                duration: 0.5,
                ease: "power3.out",
              },
              t
            );
          });

          const stackEnd = 1.9 + cards.length * cfg.stagger + 0.5; // ~3.0s

          // Main photo owns the top of the stack (and stays on top forever).
          tl.set(cards[MAIN_INDEX], { zIndex: 80 }, stackEnd - 0.05);

          // 4) BIG CENTER ZOOM — the whole stack grows toward the viewer.
          //    Each card is center-anchored so the stack stays centered.
          tl.to(
            cards,
            {
              scale: cfg.zoom,
              x: 0,
              y: 0,
              rotation: 0,
              duration: 1.7,
              ease: "power4.inOut",
            },
            stackEnd + 0.05
          );

          const zoomEnd = stackEnd + 0.05 + 1.7; // ~4.75s

          // 5) HOLD the large centered stack (this pause matters).
          //    -> handled by the gap before the BOOM below.

          // 6) BOOM — surrounding photos explode outward; main stays put.
          const boomAt = zoomEnd + 0.45; // brief hold before the boom
          explodeTargets(1, false).forEach((p) => {
            tl.to(
              p.el,
              {
                x: p.x,
                y: p.y,
                rotation: p.rot,
                scale: cfg.surround,
                autoAlpha: 1,
                duration: 1.1,
                ease: "expo.out",
              },
              boomAt
            );
          });
          // Main photograph: recedes to a comfortable size but stays exactly
          // centered and on top, leaving room for the scattered cards.
          tl.to(
            cards[MAIN_INDEX],
            { x: 0, y: 0, rotation: 0, scale: cfg.mainBoom, duration: 1.1, ease: "expo.out" },
            boomAt
          );

          const boomEnd = boomAt + 1.1; // ~6.75s
          const holdEnd = boomEnd + 0.2; // brief beat — then exit quickly

          // 7) EXIT — surrounding photos keep moving out and fade (quick).
          explodeTargets(1.7, true).forEach((p) => {
            tl.to(
              p.el,
              { x: p.x, y: p.y, autoAlpha: 0, duration: 0.55, ease: "power2.in" },
              holdEnd
            );
          });

          // 8) Center photo exits quickly — no long linger.
          tl.to(
            cards[MAIN_INDEX],
            { scale: cfg.mainBoom * 1.08, autoAlpha: 0, x: 0, y: 0, duration: 0.45, ease: "power2.in" },
            holdEnd + 0.05
          );

          // 9) OPEN-BAR REVEAL — the navy backdrop is built from vertical bars;
          //    they slide open (alternating up / down, from the center outward)
          //    to unveil the existing homepage underneath.
          tl.to(
            barRefs.current,
            {
              yPercent: (i) => (i % 2 === 0 ? -100 : 100),
              duration: 0.75,
              ease: "power4.inOut",
              stagger: { each: 0.05, from: "center" },
            },
            holdEnd + 0.4
          );
        };

        // Dedicated configuration per breakpoint (no plain "scale it down").
        //  stack  = size of the central stack (first-large / stacked phase)
        //  zoom   = "almost full screen" moment before the boom
        //  mainBoom = size the main card settles to during the explosion
        //  surround = size of the 9 scattered cards
        //  rx / ry = how far the scattered cards travel from the center
        mm.add("(min-width: 1440px)", build({ stack: 0.72, zoom: 1.0, mainBoom: 0.6, surround: 0.3, rx: 0.38, ry: 0.37, stagger: 0.12 }));
        mm.add("(min-width: 1024px) and (max-width: 1439px)", build({ stack: 0.72, zoom: 1.0, mainBoom: 0.58, surround: 0.3, rx: 0.38, ry: 0.36, stagger: 0.12 }));
        mm.add("(min-width: 768px) and (max-width: 1023px)", build({ stack: 0.72, zoom: 1.0, mainBoom: 0.58, surround: 0.32, rx: 0.37, ry: 0.36, stagger: 0.13 }));
        mm.add("(max-width: 767px) and (orientation: portrait)", build({ stack: 0.74, zoom: 1.0, mainBoom: 0.6, surround: 0.34, rx: 0.4, ry: 0.3, stagger: 0.11 }));
        mm.add("(max-width: 900px) and (orientation: landscape)", build({ stack: 0.7, zoom: 1.0, mainBoom: 0.55, surround: 0.3, rx: 0.42, ry: 0.4, stagger: 0.11 }));
      }, rootRef);
    });

    return () => {
      cancelled = true;
      clearTimeout(watchdog);
      ctx?.revert();
      mm?.revert();
    };
  }, [done]);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        zIndex: 9999,
        background: "transparent",
      }}
    >
      {/* OPEN-BAR BACKDROP — vertical navy bars that cover the homepage during
          the intro, then slide open (alternating up / down) as the final
          reveal. They form the solid navy background for the whole sequence. */}
      <div
        ref={barsWrapRef}
        style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}
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

      {/* Yaksera logo — the real asset, never cropped. Hidden from the very
          first frame (opacity 0 + visibility hidden) so it can't flash before
          GSAP takes over; GSAP owns the centering via xPercent/yPercent. */}
      <img
        ref={logoRef}
        src={logo}
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "min(46vw, 320px)",
          maxWidth: "80vw",
          height: "auto",
          objectFit: "contain",
          pointerEvents: "none",
          userSelect: "none",
          opacity: 0,
          visibility: "hidden",
          zIndex: 100,
        }}
      />

      {/* The photo stage — every card is center-anchored. */}
      <div
        ref={stageRef}
        style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}
      >
        {introImages.map((img, i) => (
          <div
            key={img.src}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="yaksera-intro-card"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              // Card takes the image's OWN aspect ratio and is capped so it
              // fits the viewport at full zoom — the whole screenshot shows,
              // never cropped. Stack/explosion use GSAP scale on top.
              width: `min(90vw, ${(88 * img.ar).toFixed(1)}vh)`,
              aspectRatio: `${img.ar}`,
              transformOrigin: "center center",
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
              border: "1px solid rgba(212,175,110,0.18)",
              backfaceVisibility: "hidden",
              opacity: 0,
            }}
          >
            <img
              src={img.src}
              alt=""
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                filter: "none",
                backfaceVisibility: "hidden",
                transform: "translateZ(0)",
                userSelect: "none",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
