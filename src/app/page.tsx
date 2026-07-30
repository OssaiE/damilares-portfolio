import SiteChrome from "@/components/SiteChrome";
import Hero from "@/components/sections/Hero";
import FeaturedWorks from "@/components/sections/FeaturedWorks";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      <SiteChrome />

      <main id="main">
        <Hero />
        <div id="work">
          <FeaturedWorks />
        </div>
      </main>

      <Footer />
    </>
  );
}
