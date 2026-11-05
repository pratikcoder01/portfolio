import { Reveal } from "@/components/reveal";
import { certifications, education, profile } from "@/lib/data";

export function PrincipleBand() {
  return (
    <section aria-labelledby="principle-heading" className="shell pb-6 pt-4 sm:pt-6">
      <h2 id="principle-heading" className="sr-only">
        How I work
      </h2>
      <Reveal>
        <figure className="relative rounded-2xl border border-[var(--line)] bg-ink-raised/50 px-6 py-8 sm:px-10 sm:py-10">
          <span
            aria-hidden="true"
            className="absolute left-6 top-4 font-sans text-[2.5rem] leading-none text-volt/25 sm:left-10"
          >
            &ldquo;
          </span>
          <blockquote className="max-w-[62ch] font-sans text-[1.05rem] leading-relaxed text-paper sm:text-[1.25rem]">
            {profile.principle}
          </blockquote>
          <figcaption className="mt-4 text-[0.78rem] text-paper-faint">
            From my summary - {profile.education}
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}

export function EducationSection() {
  return (
    <section id="education" aria-labelledby="education-heading" className="shell py-20 sm:py-24">
      <div className="ticks mb-6 w-40 opacity-70" aria-hidden="true" />
      <Reveal>
        <h2 id="education-heading" className="font-sans text-[1.6rem] font-medium sm:text-[2rem]">
          Education &amp; certifications
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <ol className="space-y-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)]">
            {education.map((e) => (
              <li key={e.school} className="bg-ink-raised px-5 py-4">
                <p className="font-sans text-[0.98rem] text-paper">{e.school}</p>
                <p className="mt-1 text-[0.85rem] text-volt-soft">{e.credential}</p>
                <p className="mt-1 text-[0.75rem] text-paper-faint">{e.period}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="h-full rounded-2xl border border-[var(--line)] bg-ink-raised/60 px-5 py-5">
            <h3 className="eyebrow">Certifications</h3>
            <ul className="mt-4 space-y-2.5">
              {certifications.map((c) => (
                <li key={c.name} className="flex gap-3 text-[0.85rem] leading-relaxed text-paper-muted">
                  <span
                    className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-volt"
                    aria-hidden="true"
                  />
                  <span>
                    {c.name}
                    <span className="block text-[0.72rem] text-paper-faint">{c.issuer}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
