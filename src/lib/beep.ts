/**
 * A short synthesized "beep" — a camera/recording start tone. A clean sine
 * blip with a quick attack + decay. No audio asset required. Silent for
 * reduced-motion users and safely no-ops if Web Audio is unavailable, blocked,
 * or still suspended by the browser's autoplay policy (no user gesture yet).
 */
let ctx: AudioContext | null = null;

export function playBeep(freq = 1046, volume = 0.14) {
  if (typeof window === "undefined") return;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return;
    ctx = ctx ?? new AC();
    if (ctx.state === "suspended") void ctx.resume();

    const now = ctx.currentTime;
    const dur = 0.13;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    const gain = ctx.createGain();
    // Quick attack so it reads as a crisp blip, then a fast exponential decay.
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + dur);
  } catch {
    /* audio not available — ignore */
  }
}
