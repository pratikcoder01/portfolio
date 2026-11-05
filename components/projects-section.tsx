import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { projects } from "@/lib/data";

export function ProjectsSection() {
  return (
    <section id="work" aria-labelledby="work-heading" className="shell py-20 sm:py-24">
      <div className="ticks mb-6 w-40 opacity-70" aria-hidden="true" />
      <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="work-heading" className="font-sans text-[1.6rem] font-medium sm:text-[2rem]">
            Selected work
          </h2>
          <p className="mt-3 max-w-[62ch] text-[0.92rem] leading-relaxed text-paper-muted">
            Each card is drawn from what the repository actually documents. Open a project for the
            case study; anything I have not written up yet is marked rather than invented.
          </p>
        </div>
        <p className="eyebrow shrink-0">{projects.length} projects</p>
      </Reveal>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.04} className="h-full">
            <ProjectCard project={project} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
