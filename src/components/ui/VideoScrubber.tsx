"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { PlayIcon, PauseIcon } from "@/components/icons";

function timecode(seconds: number) {
  if (!Number.isFinite(seconds)) seconds = 0;
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/**
 * Functional transport for a background <video>: play/pause + a seekable
 * progress bar wired to the real element. Keyboard accessible (slider role).
 */
export default function VideoScrubber({
  videoRef,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
}) {
  const [playing, setPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrent(v.currentTime);
    const onMeta = () => setDuration(v.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("durationchange", onMeta);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    if (v.duration) setDuration(v.duration);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("durationchange", onMeta);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [videoRef]);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, [videoRef]);

  const seekToClientX = useCallback(
    (clientX: number) => {
      const v = videoRef.current;
      const bar = barRef.current;
      if (!v || !bar || !duration) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      v.currentTime = ratio * duration;
      setCurrent(v.currentTime);
    },
    [videoRef, duration],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    seekToClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 1) seekToClientX(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    if (e.key === "ArrowRight") {
      v.currentTime = Math.min(duration, v.currentTime + 2);
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      v.currentTime = Math.max(0, v.currentTime - 2);
      e.preventDefault();
    } else if (e.key === " " || e.key === "Enter") {
      toggle();
      e.preventDefault();
    }
  };

  const pct = duration ? (current / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/60 text-primary transition-colors duration-300 hover:bg-primary hover:text-ink"
      >
        {playing ? (
          <PauseIcon className="h-4 w-4" />
        ) : (
          <PlayIcon className="h-4 w-4" />
        )}
      </button>

      <div
        ref={barRef}
        role="slider"
        tabIndex={0}
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(current)}
        aria-valuetext={timecode(current)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
        className="group relative h-6 flex-1 cursor-pointer touch-none select-none"
      >
        {/* track */}
        <span className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full bg-primary/25" />
        {/* fill */}
        <span
          className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-primary"
          style={{ width: `${pct}%` }}
        />
        {/* thumb */}
        <span
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(255,204,0,0.18)] transition-transform duration-150 group-hover:scale-125"
          style={{ left: `${pct}%` }}
        />
      </div>

      <span className="shrink-0 font-sans text-xs tabular-nums tracking-wide text-primary/90">
        {timecode(current)}/{timecode(duration)}
      </span>
    </div>
  );
}
