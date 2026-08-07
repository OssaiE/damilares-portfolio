"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CloseIcon } from "@/components/icons";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Lightbox that plays the full showreel with sound. Opened by clicking the
 * hero. Escape / backdrop / close-button dismiss it; scroll is locked while
 * open and the video is reset on close.
 */
export default function ReelModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.muted = false;
      v.volume = 1;
      v.play().catch(() => {
        // if autoplay-with-sound is blocked, fall back to muted playback
        if (v) {
          v.muted = true;
          v.play().catch(() => {});
        }
      });
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      const vid = videoRef.current;
      if (vid) {
        vid.pause();
        vid.currentTime = 0;
      }
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Showreel"
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          {/* backdrop */}
          <button
            type="button"
            aria-label="Close showreel"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-ink/85 backdrop-blur-sm"
          />

          {/* close button */}
          <motion.button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close showreel"
            className="group absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:bg-white hover:text-ink sm:right-8 sm:top-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <CloseIcon className="h-5 w-5 transition-transform duration-500 group-hover:rotate-90" />
          </motion.button>

          {/* player */}
          <motion.div
            className="relative z-[1] w-full max-w-[1200px] overflow-hidden rounded-[6px] shadow-2xl"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.5, ease }}
          >
            <video
              ref={videoRef}
              className="aspect-video w-full bg-black"
              controls
              playsInline
              preload="metadata"
              poster="/images/hero-poster.jpg"
            >
              <source src="/videos/showreel.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
