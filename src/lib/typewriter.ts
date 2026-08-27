/**
 * A short synthesized "typewriter key" click — a tiny filtered noise tick with
 * a very fast decay, slightly randomised per stroke so a run of them doesn't
 * sound robotic. Meant to be fired once per typed character. No audio asset
 * required. Silent for reduced-motion users and a safe no-op if Web Audio is
 * unavailable or still blocked by the browser's autoplay policy.
 */
let ctx: AudioContext | null = null;

export function playType(volume = 0.08) {
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
    const dur = 0.03;

    // Noise burst with a very fast decay — reads as a sharp mechanical click.
    const buffer = ctx.createBuffer(
      1,
      Math.max(1, Math.floor(ctx.sampleRate * dur)),
      ctx.sampleRate,
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 6);
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1800 + Math.random() * 1000; // slight per-key variation
    band.Q.value = 0.9;

    const high = ctx.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 900;

    const gain = ctx.createGain();
    const v = volume * (0.8 + Math.random() * 0.4);
    gain.gain.setValueAtTime(v, now);
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
