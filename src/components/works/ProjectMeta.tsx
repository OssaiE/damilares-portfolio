import type { Project } from "@/lib/site";

/**
 * Project information — three columns on desktop (Description | Client + Year |
 * Role), stacking to Description → Client → Year → Role on small screens. Role
 * credits stay stacked (never a comma list) under a thin divider, per the ref.
 */
export default function ProjectMeta({ project }: { project: Project }) {
  return (
    <section className="px-[var(--gutter)] py-16 md:py-24">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.6fr_1fr_1.1fr] md:gap-8">
        {/* Description */}
        <p className="max-w-xl font-sans text-[13px] leading-relaxed text-subtext md:text-[13.5px]">
          {project.description}
        </p>

        {/* Client + Year */}
        <dl className="space-y-8">
          <div>
            <dt className="u-label text-subtext">Client</dt>
            <dd className="mt-1.5 font-sans text-sm text-paper">
              {project.client}
            </dd>
          </div>
          <div>
            <dt className="u-label text-subtext">Year</dt>
            <dd className="mt-1.5 font-sans text-sm tabular-nums text-paper">
              {project.year}
            </dd>
          </div>
        </dl>

        {/* Role */}
        <div>
          <p className="u-label text-subtext">Role</p>
          <ul className="mt-3 space-y-1.5 border-t border-white/10 pt-4">
            {project.role.map((r) => (
              <li key={r} className="font-sans text-sm text-paper">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
