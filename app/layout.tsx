import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { LoadReveal } from "@/components/load-reveal";
import { MotionProvider } from "@/components/motion-provider";
import { THEME_BOOTSTRAP, THEME_COLORS } from "@/lib/theme";
import { profile } from "@/lib/data";
import { siteUrl } from "@/lib/site";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: THEME_COLORS.dark,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s — ${profile.name}`,
  },
  description:
    "Portfolio of Pratik Nagrale, an AI and full-stack engineer in Mumbai: front-end AI engineering intern at FlyRank AI, open-source contributor, and builder across robotics, computer vision and TypeScript platforms.",
  keywords: [
    "Pratik Nagrale",
    "AI Engineer",
    "Full-Stack Engineer",
    "Next.js",
    "TypeScript",
    "C++",
    "Python",
    "Mumbai",
  ],
  authors: [{ name: profile.name, url: "https://github.com/pratikcoder01" }],
  creator: profile.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: `${profile.name} — ${profile.title}`,
    title: `${profile.name} — ${profile.title}`,
    description:
      "AI and full-stack engineer. Front-end AI intern at FlyRank AI, robotics and computer-vision work, and production TypeScript platforms.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description:
      "AI and full-stack engineer in Mumbai. Selected work, case studies and skills with evidence.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${grotesk.variable} ${body.variable}`}>
      <head>
        {/* Decides the palette before the first paint so there is no flash of the
            wrong theme. The server always renders dark; the script may switch. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body>
        <noscript>
          <style>{"[data-reveal]{opacity:1 !important;transform:none !important}"}</style>
        </noscript>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <MotionProvider>
          <LoadReveal />
          <SiteNav />
          <main id="main">{children}</main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
