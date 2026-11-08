/**
 * Single source of truth for all site copy.
 *
 * Provenance rules for this file:
 *   "pdf"   -> LinkedIn profile export (Profile (2).pdf), supplied by Pratik Nagrale
 *   "readme"-> repository README at github.com/pratikcoder01/<repo>
 *   "repo"  -> GitHub repository metadata (name, primary language, description)
 * Anything without a source is represented as a `todo` case-study section, never as prose.
 */

export type SourceKind = "project" | "role" | "organization";

export type SourceId =
  | "athlix"
  | "platecam"
  | "dojo-nation"
  | "sudoku-solver"
  | "number-guessing-game"
  | "flyrank"
  | "enginow"
  | "clyxn"
  | "iste"
  | "technofest"
  | "codealpha";

export interface SourceRef {
  id: SourceId;
  label: string;
  kind: SourceKind;
  href?: string;
}

export const sources: Record<SourceId, SourceRef> = {
  athlix: {
    id: "athlix",
    label: "Athlix",
    kind: "project",
    href: "https://github.com/pratikcoder01/Athlix",
  },
  platecam: {
    id: "platecam",
    label: "PlateCam",
    kind: "project",
    href: "https://github.com/pratikcoder01/PlateCam",
  },
  "dojo-nation": {
    id: "dojo-nation",
    label: "DojoNation",
    kind: "project",
    href: "https://github.com/pratikcoder01/DojoNation",
  },
  "sudoku-solver": {
    id: "sudoku-solver",
    label: "Sudoku Solver (C++)",
    kind: "project",
    href: "https://github.com/pratikcoder01/Sudoku-Solver",
  },
  "number-guessing-game": {
    id: "number-guessing-game",
    label: "Number Guessing Game (C++)",
    kind: "project",
    // TODO(pratik): repo URL has a typo in the GitHub name ("NUmber-gussing-game-").
    // Leave as-is until you rename the repo on GitHub so the existing link keeps working.
    href: "https://github.com/pratikcoder01/NUmber-gussing-game-",
  },
  flyrank: { id: "flyrank", label: "FlyRank AI", kind: "role" },
  enginow: { id: "enginow", label: "Enginow", kind: "role" },
  clyxn: { id: "clyxn", label: "CLYXN Studios x SORXN", kind: "role" },
  iste: { id: "iste", label: "ISTE Secretary", kind: "organization" },
  technofest: { id: "technofest", label: "Technofest Incharge", kind: "organization" },
  codealpha: { id: "codealpha", label: "CodeAlpha", kind: "role" },
};

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

export const profile = {
  name: "Pratik Nagrale",
  // Headline order taken from the profile PDF header line.
  title: "AI & Full-Stack Engineer",
  kicker: "AI Intern @ FlyRank AI",
  location: "Mumbai, Maharashtra, India",
  focus: "C++ - Python - React - DevOps",
  education: "Computer Engineering @ SFIT",
  headline: ["I build systems", "that stop needing", "a human in the loop."],
  intro:
    "AI engineering intern at FlyRank AI working where model capability meets front-end architecture. Strongest in C++ and Python, with shipped work across autonomous robot behaviours, IoT dashboards and full-stack TypeScript platforms. Fundamentals first, frameworks second.",
  // Sentence lifted from the Summary in the profile PDF.
  principle:
    "Systems fail at the coordination layer as often as the code layer, and I have learned to work both.",
} as const;

export const socials = [
  { id: "github", label: "GitHub", handle: "pratikcoder01", href: "https://github.com/pratikcoder01" },
  { id: "linkedin", label: "LinkedIn", handle: "pratik-n", href: "https://www.linkedin.com/in/pratik-n" },
] as const;

/** Email is never hardcoded; it only exists if the environment provides it. */
export function contactEmail(): string | null {
  const raw = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  return raw && raw.includes("@") ? raw : null;
}

export function formspreeId(): string | null {
  const raw = process.env.NEXT_PUBLIC_FORMSPREE_ID?.trim();
  return raw && raw.length > 0 ? raw : null;
}

