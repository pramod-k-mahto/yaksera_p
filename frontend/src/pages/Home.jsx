import { useEffect } from "react";
import { Element } from "react-scroll";
import { scrollToId } from "../utils/scroll";

import FAQ from "./FAQ";
import Call from "./Call";
import TStack from "./TStack";
import Services from "./Services";
import Portfolio from "./Portfolio";
import Blog from "./Blog";
import Testimonials from "./Testimonials";
import ExpertiseAreas from "./ExpertiseAreas";
import Process from "./Process";
import GlobalDelivery from "./GlobalDelivery";
import Hero from "../components/Hero";
import RotateLeft from "../components/RotateLeft";
import WhyYaksera from "./WhyYaksera";
import Demo from "./Demo";
import YakseraIntro from "../components/YakseraIntro";

function Home() {

  // ✅ FIX: restore scroll after navigation, retrying until the section mounts
  // (sections below the fold render their data asynchronously).
  useEffect(() => {
    const target = sessionStorage.getItem("scrollTarget");
    if (!target) return;

    let attempts = 0;
    const tryScroll = () => {
      attempts += 1;
      if (scrollToId(target) || attempts >= 20) {
        sessionStorage.removeItem("scrollTarget");
        return;
      }
      setTimeout(tryScroll, 150);
    };

    const t = setTimeout(tryScroll, 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-white">

      {/* Premium fullscreen entrance animation — overlays this page
          temporarily, then reveals the existing homepage underneath.
          The homepage below renders immediately (not gated on the intro). */}
      <YakseraIntro />

      {/* HERO */}
      <div className="relative isolate overflow-hidden">

        <div className="absolute top-[-120px] left-[-520px] z-0 hidden opacity-40 pointer-events-none lg:block">
          <RotateLeft />
        </div>

        <div className="absolute top-[-120px] right-[-520px] z-0 hidden opacity-40 pointer-events-none lg:block">
          <RotateLeft />
        </div>

        <div className="relative z-20">
          <Hero />
          <WhyYaksera />

          <Element id="services" name="services" className="scroll-mt-24">
            <Services />
          </Element>
        </div>
      </div>

      <Element id="portfolio" name="portfolio" className="scroll-mt-24">
        <Portfolio />
      </Element>
            <Demo />


      <Element id="blog" name="blog" className="scroll-mt-24">
        <Blog />
      </Element>

      <Element id="testimonials" name="testimonials" className="scroll-mt-24">
        <Testimonials />
      </Element>

      <TStack />
      <GlobalDelivery />
      <FAQ />
      <ExpertiseAreas />

      <Element id="process" name="process" className="scroll-mt-24">
        <Process />
      </Element>

      <Call />
    </div>
  );
}

export default Home;