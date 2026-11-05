"use client";

import dynamic from "next/dynamic";
import type { CSSProperties } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Magnetic } from "@/components/magnetic";
import { PortraitPlate } from "@/components/portrait";
import { facts, profile, socials } from "@/lib/data";

const HeroField = dynamic(() => import("@/components/hero-field"), {
  ssr: false,
  loading: () => null,
});

const HEADLINE_CLASS =
  "mt-5 max-w-[22ch] font-sans text-[2.1rem] font-medium leading-[1.04] text-balance sm:text-[3rem] lg:text-[4rem]";
const HEADLINE_TEXT = profile.headline.join(" ");

/** Stagger is a CSS custom property, so the entrance needs no JavaScript. */
const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

function Headline() {
  const lines: string[][] = profile.headline.map((line) => line.split(" "));
  let word = 0;

  return (
    <h1 id="hero-heading" className={HEADLINE_CLASS} aria-label={HEADLINE_TEXT}>
      {lines.map((words, lineIndex) => (
        <span key={lineIndex} aria-hidden="true" className="block overflow-hidden pb-[0.1em] last:pb-0">
          {words.map((text, wordIndex) => (
            <span
              key={`${lineIndex}-${wordIndex}`}
              className="word-rise inline-block will-change-transform"
              style={delay(0.08 + word++ * 0.055)}
            >
              {text}
              {wordIndex < words.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden">
      <HeroField />

      <div className="shell relative pb-20 pt-24 sm:pb-24 sm:pt-28 lg:pb-28 lg:pt-32">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-x-14">
          {/* First in the DOM so the plate leads on small screens; at lg it is
              placed in the second column, aligned with the top of the headline. */}
          <div
            className="rise-in mb-8 lg:col-start-2 lg:mb-0 lg:row-start-1"
            style={{ ...delay(0.05), "--rise": "10px" } as CSSProperties}
          >
            <PortraitPlate />
          </div>

          <div className="lg:col-start-1 lg:row-start-1">
            <p className="eyebrow rise-in flex flex-wrap items-center gap-x-3 gap-y-1" style={delay(0)}>
              <span>{profile.location}</span>
              <span className="h-px w-6 bg-[var(--line-strong)]" aria-hidden="true" />
              <span>{profile.kicker}</span>
            </p>

            <Headline />

            <p
              className="rise-in mt-6 max-w-[58ch] text-[0.98rem] leading-relaxed text-paper-muted"
              style={{ ...delay(0.45), "--rise": "10px" } as CSSProperties}
            >
              {profile.intro}
            </p>

            <div className="rise-in mt-9 flex flex-wrap items-center gap-3" style={delay(0.55)}>
              <Magnetic strength={0.22}>
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 rounded-full bg-volt px-5 py-2.5 font-sans text-[0.88rem] font-medium text-[var(--on-accent)] transition-shadow hover:shadow-[0_0_0_4px_rgb(var(--volt-rgb)/0.22)]"
                >
                  Selected work
                  <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Magnetic>

              <Magnetic strength={0.18}>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] px-5 py-2.5 font-sans text-[0.88rem] text-paper transition-colors hover:border-volt/60 hover:bg-volt/10"
                >
                  Start a conversation
                  <ArrowUpRight className="h-4 w-4 text-volt" aria-hidden="true" />
                </a>
              </Magnetic>

              <span className="flex items-center gap-1 pl-1">
                {socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-2 text-[0.8rem] text-paper-muted transition-colors hover:border-[var(--line)] hover:text-paper"
                  >
                    {s.label}
                    <span className="sr-only">{` - ${s.handle} on ${s.label}, opens in a new tab`}</span>
                  </a>
                ))}
              </span>
            </div>
          </div>
        </div>

        <dl className="rise-in mt-14 grid gap-px overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4" style={delay(0.66)}>
          {facts.map((f) => (
            <div key={f.value} className="bg-ink-raised px-5 py-4">
              <dt className="font-sans text-[1.05rem] font-medium text-paper">{f.value}</dt>
              <dd className="mt-1 text-[0.78rem] leading-snug text-paper-faint">{f.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
