"use client";

export type WorksView = "grid" | "list" | "zoom";

export const WORKS_VIEWS: { id: WorksView; label: string }[] = [
  { id: "zoom", label: "Zoom" },
  { id: "list", label: "List" },
  { id: "grid", label: "Grid" },
];

/**
 * Header top-right control: `Works.  [Grid] [List] [Zoom]`.
 * URL-driven — the parent updates `?view=` and passes the active view back.
 */
export default function WorksViewSwitcher({
  view,
  onChange,
  showLabel = true,
}: {
  view: WorksView;
  onChange: (v: WorksView) => void;
  /** The "Works." lead-in — shown in the header, hidden for the in-page control. */
  showLabel?: boolean;
}) {
  return (
    <div className="flex h-14 items-center gap-4">
      {showLabel && (
        <span className="font-sans text-base font-medium text-primary">
          Works.
        </span>
      )}
      <div
        role="group"
        aria-label="Choose a view"
        className="flex items-center gap-2 font-sans text-sm tracking-wide"
      >
        {WORKS_VIEWS.map(({ id, label }) => {
          const active = id === view;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-pressed={active}
              className={`rounded-[2px] px-1 py-0.5 transition-colors duration-200 ${
                active
                  ? "text-primary underline decoration-primary underline-offset-4"
                  : "text-paper/80 hover:text-primary"
              }`}
            >
              <span aria-hidden className="opacity-60">
                [
              </span>{" "}
              {label}{" "}
              <span aria-hidden className="opacity-60">
                ]
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
