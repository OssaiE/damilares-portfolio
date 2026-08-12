import SiteChrome from "@/components/SiteChrome";
import SectionScroller from "@/components/SectionScroller";
import Hero from "@/components/sections/Hero";
import FeaturedWorks from "@/components/sections/FeaturedWorks";
import Footer from "@/components/layout/Footer";
import { IntroProvider } from "@/components/intro/IntroContext";
import IntroSequence from "@/components/intro/IntroSequence";

export default function Home() {
  return (
    <IntroProvider>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      <IntroSequence />
      <SiteChrome />
      <SectionScroller />

      <main id="main">
        <Hero />
        <div id="work">
          <FeaturedWorks />
        </div>
      </main>

      <Footer />
    </IntroProvider>
  );
}
