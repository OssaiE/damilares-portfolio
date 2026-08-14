"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import ClapperMenuIcon from "@/components/ui/ClapperMenuIcon";
import CameraViewfinder from "@/components/ui/CameraViewfinder";
import { nav, socials } from "@/lib/site";
import { playClap } from "@/lib/clap";

/** The clapperboard bend, in degrees (hinged at the bar's bottom-left). */
const BEND = -2.78;

const barSpring = { type: "spring", stiffness: 300, damping: 18 } as const;
const drawerSpring = { type: "spring", stiffness: 260, damping: 26 } as const;

export default function Header({ topRight }: { topRight?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = useCallback(() => {
    setOpen((wasOpen) => {
      if (wasOpen) playClap(); // clap only on the shut ("Action!")
      return false;
    });
  }, []);

  // Escape + scroll lock while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      {/* Blurred backdrop */}
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={close}
            className="fixed inset-0 z-40 cursor-default bg-ink/45 backdrop-blur-[20px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Camera viewfinder — above the blur, below the menu */}
      <AnimatePresence>
        {open && <CameraViewfinder key="viewfinder" />}
      </AnimatePresence>

      <motion.header
        className="fixed left-[var(--gutter)] top-5 z-50 md:top-6"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative w-[290px] max-w-[calc(100vw-3rem)]">
          {/* Drawer (behind the bar) */}
          <AnimatePresence>
            {open && (
              <motion.div
                id="clapper-drawer"
                role="menu"
                aria-label="Main menu"
                className="absolute inset-x-0 top-[calc(100%+10px)] origin-top overflow-hidden rounded-[4px] bg-primary px-5 pb-4 pt-5 text-ink"
                initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0.4, y: -8 }}
                animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1, y: 0 }}
                exit={{ clipPath: "inset(0 0 100% 0)", opacity: 0.2, y: -8 }}
                transition={drawerSpring}
              >
                <ul className="space-y-1.5">
                  {nav.map((item, i) => {
                    const active = pathname === item.href;
                    return (
                      <motion.li
                        key={item.href}
                        role="none"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 26,
                          delay: 0.06 + i * 0.05,
                        }}
                      >
                        <Link
                          href={item.href}
                          role="menuitem"
                          onClick={close}
                          className="group inline-flex items-center gap-1.5 font-sans text-2xl font-medium leading-tight tracking-tight"
                          aria-current={active ? "page" : undefined}
                        >
                          <span className="text-ink/45">[</span>
                          <span
                            className={`relative ${active ? "" : "text-ink/75 transition-colors duration-300 group-hover:text-ink"}`}
                          >
                            {item.label}
                            <span
                              className={`absolute -bottom-0.5 left-0 h-[2px] bg-ink transition-[width] duration-300 ease-out ${
                                active ? "w-full" : "w-0 group-hover:w-full"
                              }`}
                            />
                          </span>
                          <span className="text-ink/45">]</span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>

                <div className="mt-5 border-t border-ink/15 pt-4">
                  <ul className="flex items-center gap-[16px]">
                    {socials.map((s) => (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={s.label}
                          className="block opacity-70 transition-opacity duration-300 hover:opacity-100"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={s.icon}
                            alt=""
                            width={14}
                            height={14}
                            className="h-[14px] w-[14px]"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bar (the clap stick — bends open, snaps shut) */}
          <motion.div
            className="relative z-10 flex h-14 items-center justify-between rounded-[4px] bg-primary pl-4 pr-4 text-ink"
            style={{ transformOrigin: "0% 100%" }}
            animate={{ rotate: open ? BEND : 0 }}
            transition={barSpring}
          >
            <button
              type="button"
              onClick={() => (open ? close() : setOpen(true))}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="clapper-drawer"
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-300 hover:bg-ink/10"
            >
              <ClapperMenuIcon open={open} />
            </button>

            <Link
              href="/"
              onClick={close}
              aria-label="AreyouDami. home"
              className="flex items-center pr-1 transition-opacity duration-300 hover:opacity-70"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="AreyouDami."
                width={108}
                height={20}
                className="h-[19px] w-auto"
              />
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* Top-right slot: page view switcher, or the default Homepage indicator.
          Hidden while the menu is open. */}
      <motion.div
        className="fixed right-[var(--gutter)] top-5 z-50 hidden sm:block md:top-6"
        animate={{ opacity: open ? 0 : 1, y: open ? -6 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden={open}
      >
        {topRight ?? (
          <Link
            href="/"
            className="group relative inline-flex h-14 items-center text-base font-medium text-primary"
            tabIndex={open ? -1 : 0}
          >
            Homepage.
            <span className="absolute bottom-4 left-0 h-px w-full origin-right scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100" />
          </Link>
        )}
      </motion.div>
    </>
  );
}
