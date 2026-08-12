"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * Coordinates the landing entrance. `revealed` flips true the moment the intro
 * overlay splits open — the hero content, wordmark and nav all wait on it to
 * stage their own entrances. Pages without the provider default to revealed
 * (no intro), so the rest of the site behaves normally.
 */
type IntroValue = { revealed: boolean; reveal: () => void };

const IntroCtx = createContext<IntroValue>({
  revealed: true,
  reveal: () => {},
});

export const useIntro = () => useContext(IntroCtx);

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  // Stable identity — so consumers whose effects depend on `reveal` don't
  // re-run (which would restart the intro timers and replay the sequence).
  const reveal = useCallback(() => setRevealed(true), []);
  const value = useMemo(() => ({ revealed, reveal }), [revealed, reveal]);
  return <IntroCtx.Provider value={value}>{children}</IntroCtx.Provider>;
}
