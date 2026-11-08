import { ImageResponse } from "next/og";

import { projectBySlug, projects } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectOpengraphImage({ params }: ImageProps) {
  const { slug } = await params;
  const project = projectBySlug(slug);

  const name = project?.name ?? "Project";
  const tagline = project?.tagline ?? "";
  const stack = project?.stack.slice(0, 4) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#08090d",
          color: "#eceef5",
          position: "relative",
        }}
      >
        {/* Glow — top-right */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 760,
            height: 440,
            backgroundImage:
              "linear-gradient(225deg, rgba(124,140,255,0.22), rgba(124,140,255,0))",
          }}
        />
        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 10,
            backgroundImage: "linear-gradient(180deg, #7c8cff, rgba(124,140,255,0.06))",
          }}
        />

        {/* Header: logo + "Case study" label */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
          <div
            style={{
              display: "flex",
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "2px solid rgba(124,140,255,0.7)",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              color: "#7c8cff",
            }}
          >
            PN
          </div>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 3, color: "#8b93a8" }}>
            CASE STUDY
          </div>
        </div>

        {/* Project name + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, position: "relative" }}>
          <div style={{ display: "flex", fontSize: 80, letterSpacing: -3, color: "#eceef5", lineHeight: 1.1 }}>
            {name}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#a4abbf", maxWidth: 900, lineHeight: 1.4 }}>
            {tagline}
          </div>
        </div>

        {/* Stack chips */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", position: "relative", flexWrap: "wrap" }}>
          {stack.map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                padding: "10px 18px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)",
                fontSize: 20,
                color: "#a4abbf",
              }}
            >
              {chip}
            </div>
          ))}
          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              fontSize: 18,
              color: "#555e72",
              letterSpacing: 2,
            }}
          >
            pratik-n
          </div>
        </div>
      </div>
    ),
    size,
  );
}