/* ------------------------------------------------------------------ */
/* Hero stat strip - every entry needs a source above                 */
/* ------------------------------------------------------------------ */

export const facts = [
  { value: "FlyRank AI", label: "Front-end AI engineering intern", source: "pdf" },
  { value: "100+", label: "ISTE members coordinated across 4 teams", source: "pdf" },
  { value: "3+", label: "hardware projects with IoT dashboards built", source: "pdf" },
  { value: "2", label: "C++ applications delivered at CodeAlpha in <4 weeks", source: "pdf" },
] as const;

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */

export interface ExperienceEntry {
  id: string;
  org: string;
  role: string;
  location: string;
  from: string;
  to: string;
  /** ISO-ish ordering key used by the timeline. */
  period: string;
  summary?: string;
  bullets: string[];
  tags: string[];
  sourceId?: SourceId;
  /** Set when the source lists the role without supporting detail. */
  detailTodo?: string;
}

export const experience: ExperienceEntry[] = [
  {
    id: "flyrank",
    org: "FlyRank AI",
    role: "Front-end AI Engineering Intern",
    location: "Chicago (remote)",
    from: "Jun 2026",
    to: "Present",
    period: "2026-06",
    summary:
      "Intersecting AI capabilities with frontend architecture to help build the future of organic growth automation and next-gen AI search engine visibility.",
    bullets: [
      "Front-end AI engineering internship at the intersection of AI capability and front-end architecture.",
      "Work targets organic growth automation and next-generation AI search engine visibility.",
    ],
    tags: ["AI", "Frontend architecture"],
    sourceId: "flyrank",
    detailTodo: "Specific shipped features and team details are not documented yet.",
  },
  {
    id: "enginow",
    org: "Enginow (IIT Bombay)",
    role: "Open Source Contributor",
    location: "Mumbai, Maharashtra, India",
    from: "Jun 2026",
    to: "Present",
    period: "2026-06b",
    bullets: [
      "Open-source contributions through IIT Bombay's Enginow.",
    ],
    tags: ["Open source", "Git"],
    sourceId: "enginow",
    detailTodo: "Merged PR links and the areas contributed to are not listed in the source.",
  },
  {
    id: "iste-secretary",
    org: "Indian Society for Technical Education",
    role: "Secretary",
    location: "Mumbai, Maharashtra, India",
    from: "Aug 2025",
    to: "Jun 2026",
    period: "2025-08",
    bullets: [
      "Led a technical society chapter of 100+ student members, coordinating workshops, events, and industry speaker sessions.",
      "Spearheaded cross-functional collaboration between 4 internal teams - technical, media, design, and operations.",
      "Directly responsible for ISTE chapter communications and official representation at institutional events.",
    ],
    tags: ["Leadership", "Coordination"],
    sourceId: "iste",
  },
  {
    id: "clyxn",
    org: "CLYXN Studios x SORXN (Tantraniketan)",
    role: "Summer Intern",
    location: "Mumbai, Maharashtra, India",
    from: "Jun 2025",
    to: "Aug 2025",
    period: "2025-06",
    bullets: [
      "Designed and deployed autonomous robotic system behaviours using Python and C++, reducing manual calibration time by integrating sensor logic with decision trees.",
      "Built IoT web interfaces for 3+ hardware projects, enabling real-time monitoring via browser dashboards.",
      "Implemented DevOps deployment pipelines for embedded systems using ESP32 and Raspberry Pi, cutting deployment friction across dev environments.",
    ],
    tags: ["Robotics", "Python", "C++", "ESP32", "Raspberry Pi"],
    sourceId: "clyxn",
  },
  {
    id: "technofest",
    org: "Indian Society for Technical Education",
    role: "Technofest Incharge",
    location: "Mumbai, Maharashtra, India",
    from: "Mar 2025",
    to: "Jun 2025",
    period: "2025-03",
    bullets: [
      "Planned and executed Technofest, a college-level technical festival with multiple competitive and workshop tracks.",
      "Coordinated logistics, scheduling, and team assignments across 3+ volunteer groups.",
      "Drove student participation and handled on-ground troubleshooting on event day.",
    ],
    tags: ["Event ownership", "Logistics"],
    sourceId: "technofest",
  },
  {
    id: "iste-technical",
    org: "Indian Society for Technical Education",
    role: "Technical Team",
    location: "Mumbai, Maharashtra, India",
    from: "Jun 2024",
    to: "Mar 2025",
    period: "2024-06",
    bullets: [],
    tags: ["Technical team"],
    sourceId: "iste",
    detailTodo: "The source lists this role without responsibilities - worth adding 2-3 concrete items.",
  },
  {
    id: "codealpha",
    org: "CodeAlpha",
    role: "C++ Developer",
    location: "Mumbai, Maharashtra, India",
    from: "Jun 2024",
    to: "Jun 2024",
    period: "2024-06b",
    bullets: [
      "Built 2 functional C++ applications (Number Guessing Game, Sudoku Solver) in under 4 weeks, demonstrating end-to-end project delivery.",
      "Applied core OOP principles - encapsulation, inheritance, polymorphism - to write modular, maintainable code.",
      "Gained hands-on experience with algorithm design (backtracking for Sudoku), loops, conditionals, and file I/O in a production-adjacent context.",
    ],
    tags: ["C++", "OOP", "Backtracking"],
    sourceId: "codealpha",
  },
];

