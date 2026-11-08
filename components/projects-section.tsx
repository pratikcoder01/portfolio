import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { projects } from "@/lib/data";

/** Slugs that appear in the main "Selected work" grid. */
const MAIN_SLUGS = ["athlix", "dojo-nation", "platecam"];

const mainProjects = projects.filter((p) => MAIN_SLUGS.includes(p.slug));
const earlierProjects = projects.filter((p) => !MAIN_SLUGS.includes(p.slug));

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

      {/* Main projects grid */}
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {mainProjects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.04} className="h-full">
            <ProjectCard project={project} index={i} />
          </Reveal>
        ))}
      </div>

      {/* Earlier work */}
      {earlierProjects.length > 0 && (
        <div className="mt-14">
          <Reveal>
            <h3 className="font-sans text-[1.1rem] font-medium text-paper-muted">Earlier work</h3>
            <p className="mt-1 max-w-[52ch] text-[0.84rem] text-paper-faint">
              Smaller projects from earlier in the timeline — the full case study is still accessible.
            </p>
          </Reveal>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {earlierProjects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.04} className="h-full">
                <ProjectCard project={project} index={mainProjects.length + i} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
