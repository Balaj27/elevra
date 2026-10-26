import Link from "next/link";
import DesktopNavigation from "./sections/DesktopNavigation";
import MobileNavigation from "./sections/MobileNavigation";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Services from "./sections/Services";
import WhyUs from "./sections/WhyUs";
import Process from "./sections/Process";
import Industries from "./sections/Industries";
import CaseStudy from "./sections/CaseStudy";
import Testimonials from "./sections/Testimonials";
import Faq from "./sections/Faq";
import Insights from "./sections/Insights";
import DesktopFooter from "./sections/DesktopFooter";
import MobileFooter from "./sections/MobileFooter";
import TabletFooter from "./sections/TabletFooter";
import SvgDefinitions from "./sections/SvgDefinitions";
export default function ElevraPage() {
  return (
    <>
      <div
        {...{
          id: "main",
          "data-framer-ssr-released-at": "2026-10-16T08:56:29.327Z",
          "data-framer-page-optimized-at": "2026-10-18T09:40:34.613Z",
          "data-framer-generated-page": "",
        }}
      >
        <div
          {...{
            className: "framer-WNeS7 framer-1n1p6tu",
            "data-layout-template": "true",
            style: { minHeight: "100vh", width: "auto" },
          }}
        >
          <div
            {...{
              "data-framer-root": "",
              className:
                "framer-7ARll framer-kLCqm framer-xuZuY framer-Huv4P framer-iYG18 framer-Wiu5a framer-72rtr7",
              style: { minHeight: "100vh", width: "auto", display: "contents" },
            }}
          >
            <div
              {...{
                className: "framer-ik9jsu-container",
                "data-framer-name": "Lenis Smooth Scroll",
                name: "Lenis Smooth Scroll",
              }}
            ></div>
            <main
              {...{ className: "framer-n20uq6", "data-framer-name": "Main" }}
            >
              <Hero />
              <About />
              <Services />
              <WhyUs />
              <Process />
              <Industries />
              <CaseStudy />
              <Testimonials />
              <Faq />
              <Insights />
            </main>
          </div>
          <div {...{ id: "overlay" }}></div>
          <div {...{ className: "framer-d4995q" }}></div>
          <div
            {...{
              className: "framer-os5ni9-container",
              "data-code-component-plugin-id": "84d4c1",
            }}
          >
            <div
              {...{
                className: "gradual-blur gradual-blur-parent ",
                style: {
                  position: "absolute",
                  pointerEvents: "none",
                  opacity: "1",
                  zIndex: "1000",
                  height: "100%",
                  width: "100%",
                  bottom: "0",
                  left: "0",
                  right: "0",
                },
              }}
            >
              <div
                {...{
                  className: "gradual-blur-inner",
                  style: {
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  },
                }}
              >
                <div
                  {...{
                    style: {
                      position: "absolute",
                      inset: "0",
                      maskImage:
                        "linear-gradient(to bottom, transparent 0%, black 20%, black 40%, transparent 60%)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, transparent 0%, black 20%, black 40%, transparent 60%)",
                      backdropFilter: "blur(0.083rem)",
                      WebkitBackdropFilter: "blur(0.083rem)",
                      opacity: "1",
                    },
                  }}
                ></div>
                <div
                  {...{
                    style: {
                      position: "absolute",
                      inset: "0",
                      maskImage:
                        "linear-gradient(to bottom, transparent 20%, black 40%, black 60%, transparent 80%)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, transparent 20%, black 40%, black 60%, transparent 80%)",
                      backdropFilter: "blur(0.166rem)",
                      WebkitBackdropFilter: "blur(0.166rem)",
                      opacity: "1",
                    },
                  }}
                ></div>
                <div
                  {...{
                    style: {
                      position: "absolute",
                      inset: "0",
                      maskImage:
                        "linear-gradient(to bottom, transparent 40%, black 60%, black 80%, transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, transparent 40%, black 60%, black 80%, transparent 100%)",
                      backdropFilter: "blur(0.377rem)",
                      WebkitBackdropFilter: "blur(0.377rem)",
                      opacity: "1",
                    },
                  }}
                ></div>
                <div
                  {...{
                    style: {
                      position: "absolute",
                      inset: "0",
                      maskImage:
                        "linear-gradient(to bottom, transparent 60%, black 80%, black 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, transparent 60%, black 80%, black 100%)",
                      backdropFilter: "blur(0.749rem)",
                      WebkitBackdropFilter: "blur(0.749rem)",
                      opacity: "1",
                    },
                  }}
                ></div>
                <div
                  {...{
                    style: {
                      position: "absolute",
                      inset: "0",
                      maskImage:
                        "linear-gradient(to bottom, transparent 80%, black 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, transparent 80%, black 100%)",
                      backdropFilter: "blur(1.000rem)",
                      WebkitBackdropFilter: "blur(1.000rem)",
                      opacity: "1",
                    },
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div
            {...{
              className: "framer-19s2tuj-container",
              "data-framer-appear-id": "19s2tuj",
              style: { opacity: "1", transform: "none" },
              "data-motion-reveal": "",
              "data-motion-y": "0",
              "data-motion-duration": "1000",
              "data-motion-delay": "800",
            }}
          >
            <div {...{ className: "ssr-variant hidden-5lzm3m hidden-1d8k2m4" }}>
              <DesktopNavigation />
            </div>
            <div {...{ className: "ssr-variant hidden-1n1p6tu" }}>
              <MobileNavigation />
            </div>
          </div>
          <div {...{ className: "framer-ke7sbv-container" }}>
            <div {...{ className: "ssr-variant hidden-5lzm3m hidden-1d8k2m4" }}>
              <DesktopFooter />
            </div>
            <div
              {...{ className: "ssr-variant hidden-1d8k2m4 hidden-1n1p6tu" }}
            >
              <MobileFooter />
            </div>
            <div {...{ className: "ssr-variant hidden-5lzm3m hidden-1n1p6tu" }}>
              <TabletFooter />
            </div>
          </div>
        </div>
        <div {...{ id: "template-overlay" }}></div>
      </div>
      <SvgDefinitions />
    </>
  );
}