/* ------------------------------------------------------------------ */
/* Education + certifications                                          */
/* ------------------------------------------------------------------ */

export const education = [
  {
    school: "St. Francis Institute of Technology",
    credential: "B.Tech, Computer Engineering",
    // TODO(pratik): confirm dates — "Expected Aug 2026" overlaps the diploma period below.
    period: "Expected Aug 2026",
  },
  {
    school: "Thakur Polytechnic",
    credential: "Diploma, Information Technology",
    period: "Aug 2023 - Jun 2026",
  },
  {
    school: "Our Lady of Good Health High School",
    credential: "SSC",
    period: "2023",
  },
] as const;

export interface Certification {
  name: string;
  /** Issuing organisation. null means the issuer is not yet confirmed from a primary source. */
  issuer: string | null;
}

// NEEDS INPUT: replace null issuers with the real platform names (e.g. "DeepLearning.AI", "HackerRank").
export const certifications: Certification[] = [
  { name: "Introduction to Retrieval-Augmented Generation", issuer: null },
  { name: "Problem Solving (Basic)", issuer: null },
  { name: "AWS Educate - Machine Learning Foundations", issuer: "AWS Educate" },
  { name: "AWS Educate - Getting Started with Databases", issuer: "AWS Educate" },
  { name: "AWS Educate - Getting Started with Compute", issuer: "AWS Educate" },
];

/* ------------------------------------------------------------------ */
/* Skills + evidence map                                               */
/* ------------------------------------------------------------------ */

export type SkillGroup =
  | "Languages"
  | "Frontend"
  | "Backend & Data"
  | "Applied AI & Vision"
  | "Embedded & IoT"
  | "Delivery"
  | "Beyond code";

export interface Skill {
  name: string;
  group: SkillGroup;
  /** Which projects/roles actually evidence this skill. */
  evidence: SourceId[];
  note?: string;
}

