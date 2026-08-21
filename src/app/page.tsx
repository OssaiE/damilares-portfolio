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
        className="sr-only"
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
