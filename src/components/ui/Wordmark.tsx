import { site } from "@/lib/site";

/**
 * The "AreyouDami." wordmark, set in the display face. Rendered as a single
 * unit so the tight tracking + trailing period stay consistent everywhere.
 */
export default function Wordmark({
  className = "",
  as: Tag = "span",
}: {
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={`font-display font-bold tracking-[-0.02em] ${className}`}
      style={{ fontFeatureSettings: "normal" }}
    >
      {site.name}
    </Tag>
  );
}
