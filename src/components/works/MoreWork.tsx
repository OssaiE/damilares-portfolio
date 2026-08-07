"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProjectGrid from "@/components/works/ProjectGrid";
import type { Project } from "@/lib/site";

/**
 * "More work" — one row of recommendations using the exact Works Grid view
 * (same card, same dim/desaturate/"View project" hover). No List/Zoom controls.
 * The current project is excluded upstream. Capability detection mirrors the
 * Works page so hover/cursor logic is skipped on touch + reduced-motion.
 */
export default function MoreWork({ projects }: { projects: Project[] }) {
  const [canHover, setCanHover] = useState(false);
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setCanHover(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    );
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (projects.length === 0) return null;

  return (
    <section className="px-[var(--gutter)] pb-24 pt-4">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-sans text-[15px] font-medium text-primary">
          More work
        </h2>
        <Link
          href="/works?view=grid"
          className="font-sans text-[13px] tracking-wide text-paper/80 outline-none transition-colors hover:text-primary focus-visible:text-primary"
        >
          [ See more ]
        </Link>
      </div>

      <ProjectGrid projects={projects} canHover={canHover} reduce={reduce} />
    </section>
  );
}
