"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SiteChrome from "@/components/SiteChrome";
import Footer from "@/components/layout/Footer";
import GridBackdrop from "@/components/works/GridBackdrop";
import WorksViewSwitcher, {
  type WorksView,
} from "@/components/works/WorksViewSwitcher";
import ProjectGrid from "@/components/works/ProjectGrid";
import ProjectList from "@/components/works/ProjectList";
import ProjectZoom from "@/components/works/ProjectZoom";
import { projects } from "@/lib/site";

/**
 * Works page shell. The active view is read from the URL on the server and
 * passed in as `view` (deep-linkable, back/forward-friendly). Switching is a
 * soft navigation via router.push (no reload, no scroll) which re-renders the
 * server page with the new view.
 */
export default function WorksExperience({ view }: { view: WorksView }) {
  const router = useRouter();

  // Capability detection (avoid hover/cursor logic on touch, honour reduced motion).
  const [canHover, setCanHover] = useState(false);
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setCanHover(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    );
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const setView = (v: WorksView) => {
    router.push(`/works?view=${v}`, { scroll: false });
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      <SiteChrome
        topRight={<WorksViewSwitcher view={view} onChange={setView} />}
      />

      {/* One continuous grid behind the whole page (main + footer). The main
          and footer are transparent so the single grid reads as one, with no
          seam between the content and the footer. */}
      <div className="relative bg-ink">
        <GridBackdrop />

        <main
          id="main"
          className="relative z-10 min-h-screen pb-24 pt-[150px] md:pt-[200px]"
        >
          {view === "grid" && (
            <div className="px-[var(--gutter)]">
              <ProjectGrid
                projects={projects}
                canHover={canHover}
                reduce={reduce}
              />
            </div>
          )}
          {view === "list" && (
            <ProjectList
              projects={projects}
              canHover={canHover}
              reduce={reduce}
            />
          )}
          {view === "zoom" && (
            <div className="px-[var(--gutter)]">
              <ProjectZoom
                projects={projects}
                canHover={canHover}
                reduce={reduce}
              />
            </div>
          )}
        </main>

        <div className="relative z-10">
          <Footer transparent />
        </div>
      </div>
    </>
  );
}
