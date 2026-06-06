import { useEffect } from "react";
import { Element, scroller } from "react-scroll";

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

function Home() {

  // ✅ FIX: restore scroll after navigation
  useEffect(() => {
    const target = sessionStorage.getItem("scrollTarget");

    if (target) {
      setTimeout(() => {
        scroller.scrollTo(target, {
          smooth: true,
          duration: 500,
          offset: -85,
        });

        sessionStorage.removeItem("scrollTarget");
      }, 200);
    }
  }, []);

  return (
    <div className="bg-white">

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

          <Element name="services" className="scroll-mt-24">
            <Services />
          </Element>
        </div>
      </div>

      <Element name="portfolio" className="scroll-mt-24">
        <Portfolio />
      </Element>
            <Demo />


      <Element name="blog" className="scroll-mt-24">
        <Blog />
      </Element>

      <Element name="testimonials" className="scroll-mt-24">
        <Testimonials />
      </Element>

      <TStack />
      <GlobalDelivery />
      <FAQ />
      <ExpertiseAreas />

      <Element name="process" className="scroll-mt-24">
        <Process />
      </Element>

      <Call />
    </div>
  );
}

export default Home;