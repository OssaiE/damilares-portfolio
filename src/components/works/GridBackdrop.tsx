/**
 * Background grid for the Works page — identical to the footer's grid (same
 * cell size + opacity) so a single layer reads as one continuous grid across
 * the whole page, footer included. Rendered as an absolute layer; parent must
 * be `relative`.
 */
export default function GridBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          "linear-gradient(90deg, #fff 1px, transparent 1px), linear-gradient(#fff 1px, transparent 1px)",
        backgroundSize: "275px 175px",
      }}
    />
  );
}
