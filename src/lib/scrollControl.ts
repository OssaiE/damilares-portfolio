/**
 * Small shared handle so UI (e.g. the works-section indicator dots) can drive
 * the global one-section-at-a-time scroll controller without prop-drilling.
 * ScrollController sets `goToProject` on mount and clears it on unmount.
 */
export const scrollControl: {
  goToProject: ((projectIndex: number) => void) | null;
} = {
  goToProject: null,
};
