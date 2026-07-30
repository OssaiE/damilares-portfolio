"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import VideoScrubber from "@/components/ui/VideoScrubber";
import { featuredWorks } from "@/lib/site";

const easeExpo = [0.16, 1, 0.3, 1] as const;

export default function FeaturedWorks() {
  const work = featuredWorks[0];
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.4 });
  const [ready, setReady] = useState(false);

  // Fade the footage in once it can paint.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onCanPlay = () => setReady(true);
    if (v.readyState >= 3) setReady(true);
    v.addEventListener("canplay", onCanPlay);
    return () => v.removeEventListener("canplay", onCanPlay);
  }, []);

  // Only run the clip while it's on screen (perf + battery).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else if (!v.paused) v.pause();
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      aria-label="Featured work"
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-ink"
    >
      {/* Footage */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out"
        style={{ opacity: ready ? 1 : 0, objectPosition: "50% 45%" }}
        poster={work.poster}
        muted
        loop
        playsInline
        preload="none"
      >
        {work.video?.webm && <source src={work.video.webm} type="video/webm" />}
        {work.video && <source src={work.video.mp4} type="video/mp4" />}
      </video>

      {/* Ember grade to sit the footage in the Palmwine palette */}
      <div className="grade-ember pointer-events-none absolute inset-0 z-[1]" />
      <div className="vignette pointer-events-none absolute inset-0 z-[2]" />
      <div className="grain pointer-events-none absolute inset-0 z-[3] opacity-[0.1]" />

      {/* Content */}
      <div className="relative z-20 flex h-full flex-col justify-end px-[var(--gutter)] pb-6 md:pb-8">
        <div className="flex items-end gap-5">
          {/* Left perforation rail */}
          <div
            aria-hidden
            className="mb-2 hidden flex-col items-center gap-2 self-stretch pb-24 md:flex"
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full border border-primary/50"
              />
            ))}
          </div>

          <div className="w-full">
            {/* Category tag */}
            <motion.span
              className="u-label inline-block rounded-[5px] border border-primary/70 px-2.5 py-1 text-primary"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: easeExpo }}
            >
              {work.category}
            </motion.span>

            {/* Title */}
            <div className="mt-4 overflow-hidden">
              <motion.h2
                className="font-display text-[8.5vw] font-bold uppercase leading-[0.94] tracking-[-0.03em] text-primary md:text-[9vw] lg:text-[7.5vw]"
                initial={{ y: "108%" }}
                animate={inView ? { y: "0%" } : {}}
                transition={{ duration: 0.9, ease: easeExpo }}
              >
                {work.title.split(" ").map((word, i) => (
                  <span key={i} className="block">
                    {word}
                  </span>
                ))}
              </motion.h2>
            </div>

            {/* Year */}
            <motion.p
              className="mt-4 font-sans text-sm font-semibold tabular-nums text-primary"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.25, ease: easeExpo }}
            >
              {work.year}
            </motion.p>

            {/* Transport */}
            <motion.div
              className="mt-6 max-w-2xl"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.35, ease: easeExpo }}
            >
              <VideoScrubber videoRef={videoRef} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
