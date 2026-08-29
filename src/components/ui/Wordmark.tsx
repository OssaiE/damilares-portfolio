import { site } from "@/lib/site";

/**
 * The "AreyouDami." wordmark, set in the display face. Rendered as a single
 * unit so the tight tracking + trailing period stay consistent everywhere.
 */
export default function Wordmark({
  className = "",
  as: Tag = "span",
  weight = 700,
  tracking = "-0.02em",
}: {
  className?: string;
  as?: React.ElementType;
  /** Display weight (variable font). Defaults to 700; footer/particle use 550. */
  weight?: number;
  /** Letter-spacing. Defaults to -0.02em; the nav logo uses -0.04em. */
  tracking?: string;
}) {
  return (
    <Tag
      className={`font-display ${className}`}
      style={{ fontWeight: weight, letterSpacing: tracking, fontFeatureSettings: "normal" }}
    >
      {site.name}
    </Tag>
  );
}
