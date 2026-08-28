import type { Metadata } from "next";
import WorksExperience from "@/components/works/WorksExperience";
import type { WorksView } from "@/components/works/WorksViewSwitcher";

export const metadata: Metadata = {
  title: "Works",
  description:
    "Selected works by Damilola Olawoyin (AreyouDami.) — creative direction, editing and producing. Browse in grid, list or zoom.",
};

const isView = (v?: string): v is WorksView =>
  v === "grid" || v === "list" || v === "zoom";

export default async function WorksPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const sp = await searchParams;
  const view = isView(sp.view) ? sp.view : "zoom";
  return <WorksExperience view={view} />;
}
