import { site } from "@/lib/site";

/**
 * The "AreyouDami." wordmark, set in the display face. Rendered as a single
 * unit so the tight tracking + trailing period stay consistent everywhere.
 */
export default function Wordmark({
  className = "",
  as: Tag = "span",
  weight = 700,
}: {
  className?: string;
  as?: React.ElementType;
  /** Display weight (variable font). Defaults to 700; the footer uses 550. */
  weight?: number;
}) {
  return (
    <Tag
      className={`font-display tracking-[-0.02em] ${className}`}
      style={{ fontWeight: weight, fontFeatureSettings: "normal" }}
    >
      {site.name}
    </Tag>
  );
}
