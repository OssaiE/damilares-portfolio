import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/works/ProjectDetail";
import { projects } from "@/lib/site";

type Params = { slug: string };

/** Pre-render every project detail route at build time. */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: `${project.title} — ${project.services}. A ${project.client} production by AreyouDami.`,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound(); // unknown slug → framework 404
  return <ProjectDetail project={project} />;
}
