import { YouTubeIcon } from "@/components/icons";
import type { Project } from "@/lib/site";

/**
 * Full-bleed project hero. The image stays dominant under a soft top/bottom
 * scrim (keeps the fixed header + title/CTA legible). Title sits bottom-left,
 * the YouTube CTA bottom-right — they share one flex row so they never overlap.
 * Fixed height ⇒ no layout shift; the image is eager/high-priority.
 */
export default function ProjectHero({ project }: { project: Project }) {
  return (
    <section className="relative h-[88svh] min-h-[560px] w-full overflow-hidden bg-ink">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.heroImage}
        alt={`${project.title} — film still`}
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "50% 35%" }}
      />

      {/* Scrim: darker top (header) and bottom (title/CTA), image visible mid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/55 via-transparent to-ink/90"
      />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-[var(--gutter)] pb-10 md:pb-14">
        <h1 className="max-w-[80%] font-sans text-[clamp(2.25rem,7vw,96px)] font-extrabold leading-[0.95] tracking-[-0.02em] text-primary [text-wrap:balance]">
          {project.title}
        </h1>

        {project.youtubeUrl && (
          <a
            href={project.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${project.title} on YouTube`}
            className="group inline-flex shrink-0 items-center gap-2 rounded-[3px] bg-primary px-4 py-2.5 text-[13px] font-semibold text-ink outline-none ring-primary transition-[background-color,color,transform] duration-300 hover:-translate-y-px hover:bg-ink hover:text-primary hover:ring-1 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Watch on YouTube
            <YouTubeIcon className="h-4 w-4" />
          </a>
        )}
      </div>
    </section>
  );
}
