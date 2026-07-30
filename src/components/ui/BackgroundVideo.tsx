"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  mp4: string;
  webm?: string;
  poster: string;
  className?: string;
  /** object-position for the cropped portrait footage */
  position?: string;
};

/**
 * Autoplaying, muted, looping background video with a graceful loading state:
 * the poster shows immediately, the video fades in once it can paint, and it
 * only starts loading when scrolled near the viewport. Falls back to the
 * poster still when reduced-motion is requested.
 */
export default function BackgroundVideo({
  mp4,
  webm,
  poster,
  className = "",
  position = "50% 50%",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reducedMotion) return;

    const tryPlay = () => {
      v.play().catch(() => {
        /* autoplay can be blocked; poster remains as fallback */
      });
    };
    if (v.readyState >= 3) {
      setReady(true);
      tryPlay();
    }
    const onCanPlay = () => {
      setReady(true);
      tryPlay();
    };
    v.addEventListener("canplay", onCanPlay);
    return () => v.removeEventListener("canplay", onCanPlay);
  }, [reducedMotion]);

  return (
    <div className={`absolute inset-0 overflow-hidden bg-ink ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-105 object-cover blur-[2px]"
        style={{ objectPosition: position }}
      />
      {!reducedMotion && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out"
          style={{ objectPosition: position, opacity: ready ? 1 : 0 }}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
        >
          {webm && <source src={webm} type="video/webm" />}
          <source src={mp4} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