export const skills: Skill[] = [
  { name: "C++", group: "Languages", evidence: ["sudoku-solver", "number-guessing-game", "clyxn"] },
  { name: "Python", group: "Languages", evidence: ["platecam", "clyxn"] },
  { name: "TypeScript", group: "Languages", evidence: ["athlix", "dojo-nation"] },
  { name: "JavaScript", group: "Languages", evidence: ["athlix", "dojo-nation"] },
  { name: "SQL / Postgres", group: "Languages", evidence: ["dojo-nation"] },

  { name: "React", group: "Frontend", evidence: ["athlix", "dojo-nation"] },
  { name: "Next.js (App Router)", group: "Frontend", evidence: ["athlix"] },
  { name: "Vite", group: "Frontend", evidence: ["dojo-nation"] },
  { name: "Tailwind CSS", group: "Frontend", evidence: ["athlix", "dojo-nation"] },
  { name: "Framer Motion", group: "Frontend", evidence: ["athlix"] },
  { name: "GSAP + ScrollTrigger", group: "Frontend", evidence: ["athlix"] },
  { name: "Three.js / React Three Fiber", group: "Frontend", evidence: ["athlix"] },
  { name: "TanStack Query", group: "Frontend", evidence: ["athlix"] },
  { name: "Zustand", group: "Frontend", evidence: ["athlix"] },
  { name: "React Hook Form + Zod", group: "Frontend", evidence: ["athlix"] },
  { name: "Accessible UI / focus states", group: "Frontend", evidence: ["athlix"] },

  { name: "Node.js", group: "Backend & Data", evidence: ["athlix"] },
  { name: "Express.js", group: "Backend & Data", evidence: ["athlix"] },
  { name: "REST API design", group: "Backend & Data", evidence: ["platecam", "athlix"] },
  { name: "MongoDB + Mongoose", group: "Backend & Data", evidence: ["athlix"] },
  { name: "Socket.io realtime", group: "Backend & Data", evidence: ["athlix"] },
  { name: "JWT + bcrypt auth", group: "Backend & Data", evidence: ["athlix"] },
  { name: "Supabase (Auth, Postgres)", group: "Backend & Data", evidence: ["dojo-nation"] },
  { name: "Cloudinary / Multer uploads", group: "Backend & Data", evidence: ["athlix"] },

  {
    name: "OpenCV",
    group: "Applied AI & Vision",
    evidence: ["platecam"],
    note: "Plate detection pipeline stage documented in the PlateCam README.",
  },
  {
    name: "EasyOCR",
    group: "Applied AI & Vision",
    evidence: ["platecam"],
    note: "Character extraction stage documented in the PlateCam README.",
  },
  {
    name: "MediaPipe 2D pose estimation",
    group: "Applied AI & Vision",
    evidence: ["athlix"],
    note: "Kata Analyzer: monocular pose landmarks -> joint angles, COM, stability, symmetry, guard, velocity.",
  },
  {
    name: "Rule-based metric design",
    group: "Applied AI & Vision",
    evidence: ["athlix"],
    note: "Weighted composite score published with explicit measurement limits.",
  },
  { name: "RAG (coursework)", group: "Applied AI & Vision", evidence: [], note: "Certification only - no shipped RAG system yet." },
  {
    name: "Frontend AI integration",
    group: "Applied AI & Vision",
    evidence: ["flyrank"],
    note: "Current internship focus: AI capability meeting front-end architecture.",
  },

  { name: "ESP32", group: "Embedded & IoT", evidence: ["clyxn"] },
  { name: "Raspberry Pi", group: "Embedded & IoT", evidence: ["clyxn"] },
  { name: "Sensor logic + decision trees", group: "Embedded & IoT", evidence: ["clyxn"] },
  { name: "IoT browser dashboards", group: "Embedded & IoT", evidence: ["clyxn"] },

  { name: "Git & GitHub workflow", group: "Delivery", evidence: ["enginow", "athlix"] },
  { name: "Vercel", group: "Delivery", evidence: ["athlix"] },
  { name: "Render", group: "Delivery", evidence: ["athlix"] },
  { name: "MongoDB Atlas", group: "Delivery", evidence: ["athlix"] },
  { name: "Deployment pipelines for embedded", group: "Delivery", evidence: ["clyxn"] },
  { name: "Monorepo integration", group: "Delivery", evidence: ["athlix"] },

  { name: "Technical team leadership", group: "Beyond code", evidence: ["iste"] },
  { name: "Cross-functional coordination", group: "Beyond code", evidence: ["iste", "technofest"] },
  { name: "Event planning & execution", group: "Beyond code", evidence: ["technofest"] },
  { name: "Open-source contribution", group: "Beyond code", evidence: ["enginow"] },
  { name: "Pitch & demo preparation", group: "Beyond code", evidence: ["athlix"] },
];

export const skillGroups: SkillGroup[] = [
  "Languages",
  "Frontend",
  "Backend & Data",
  "Applied AI & Vision",
  "Embedded & IoT",
  "Delivery",
  "Beyond code",
];

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export type DiagramKey = "athlix" | "platecam" | "dojo-nation" | null;

