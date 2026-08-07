"use client";

import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import CustomCursor from "@/components/ui/CustomCursor";

/**
 * Persistent chrome: the clapperboard nav (self-contained: bar, drawer, blur
 * backdrop) and the desktop cursor. Kept as a client island so page content
 * can remain server-rendered.
 *
 * `topRight` swaps the header's top-right indicator (defaults to the
 * "Homepage." link) — e.g. the Works view switcher.
 */
export default function SiteChrome({ topRight }: { topRight?: ReactNode }) {
  return (
    <>
      <Header topRight={topRight} />
      <CustomCursor />
    </>
  );
}
