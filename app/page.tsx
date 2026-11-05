import { Contact } from "@/components/contact";
import { EducationSection, PrincipleBand } from "@/components/content-sections";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsMap } from "@/components/skills-map";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PrincipleBand />
      <ProjectsSection />
      <ExperienceTimeline />
      <SkillsMap />
      <EducationSection />
      <Contact />
    </>
  );
}