export interface CaseSection {
  id:
    | "problem"
    | "research"
    | "architecture"
    | "implementation"
    | "challenges"
    | "results"
    | "future";
  title: string;
  status: "documented" | "todo";
  paragraphs?: string[];
  bullets?: string[];
  /** Where this content came from, shown in the footer of the section. */
  provenance?: string;
  /** For `todo` sections: exactly what Pratik needs to supply. */
  needed?: string;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  role: string;
  period: string;
  status: string;
  repo?: string;
  diagram: DiagramKey;
  stack: string[];
  /** Short card copy. */
  highlights: string[];
  /** One-line honest scope note rendered on the card. */
  scopeNote?: string;
  caseSections: CaseSection[];
}

export const projects: Project[] = [
  {
    slug: "athlix",
    name: "Athlix",
    tagline:
      "Sports-tech platform for combat-sports athletes, coaches, academies and tournament organizers.",
    role: "Project Lead & Full Stack",
    period: "2026",
    status: "Monorepo, deployed targets documented",
    repo: "https://github.com/pratikcoder01/Athlix",
    diagram: "athlix",
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Express",
      "MongoDB Atlas",
      "Socket.io",
      "Cloudinary",
      "MediaPipe",
    ],
    highlights: [
      "Coaching bookings, real-time social feeds, geospatial academy discovery, tournament bracket registries.",
      "Kata Analyzer on 2D monocular pose estimation with a published composite score.",
      "Monorepo split: client on Vercel, Express API on Render, data on MongoDB Atlas.",
    ],
    scopeNote:
      "The analyzer measures 2D pose-derived metrics only - no true 3D position, force, impact or kata recognition.",
    caseSections: [
      {
        id: "problem",
        title: "Problem",
        status: "documented",
        paragraphs: [
          "Combat-sports communities are served by separate tools: bookings for coaching, a feed for the community, maps to find academies, and spreadsheets or paper for tournament brackets.",
          "Athlix states its goal as one unified workspace that blends professional coaching bookings, real-time social feeds, geospatial academy discovery and digital tournament bracket registries.",
        ],
        provenance: "Paraphrased from the Athlix README description.",
      },
      {
        id: "research",
        title: "Research",
        status: "documented",
        paragraphs: [
          "The Kata Analyzer began from a measurement question rather than a feature question: what can be honestly derived from a single camera, and what cannot.",
          "The README documents the boundary explicitly - 2D monocular pose estimation plus rule-based calculations, chosen over approaches that would imply depth or force data the hardware cannot provide.",
        ],
        bullets: [
          "MediaPipe pose landmarks as the only sensing input.",
          "Vector dot-product geometry for elbow, knee, hip and shoulder angles.",
          "Center of mass modelled as a weighted average of hip and shoulder landmarks.",
        ],
        provenance: "Source: Athlix README, \"What This Actually Measures\".",
      },
      {
        id: "architecture",
        title: "Architecture",
        status: "documented",
        paragraphs: [
          "A root workspace coordinates two packages. The Next.js 15 App Router client talks to an Express + TypeScript API over HTTP and Socket.io channels. Mongoose models persist to MongoDB Atlas; media uploads go through Multer to Cloudinary.",
          "The repository also keeps architecture contracts in docs/: db_design.md for collection structure and ERD, api_map.md for route endpoints and Socket.io channels, and setup_guide.md for local and production environments.",
        ],
        bullets: [
          "client/ - Next.js 15, React 19, TypeScript, deployed on Vercel (dev port 3000).",
          "server/ - Express + TypeScript on Render (dev port 5000), JWT + bcrypt, Mongoose.",
          "docs/ - database design, API and Socket.io channel map, setup guide.",
          ".github/ - pull request and issue templates; CONTRIBUTING.md defines scoped branch workflows and commit style.",
        ],
        provenance: "Source: Athlix README, \"Repository Architecture\" and \"Technology Stack\".",
      },
      {
        id: "implementation",
        title: "Implementation",
        status: "documented",
        paragraphs: [
          "Ownership recorded in the README team table: monorepo integration, Cloudinary, DevOps workflows, testing and pitch preparation.",
          "The analyzer's composite score is a weighted sum calculated directly from pose landmark data and displayed with its formula exposed: Stability x0.25, Guard x0.15, Precision x0.25, Symmetry x0.20, Velocity x0.15.",
        ],
        bullets: [
          "Measured: joint angles, center of mass, frame-to-frame COM variance (stability), left/right symmetry, guard position above hip level, wrist/ankle movement velocity, normalised stance width.",
          "Detected at a broad level: natural, front, horse and back stances; arm strike, leg strike and block.",
          "Client data layer: TanStack Query for caching, Zustand for state, React Hook Form with Zod validation.",
        ],
        provenance: "Source: Athlix README team table and metrics section.",
      },
      {
        id: "challenges",
        title: "Challenges",
        status: "documented",
        paragraphs: [
          "The hardest documented problem was scope honesty. A pose-based score looks authoritative to a user, so the README states what the system cannot do: no true 3D position, no physical force or power, no impact or contact detection, no fine-grained technique names such as Oi Zuki vs Gyaku Zuki, no kata recognition, no per-foot weight distribution.",
        ],
        needed: "Engineering obstacles you actually hit (monorepo tooling, Socket.io auth, render performance) are not written down anywhere yet.",
        provenance: "Source: Athlix README, \"What It Does NOT Measure\".",
      },
      {
        id: "results",
        title: "Results",
        status: "todo",
        needed:
          "No user counts, adoption, demo outcomes or launch results have been provided. Add real numbers (or the absence of them) here - nothing will be invented.",
      },
      {
        id: "future",
        title: "Future Improvements",
        status: "documented",
        paragraphs: [
          "Each documented measurement gap is a candidate next step: depth-aware tracking for true 3D position, an IMU or force-sensing layer for power and contact, a labelled technique classifier, and per-foot load estimation.",
        ],
        needed: "Your own roadmap - what you actually plan to build next - is not in the README.",
        provenance: "Derived from the limits listed in the Athlix README.",
      },
    ],
  },
  {
    slug: "platecam",
    name: "PlateCam",
    tagline:
      "License plate recognition: OpenCV detection and EasyOCR extraction, served to a mobile app over a REST API.",
    role: "Builder",
    period: "2025",
    status: "Design documented; implementation not yet published",
    repo: "https://github.com/pratikcoder01/PlateCam",
    diagram: "platecam",
    stack: ["Python", "OpenCV", "EasyOCR", "REST API", "Edge deployment"],
    highlights: [
      "Detects and extracts plate numbers from images.",
      "Mobile app integration through a REST API.",
      "Positioned for real-time use, edge deployment and cross-platform compatibility.",
    ],
    scopeNote:
      "The public repository currently documents the design in its README; the implementation is not published there.",
    caseSections: [
      {
        id: "problem",
        title: "Problem",
        status: "documented",
        paragraphs: [
          "Reading a plate from a photo needs two different abilities: finding the plate in an uncontrolled image, then reading the characters inside it. PlateCam separates them - OpenCV for detection, EasyOCR for extraction - and exposes the result to a mobile app through a REST API.",
        ],
        provenance: "Source: PlateCam README.",
      },
      {
        id: "research",
        title: "Research",
        status: "todo",
        needed:
          "Why OpenCV classic-vision + EasyOCR rather than a trained detector (and what you compared) is not written down. Give me 2-3 sentences and any benchmark images or accuracy you measured.",
      },
      {
        id: "architecture",
        title: "Architecture",
        status: "documented",
        paragraphs: [
          "Four documented stages: an image enters, OpenCV detection localises the plate region, EasyOCR extracts the plate string, and a REST API serves it to the mobile app. Edge deployment and cross-platform use are stated as design targets.",
        ],
        bullets: [
          "Input: images (README scope is image-based recognition).",
          "Detection: OpenCV.",
          "Extraction: EasyOCR.",
          "Delivery: REST API consumed by a mobile app.",
        ],
        provenance: "Source: PlateCam README.",
      },
      {
        id: "implementation",
        title: "Implementation",
        status: "todo",
        needed:
          "No code is published in the repository, so nothing can be described here honestly. Push the source or send the pipeline files and this section becomes real.",
      },
      {
        id: "challenges",
        title: "Challenges",
        status: "todo",
        needed: "Angle, occlusion, lighting or latency issues you hit - none are documented.",
      },
      {
        id: "results",
        title: "Results",
        status: "todo",
        needed: "Accuracy, frames-per-second or deployment results - none are published.",
      },
      {
        id: "future",
        title: "Future Improvements",
        status: "documented",
        paragraphs: [
          "The README names real-time use and edge deployment as the direction the design was built toward; the open question is which device and which latency budget.",
        ],
        needed: "Concrete next steps you intend to take.",
        provenance: "Source: PlateCam README.",
      },
    ],
  },
  {
    slug: "dojo-nation",
    name: "DojoNation",
    tagline: "A global network where athletes, coaches and gyms connect, explore, train and grow.",
    role: "Frontend / full-stack contributor",
    period: "2026",
    status: "Source published",
    repo: "https://github.com/pratikcoder01/DojoNation",
    diagram: "dojo-nation",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Supabase Auth", "Postgres", "React Router"],
    highlights: [
      "Role-based signup for Athlete, Coach and Gym, plus login.",
      "Profiles with martial-arts styles, rank and bio; explore with role/style/location filters.",
      "Training session booking and training-log tracking.",
    ],
    caseSections: [
      {
        id: "problem",
        title: "Problem",
        status: "documented",
        paragraphs: [
          "Martial arts is networked by reputation rather than by tooling: finding the right coach, the right gym, and keeping a shared record of training. DojoNation is described as a global network for athletes, coaches and gyms to connect, explore, train and grow.",
        ],
        provenance: "Source: DojoNation README.",
      },
      {
        id: "research",
        title: "Research",
        status: "todo",
        needed: "Why Supabase over a custom Express/Mongo backend - and what the trade-off analysis was.",
      },
      {
        id: "architecture",
        title: "Architecture",
        status: "documented",
        paragraphs: [
          "A Vite-delivered React + TypeScript SPA routed by React Router DOM, styled with Tailwind CSS. Global state is held in React Context providers; Supabase provides authentication and a Postgres database whose schema is versioned in supabase/schema.sql.",
        ],
        bullets: [
          "src/components - reusable UI. src/pages - route views.",
          "src/context - global state providers.",
          "src/lib - Supabase client configuration.",
          "src/hooks - custom hooks. src/types - TypeScript definitions.",
          "Environment: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
        ],
        provenance: "Source: DojoNation README (tech stack, setup, project structure).",
      },
      {
        id: "implementation",
        title: "Implementation",
        status: "documented",
        bullets: [
          "Authentication with role-based signup for Athlete, Coach and Gym, plus login.",
          "Detailed profiles carrying martial-arts styles, rank and bio.",
          "Explore: search and filter users by role, style and location.",
          "Booking: request training sessions with coaches or gyms.",
          "Training logs: track sessions and progress.",
        ],
        provenance: "Source: DojoNation README, \"Features\".",
      },
      {
        id: "challenges",
        title: "Challenges",
        status: "todo",
        needed: "Row-level security, role modelling or filtering problems you actually ran into.",
      },
      {
        id: "results",
        title: "Results",
        status: "todo",
        needed: "Deployed URL, users or sessions recorded - nothing is published.",
      },
      {
        id: "future",
        title: "Future Improvements",
        status: "todo",
        needed: "Your roadmap for the next iteration.",
      },
    ],
  },
  {
    slug: "sudoku-solver",
    name: "Sudoku Solver",
    tagline: "Backtracking Sudoku solver in C++ built during a CodeAlpha internship.",
    role: "C++ Developer, CodeAlpha",
    period: "Jun 2024",
    status: "Source published",
    repo: "https://github.com/pratikcoder01/Sudoku-Solver",
    diagram: null,
    stack: ["C++", "Backtracking", "OOP", "File I/O"],
    highlights: [
      "One of two C++ applications delivered in under 4 weeks at CodeAlpha.",
      "Algorithm design by backtracking; core OOP principles applied for modular, maintainable code.",
    ],
    caseSections: [
      {
        id: "problem",
        title: "Problem",
        status: "documented",
        paragraphs: [
          "A constraint-satisfaction exercise delivered as an internship task: fill a partially-solved board by trying candidates and backing out when a placement makes the board unsolvable.",
        ],
        provenance: "Source: profile PDF (CodeAlpha) + repository description.",
      },
      { id: "research", title: "Research", status: "todo", needed: "Any comparison of backtracking against constraint propagation or dancing links." },
      { id: "architecture", title: "Architecture", status: "todo", needed: "Class/function breakdown - the README is a single line." },
      {
        id: "implementation",
        title: "Implementation",
        status: "documented",
        bullets: [
          "Backtracking for search, as recorded on the profile.",
          "Encapsulation, inheritance and polymorphism applied for modularity.",
          "Loops, conditionals and file I/O used in a production-adjacent context.",
        ],
        provenance: "Source: profile PDF, CodeAlpha entry.",
      },
      { id: "challenges", title: "Challenges", status: "todo", needed: "The hardest part: input parsing, unsolvable-board detection, or recursion depth." },
      { id: "results", title: "Results", status: "todo", needed: "Board sizes / solve times you actually measured." },
      { id: "future", title: "Future Improvements", status: "todo", needed: "Planned extensions, e.g. generator, difficulty rating, solver visualiser." },
    ],
  },
  {
    slug: "number-guessing-game",
    name: "Number Guessing Game",
    tagline: "Console C++ guessing game with difficulty tiers, feedback loop and animated state.",
    role: "C++ Developer, CodeAlpha",
    period: "Jun 2024",
    status: "Source published",
    // TODO(pratik): repo URL has a typo in the GitHub name ("NUmber-gussing-game-").
    // Leave as-is until you rename the repo on GitHub so the existing link keeps working.
    repo: "https://github.com/pratikcoder01/NUmber-gussing-game-",
    diagram: null,
    stack: ["C++", "OOP", "ANSI console I/O"],
    highlights: [
      "Second of two C++ applications delivered in under 4 weeks at CodeAlpha.",
      "Difficulty selection drives attempt limits; feedback narrows the range each guess.",
    ],
    caseSections: [
      {
        id: "problem",
        title: "Problem",
        status: "documented",
        paragraphs: [
          "An internship task with a small but real UX surface: make a text loop feel like a game - clear the screen between states, pace the reveal, and end cleanly when the player wants out.",
        ],
        provenance: "Source: repository README.",
      },
      {
        id: "research",
        title: "Research",
        status: "documented",
        bullets: [
          "ANSI escape codes chosen for in-console screen clearing and cursor reset.",
          "Character-by-character output used to build the congratulatory animation.",
        ],
        provenance: "Source: repository README.",
      },
      {
        id: "architecture",
        title: "Architecture",
        status: "documented",
        bullets: [
          "clearScreen() - ANSI escape codes to clear the console and reset the cursor.",
          "loadingAnimation() - dotted progress with pauses and screen clears between cycles.",
          "congratulationsAnimation() - celebratory message printed one character at a time.",
          "main() - welcome and instructions, difficulty prompt, then the game loop.",
        ],
        provenance: "Source: repository README.",
      },
      {
        id: "implementation",
        title: "Implementation",
        status: "documented",
        bullets: [
          "On difficulty selection, the game generates a random number between 1 and 100.",
          "A limited attempt count per difficulty, with too-high / too-low feedback after every guess.",
          "The loop continues until a correct guess or exhausted attempts; choosing to end prints a thank-you message.",
          "Players can run multiple rounds or exit from within the same session.",
        ],
        provenance: "Source: repository README.",
      },
      { id: "challenges", title: "Challenges", status: "todo", needed: "Anything non-obvious: timing, portability of ANSI codes across terminals, input validation." },
      { id: "results", title: "Results", status: "todo", needed: "No measurable outcome documented." },
      { id: "future", title: "Future Improvements", status: "todo", needed: "Planned work, e.g. score persistence, two-player mode." },
    ],
  },
];

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const sections = [
  { id: "work", label: "Selected work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;
