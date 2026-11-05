import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudy } from "@/components/case-study";
import { projectBySlug, projects } from "@/lib/data";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return { title: "Project not found", robots: { index: false, follow: false } };

  return {
    title: project.name,
    description: project.tagline,
    keywords: project.stack,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} — case study`,
      description: project.tagline,
      url: `/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  return <CaseStudy project={project} />;
}
