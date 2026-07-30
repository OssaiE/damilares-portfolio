/**
 * A short, synthesized "clap" for the clapperboard closing — a filtered noise
 * burst with a fast decay. No audio asset required. Silent for reduced-motion
 * users and safely no-ops if Web Audio is unavailable or blocked.
 */
let ctx: AudioContext | null = null;

export function playClap(volume = 0.16) {
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
    const dur = 0.12;

    // Noise burst with a fast-decaying envelope
    const buffer = ctx.createBuffer(
      1,
      Math.floor(ctx.sampleRate * dur),
      ctx.sampleRate,
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3);
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1500;
    band.Q.value = 0.8;

    const high = ctx.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 650;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    src.connect(band);
    band.connect(high);
    high.connect(gain);
    gain.connect(ctx.destination);

    src.start(now);
    src.stop(now + dur);
  } catch {
    /* audio not available — ignore */
  }
}
