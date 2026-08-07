import Link from "next/link";
import SiteChrome from "@/components/SiteChrome";
import Footer from "@/components/layout/Footer";
import GridBackdrop from "@/components/works/GridBackdrop";
import ProjectHero from "@/components/works/ProjectHero";
import ProjectMeta from "@/components/works/ProjectMeta";
import MoreWork from "@/components/works/MoreWork";
import { projects, type Project } from "@/lib/site";

/**
 * Project detail page shell. Reuses the shared header (fixed, floats over the
 * hero), footer and background grid. Below the hero, one continuous grid runs
 * behind the metadata, "More work" and footer (all transparent) so there's no
 * seam — matching the Works page. The hero image sits above the grid.
 */
export default function ProjectDetail({ project }: { project: Project }) {
  // One row of recommendations, current project excluded (no placeholders).
  const moreProjects = projects
    .filter((p) => p.id !== project.id)
    .slice(0, 4);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      <SiteChrome
        topRight={
          <Link
            href="/works?view=grid"
            className="group relative inline-flex h-14 items-center text-[15px] font-medium text-primary"
          >
            Works.
            <span className="absolute bottom-4 left-0 h-px w-full origin-right scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100" />
          </Link>
        }
      />

      <div className="relative bg-ink">
        {/* Continuous grid — hidden behind the opaque hero, shows through the
            transparent metadata / more-work / footer below it. */}
        <GridBackdrop />

        <main id="main" className="relative z-10">
          <ProjectHero project={project} />
          <ProjectMeta project={project} />
          <MoreWork projects={moreProjects} />
        </main>

        <div className="relative z-10">
          <Footer transparent />
        </div>
      </div>
    </>
  );
}
