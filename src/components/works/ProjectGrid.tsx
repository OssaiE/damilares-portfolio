"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { Project } from "@/lib/site";

/**
 * Grid view — 4 / 2 / 1 columns. Hovering (or focusing) a card dims the rest,
 * desaturates the active image, and shows a yellow "View project" label that
 * tracks the cursor inside the image (static + centred for keyboard / touch).
 */
export default function ProjectGrid({
  projects,
  canHover,
  reduce,
}: {
  projects: Project[];
  canHover: boolean;
  reduce: boolean;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <ul className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {projects.map((project) => (
        <GridCard
          key={project.id}
          project={project}
          dimmed={activeId !== null && activeId !== project.id}
          canHover={canHover}
          reduce={reduce}
          onActivate={() => setActiveId(project.id)}
          onDeactivate={() =>
            setActiveId((cur) => (cur === project.id ? null : cur))
          }
        />
      ))}
    </ul>
  );
}

function GridCard({
  project,
  dimmed,
  canHover,
  reduce,
  onActivate,
  onDeactivate,
}: {
  project: Project;
  dimmed: boolean;
  canHover: boolean;
  reduce: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [viaPointer, setViaPointer] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 700, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 700, damping: 40, mass: 0.4 });

  const activate = (pointer: boolean) => {
    setActive(true);
    setViaPointer(pointer);
    onActivate();
  };
  const deactivate = () => {
    setActive(false);
    setViaPointer(false);
    onDeactivate();
  };

  const track = (e: React.PointerEvent, jump: boolean) => {
    const el = imgWrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // Clamp so the label stays inside the image bounds.
    const px = Math.min(Math.max(e.clientX - r.left, 56), r.width - 56);
    const py = Math.min(Math.max(e.clientY - r.top, 18), r.height - 18);
    x.set(px);
    y.set(py);
    // On first entry, jump the springs to the cursor (no fly-in from the corner).
    if (jump && !reduce) {
      sx.jump(px);
      sy.jump(py);
    }
  };

  const labelFollows = active && viaPointer && canHover && !reduce;

  return (
    <li
      className="transition-opacity duration-300"
      style={{ opacity: dimmed ? 0.28 : 1 }}
    >
      <Link
        href={project.href}
        className="group block focus:outline-none"
        onPointerEnter={(e) => {
          if (!canHover) return;
          track(e, true);
          activate(true);
        }}
        onPointerLeave={() => canHover && deactivate()}
        onPointerMove={(e) => canHover && track(e, false)}
        onFocus={() => activate(false)}
        onBlur={deactivate}
      >
        <div
          ref={imgWrapRef}
          className="relative aspect-[16/10] w-full overflow-hidden bg-ink ring-1 ring-white/5 group-focus-visible:ring-2 group-focus-visible:ring-primary"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.thumbnail}
            alt={`${project.title} — ${project.services}`}
            loading="lazy"
            className="h-full w-full object-cover transition-[filter,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              filter: active ? "grayscale(1)" : "grayscale(0)",
              transform: active && !reduce ? "scale(1.02)" : "scale(1)",
            }}
          />

          {/* "View project" label */}
          {active && (
            <motion.span
              className="pointer-events-none absolute z-10 whitespace-nowrap bg-primary px-2.5 py-1 text-xs font-medium text-ink"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              style={
                labelFollows
                  ? {
                      left: sx,
                      top: sy,
                      translateX: "-50%",
                      translateY: "-50%",
                    }
                  : {
                      left: "50%",
                      top: "50%",
                      translateX: "-50%",
                      translateY: "-50%",
                    }
              }
            >
              View project
            </motion.span>
          )}
        </div>

        <h3 className="mt-3 font-sans text-base font-medium text-paper">
          {project.title}
        </h3>
        <p className="mt-1 font-sans text-sm text-subtext">
          {project.services}
        </p>
      </Link>
    </li>
  );
}
