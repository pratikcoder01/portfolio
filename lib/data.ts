/**
 * Single source of truth for portfolio data and copy.
 * Written in clear, direct, first-person engineering prose.
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
  title: "AI & Full-Stack Engineer",
  kicker: "AI Engineering Intern @ FlyRank AI",
  location: "Mumbai, Maharashtra, India",
  focus: "TypeScript · Python · C++ · System Architecture",
  education: "Computer Engineering @ SFIT",
  headline: ["Building reliable systems,", "from modern web platforms", "to applied AI."],
  intro:
    "I'm an AI engineering intern at FlyRank AI and a computer engineering student in Mumbai. I focus on bridging model capabilities with resilient frontend architecture, working comfortably in TypeScript, Python, and C++. I care about fundamentals, clear system contracts, and building fast, maintainable tools.",
  principle:
    "Great software comes from understanding the entire stack—from data structures and API contracts down to user interaction and operational ergonomics.",
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
/* Hero stat strip                                                    */
/* ------------------------------------------------------------------ */

export const facts = [
  { value: "FlyRank AI", label: "Front-end AI engineering intern" },
  { value: "100+", label: "Engineers coordinated across chapter teams" },
  { value: "3+", label: "Hardware & IoT monitoring dashboards built" },
  { value: "C++ & Python", label: "Core foundation in algorithms & systems" },
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
  period: string;
  summary?: string;
  bullets: string[];
  tags: string[];
  sourceId?: SourceId;
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
      "Integrating AI model workflows into frontend web applications to support automated search optimization and organic growth intelligence.",
    bullets: [
      "Architecting responsive user interfaces that consume streaming generative model outputs with minimal perceived latency.",
      "Developing search engine visibility analysis and organic growth automation tooling using Next.js and TypeScript.",
      "Establishing strict client-side data contracts and optimistic state updates to keep application interactions smooth.",
    ],
    tags: ["AI Integration", "Next.js", "TypeScript", "Frontend Architecture"],
    sourceId: "flyrank",
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
      "Contributing modular features and issue fixes to student utility tools maintained under Enginow.",
      "Collaborating through pull requests, continuous integration pipelines, and code review workflows.",
    ],
    tags: ["Open Source", "Git", "TypeScript"],
    sourceId: "enginow",
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
      "Led a technical student chapter of 100+ members, coordinating workshops, hackathons, and speaker sessions.",
      "Spearheaded cross-functional collaboration between four internal teams: technical, media, design, and operations.",
      "Managed chapter-wide technical communications and official representations at university and industry events.",
    ],
    tags: ["Leadership", "Operations", "Team Management"],
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
      "Designed and deployed autonomous robotic system behaviours using Python and C++, integrating sensor feedback with deterministic decision logic.",
      "Built real-time web telemetry dashboards for hardware prototypes, enabling live sensor observation over local networks.",
      "Created structured build and deployment workflows for embedded microcontrollers using ESP32 and Raspberry Pi.",
    ],
    tags: ["Robotics", "Python", "C++", "ESP32", "Raspberry Pi", "IoT"],
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
      "Planned and executed Technofest, an annual technical symposium hosting multiple competitive coding and project tracks.",
      "Coordinated scheduling, infrastructure requirements, and task delegation across volunteer teams.",
      "Streamlined on-ground operations to ensure smooth execution of technical challenges and workshops.",
    ],
    tags: ["Event Leadership", "Logistics", "Coordination"],
    sourceId: "technofest",
  },
  {
    id: "iste-technical",
    org: "Indian Society for Technical Education",
    role: "Technical Team Member",
    location: "Mumbai, Maharashtra, India",
    from: "Jun 2024",
    to: "Mar 2025",
    period: "2024-06",
    bullets: [
      "Conducted introductory coding workshops covering C++, data structures, and basic Git collaboration.",
      "Maintained lab infrastructure and assisted peer students with setup, debugging, and project architecture.",
    ],
    tags: ["Mentorship", "C++", "Workshops"],
    sourceId: "iste",
  },
  {
    id: "codealpha",
    org: "CodeAlpha",
    role: "C++ Developer Intern",
    location: "Mumbai, Maharashtra, India",
    from: "Jun 2024",
    to: "Jun 2024",
    period: "2024-06b",
    bullets: [
      "Developed two functional C++ applications (Sudoku Solver and Number Guessing Game) within four weeks.",
      "Applied object-oriented principles to ensure modular separation between game state, logic, and terminal I/O.",
      "Implemented depth-first backtracking search algorithms with efficient constraint checking.",
    ],
    tags: ["C++", "Algorithms", "OOP", "Backtracking"],
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
    period: "Expected 2026",
  },
  {
    school: "Thakur Polytechnic",
    credential: "Diploma, Information Technology",
    period: "2023 - 2026",
  },
  {
    school: "Our Lady of Good Health High School",
    credential: "Secondary School Certificate",
    period: "2023",
  },
] as const;

export interface Certification {
  name: string;
  issuer: string | null;
}

export const certifications: Certification[] = [
  { name: "Introduction to Retrieval-Augmented Generation", issuer: "DeepLearning.AI" },
  { name: "Problem Solving (Basic)", issuer: "HackerRank" },
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
  { name: "TanStack Query", group: "Frontend", evidence: ["athlix"] },
  { name: "Zustand", group: "Frontend", evidence: ["athlix"] },
  { name: "React Hook Form + Zod", group: "Frontend", evidence: ["athlix"] },
  { name: "Accessible UI / semantic markup", group: "Frontend", evidence: ["athlix"] },

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
    note: "Image pre-processing, contour detection, and license plate localisation pipeline.",
  },
  {
    name: "EasyOCR",
    group: "Applied AI & Vision",
    evidence: ["platecam"],
    note: "Optical character recognition pipeline for localized bounding boxes.",
  },
  {
    name: "MediaPipe 2D pose estimation",
    group: "Applied AI & Vision",
    evidence: ["athlix"],
    note: "Kata Analyzer: monocular pose landmarks mapping joint angles, stability, and guard metrics.",
  },
  {
    name: "Rule-based metric design",
    group: "Applied AI & Vision",
    evidence: ["athlix"],
    note: "Mathematical formulation of biomechanical scoring with explicit operational boundaries.",
  },
  {
    name: "Frontend AI integration",
    group: "Applied AI & Vision",
    evidence: ["flyrank"],
    note: "Production UI integration of generative model APIs and streaming interfaces.",
  },

  { name: "ESP32", group: "Embedded & IoT", evidence: ["clyxn"] },
  { name: "Raspberry Pi", group: "Embedded & IoT", evidence: ["clyxn"] },
  { name: "Sensor logic + decision trees", group: "Embedded & IoT", evidence: ["clyxn"] },
  { name: "IoT browser dashboards", group: "Embedded & IoT", evidence: ["clyxn"] },

  { name: "Git & GitHub workflow", group: "Delivery", evidence: ["enginow", "athlix"] },
  { name: "Vercel", group: "Delivery", evidence: ["athlix"] },
  { name: "Render", group: "Delivery", evidence: ["athlix"] },
  { name: "MongoDB Atlas", group: "Delivery", evidence: ["athlix"] },
  { name: "CI/CD & deployment automation", group: "Delivery", evidence: ["clyxn"] },
  { name: "Monorepo architecture", group: "Delivery", evidence: ["athlix"] },

  { name: "Technical team leadership", group: "Beyond code", evidence: ["iste"] },
  { name: "Cross-functional coordination", group: "Beyond code", evidence: ["iste", "technofest"] },
  { name: "Event planning & execution", group: "Beyond code", evidence: ["technofest"] },
  { name: "Open-source contribution", group: "Beyond code", evidence: ["enginow"] },
  { name: "Technical presentations", group: "Beyond code", evidence: ["athlix"] },
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
  status: "documented";
  paragraphs?: string[];
  bullets?: string[];
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
  highlights: string[];
  scopeNote?: string;
  caseSections: CaseSection[];
}

export const projects: Project[] = [
  {
    slug: "athlix",
    name: "Athlix",
    tagline:
      "A unified sports-tech platform connecting combat-sports athletes, coaches, academies, and tournament organizers.",
    role: "Full-Stack Engineer & Architect",
    period: "2026",
    status: "Monorepo deployed & active",
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
      "Integrated coaching bookings, real-time social feeds, geospatial academy discovery, and tournament brackets.",
      "Real-time Kata Analyzer powered by 2D monocular pose estimation and transparent biomechanical formulas.",
      "Clean monorepo split: Next.js 15 App Router on Vercel, Express API on Render, MongoDB Atlas database.",
    ],
    scopeNote:
      "The analyzer calculates 2D pose metrics directly in the client—designed without making false claims about 3D force or impact.",
    caseSections: [
      {
        id: "problem",
        title: "Problem",
        status: "documented",
        paragraphs: [
          "The combat-sports community frequently relies on fragmented tools: messaging apps for coaching bookings, generic social media for highlight clips, map searches for gym discovery, and spreadsheets for tournament brackets.",
          "Athlix was conceived to unify these core operational workflows into a single purpose-built platform designed specifically for martial artists, coaches, and event hosts.",
        ],
      },
      {
        id: "research",
        title: "Research & Technical Boundaries",
        status: "documented",
        paragraphs: [
          "When designing the automated Kata Analyzer, the primary technical consideration was defining clear measurement boundaries. Monocular smartphone video cannot measure true 3D spatial depth or impact force without specialized hardware.",
          "Rather than using an opaque black-box model that makes unverifiable claims, I designed a deterministic geometric scoring engine over MediaPipe 2D pose landmarks.",
        ],
        bullets: [
          "Used 2D landmark coordinates to calculate joint angles via vector dot-products.",
          "Modelled body center-of-mass (COM) through weighted shoulder and hip midpoints.",
          "Tracked frame-to-frame variance in center-of-mass to quantify physical balance and stance stability.",
        ],
      },
      {
        id: "architecture",
        title: "System Architecture",
        status: "documented",
        paragraphs: [
          "Athlix is built as an npm workspace monorepo separating frontend presentation from backend API services. The client runs on Next.js 15 with the App Router, communicating with an Express + TypeScript service over HTTP and WebSocket connections.",
          "Data contracts are strictly maintained with shared TypeScript interfaces, and document schemas are formalized using Mongoose models connected to MongoDB Atlas.",
        ],
        bullets: [
          "client/ — Next.js 15, React 19, Tailwind CSS, TanStack Query, and Zustand.",
          "server/ — Express + TypeScript API providing JWT authentication, REST endpoints, and Socket.io events.",
          "Media handling — Multer buffer processing streamed directly to Cloudinary asset storage.",
          "Docs & Contracts — Formal database schemas, API maps, and setup guides versioned directly in repository docs.",
        ],
      },
      {
        id: "implementation",
        title: "Implementation Details",
        status: "documented",
        paragraphs: [
          "The client-side pose engine runs entirely in the browser using WebAssembly-accelerated MediaPipe. Biomechanical scores are calculated on every frame and aggregated into a transparent weighted metric: Stability (25%), Guard (15%), Precision (25%), Symmetry (20%), and Velocity (15%).",
          "On the backend, tournament brackets use tree-based seed progression, and live match updates propagate to connected spectators over dedicated Socket.io rooms.",
        ],
        bullets: [
          "Client state management: Zustand for lightweight session data, TanStack Query for server cache invalidation.",
          "Real-time transport: Socket.io handles live feed updates, direct messages, and bracket state synchronization.",
          "Form validation: React Hook Form paired with Zod schemas ensures type safety at user input boundaries.",
        ],
      },
      {
        id: "challenges",
        title: "Key Engineering Decisions & Challenges",
        status: "documented",
        paragraphs: [
          "Balancing client-side pose inference performance with smooth 60fps rendering required careful attention. Offloading calculation loops from main-thread React state transitions and avoiding unnecessary component re-renders was critical.",
          "Another priority was scope transparency: the interface explicitly informs athletes that measurements represent 2D postural geometry rather than kinetic strike power, building trust through engineering honesty.",
        ],
      },
      {
        id: "results",
        title: "Results & Takeaways",
        status: "documented",
        paragraphs: [
          "Successfully deployed the complete full-stack monorepo with production builds on Vercel and Render. The project demonstrated end-to-end delivery across real-time WebSockets, computer vision in the browser, and scalable monorepo tooling.",
        ],
      },
      {
        id: "future",
        title: "Roadmap & Next Steps",
        status: "documented",
        paragraphs: [
          "Future milestones include exploring WebGPU acceleration for pose landmark extraction, adding video export overlays with annotated joint vectors, and integrating Stripe for direct tournament registration fees.",
        ],
      },
    ],
  },
  {
    slug: "platecam",
    name: "PlateCam",
    tagline:
      "Automated license plate recognition combining OpenCV detection and EasyOCR character extraction.",
    role: "Computer Vision & API Developer",
    period: "2025",
    status: "Pipeline & prototype architecture",
    repo: "https://github.com/pratikcoder01/PlateCam",
    diagram: "platecam",
    stack: ["Python", "OpenCV", "EasyOCR", "REST API", "NumPy"],
    highlights: [
      "Two-stage pipeline: Classical computer vision plate localization paired with deep learning OCR.",
      "Engineered image preprocessing filters to handle shadows, perspective tilt, and high contrast.",
      "Clean REST API interface for integration into mobile client applications.",
    ],
    scopeNote:
      "Designed for reliable edge execution with low compute overhead using modular Python components.",
    caseSections: [
      {
        id: "problem",
        title: "Problem",
        status: "documented",
        paragraphs: [
          "Vehicle license plate identification in practical conditions must handle variable lighting, angles, dirty plates, and image blur. Running heavy monolithic object detection models can be overkill or too slow for resource-constrained edge deployments.",
          "PlateCam splits the task into two targeted phases: fast classical image processing to locate candidate plate regions, followed by optical character recognition on the normalized plate bounding box.",
        ],
      },
      {
        id: "research",
        title: "Vision Pipeline Design",
        status: "documented",
        paragraphs: [
          "I evaluated classical morphological transformations in OpenCV versus deep detector networks. Classical filtering (grayscale conversion, bilateral filtering for noise reduction, and Sobel edge detection) isolates plate candidates with minimal computational footprint.",
          "For the text reading step, EasyOCR provides robust character extraction across standard alphanumeric registration fonts.",
        ],
        bullets: [
          "Bilateral filtering preserves sharp plate boundaries while eliminating texture noise.",
          "Otsu thresholding and contour hierarchy filtering identify rectangular regions matching plate aspect ratios.",
          "Perspective correction straightens tilted plates before text recognition.",
        ],
      },
      {
        id: "architecture",
        title: "System Architecture",
        status: "documented",
        paragraphs: [
          "The pipeline receives incoming frames or image uploads, runs them through the OpenCV localization module, passes cropped regions to the EasyOCR engine, and exposes results through a lightweight REST API.",
        ],
        bullets: [
          "Input: Raw frame buffer or JPEG/PNG payload.",
          "Processing: OpenCV detection pipeline with aspect-ratio validation.",
          "Recognition: EasyOCR inference with character confidence scoring.",
          "Delivery: JSON payload returning detected text, confidence, and bounding box coordinates.",
        ],
      },
      {
        id: "implementation",
        title: "Implementation Details",
        status: "documented",
        paragraphs: [
          "Implemented in modular Python, separating image manipulation utilities from OCR inference logic. Regular expression post-processing cleans extracted strings against known vehicle registration patterns.",
        ],
      },
      {
        id: "challenges",
        title: "Challenges & Optimizations",
        status: "documented",
        paragraphs: [
          "The biggest challenge was false-positive contour matches on vehicle grilles and radiator vents. This was addressed by tightening geometric criteria (aspect ratio between 2.0 and 5.5, minimum bounding area, and horizontal orientation thresholds).",
        ],
      },
      {
        id: "results",
        title: "Results & Validation",
        status: "documented",
        paragraphs: [
          "Demonstrated accurate plate localization and text recognition across test image sets under normal daylight and angled conditions, proving the viability of a lightweight two-tier pipeline.",
        ],
      },
      {
        id: "future",
        title: "Next Iterations",
        status: "documented",
        paragraphs: [
          "Plans include benchmarking quantization on ONNX runtime for sub-50ms inference on Raspberry Pi edge devices, and adding video stream tracking across consecutive frames.",
        ],
      },
    ],
  },
  {
    slug: "dojo-nation",
    name: "DojoNation",
    tagline:
      "A martial arts community web application for booking coaches, discovering gyms, and tracking training logs.",
    role: "Frontend & Full-Stack Developer",
    period: "2026",
    status: "Full stack web application",
    repo: "https://github.com/pratikcoder01/DojoNation",
    diagram: "dojo-nation",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Supabase", "PostgreSQL", "React Router"],
    highlights: [
      "Role-based authentication architecture catering to Athletes, Coaches, and Gym Managers.",
      "Searchable directory with filters for martial arts styles, experience levels, and regional location.",
      "Training session request workflow and individual progress logging.",
    ],
    caseSections: [
      {
        id: "problem",
        title: "Problem",
        status: "documented",
        paragraphs: [
          "Martial artists often struggle to find qualified coaches in specific disciplines (such as Brazilian Jiu-Jitsu, Muay Thai, or Judo) and lack structured tools to record training consistency over time.",
          "DojoNation provides a tailored platform where practitioners can explore coaches, book training sessions, and maintain a verifiable digital training log.",
        ],
      },
      {
        id: "research",
        title: "Stack Evaluation",
        status: "documented",
        paragraphs: [
          "Rather than building custom authentication and relational storage from scratch, I chose Supabase with PostgreSQL. This allowed us to focus on building an intuitive frontend experience while leveraging PostgreSQL's relational integrity and built-in Row-Level Security (RLS).",
        ],
        bullets: [
          "Vite + React SPA provides instant hot-module reloading and optimized static asset bundles.",
          "Supabase Auth manages secure session handling with JWTs and custom role claims.",
          "PostgreSQL manages relational tables for user profiles, session bookings, and martial art styles.",
        ],
      },
      {
        id: "architecture",
        title: "System Architecture",
        status: "documented",
        paragraphs: [
          "The client is structured as a feature-driven React and TypeScript application. Route views are managed by React Router DOM, with centralized authentication state distributed via React Context.",
        ],
        bullets: [
          "src/pages/ — Role-specific views for athletes, coach booking, and gym exploration.",
          "src/components/ — Reusable UI design system built with Tailwind CSS.",
          "src/lib/ — Supabase client configuration and typed database client queries.",
          "Database — Relational schema versioned in supabase/schema.sql.",
        ],
      },
      {
        id: "implementation",
        title: "Implementation Details",
        status: "documented",
        paragraphs: [
          "The user signup flow allows users to declare their primary role upon onboarding. Based on this role, profile dashboards display specialized capabilities—such as session scheduling for coaches or training log calendars for athletes.",
        ],
      },
      {
        id: "challenges",
        title: "Key Challenges",
        status: "documented",
        paragraphs: [
          "Handling role-specific permissions without leaking private contact information required structuring Supabase RLS policies carefully. Public profiles reveal style and discipline, while booking details remain restricted to the involved parties.",
        ],
      },
      {
        id: "results",
        title: "Outcomes",
        status: "documented",
        paragraphs: [
          "Delivered a responsive web platform that makes discovering coaches and tracking training seamless across both mobile and desktop screens.",
        ],
      },
      {
        id: "future",
        title: "Future Enhancements",
        status: "documented",
        paragraphs: [
          "Planned additions include automated calendar integrations (Google Calendar / iCal) for session bookings and video check-ins for remote coaching reviews.",
        ],
      },
    ],
  },
  {
    slug: "sudoku-solver",
    name: "Sudoku Solver",
    tagline: "High-performance backtracking constraint solver written in modern C++.",
    role: "C++ Developer",
    period: "Jun 2024",
    status: "Open source C++ utility",
    repo: "https://github.com/pratikcoder01/Sudoku-Solver",
    diagram: null,
    stack: ["C++", "Algorithms", "Backtracking", "Object-Oriented Programming"],
    highlights: [
      "Recursive depth-first backtracking engine capable of solving 9x9 grids in milliseconds.",
      "Clean separation of board state representation, validation rules, and terminal rendering.",
      "Built with strict memory efficiency and modular class structures.",
    ],
    caseSections: [
      {
        id: "problem",
        title: "Problem",
        status: "documented",
        paragraphs: [
          "Sudoku is a classic NP-complete constraint-satisfaction puzzle. An efficient solver must navigate a search space of up to 9^81 states without wasteful allocations or unnecessary recursion branches.",
        ],
      },
      {
        id: "research",
        title: "Algorithm Selection",
        status: "documented",
        paragraphs: [
          "I chose a depth-first backtracking search algorithm. Before each candidate assignment, row, column, and 3x3 subgrid constraints are verified in O(1) checks, pruning invalid subtrees immediately.",
        ],
      },
      {
        id: "architecture",
        title: "System Architecture",
        status: "documented",
        paragraphs: [
          "The application uses an object-oriented design where the SudokuBoard class encapsulates grid state and validation routines, while the Solver class orchestrates the recursive placement algorithm.",
        ],
      },
      {
        id: "implementation",
        title: "Implementation Details",
        status: "documented",
        paragraphs: [
          "Implemented using standard modern C++ with zero external dependencies. Grid inputs are validated for initial solvability and well-formedness before initiating the recursive backtracking loop.",
        ],
      },
      {
        id: "challenges",
        title: "Engineering Challenges",
        status: "documented",
        paragraphs: [
          "The primary focus was minimizing function call overhead and branch mispredictions during deep recursive exploration. Using flat 1D arrays with index arithmetic reduced cache misses compared to nested pointer arrays.",
        ],
      },
      {
        id: "results",
        title: "Results",
        status: "documented",
        paragraphs: [
          "Achieved deterministic, instantaneous solves on standard hard-tier grids, proving algorithmic correctness and clean code organization.",
        ],
      },
      {
        id: "future",
        title: "Future Improvements",
        status: "documented",
        paragraphs: [
          "Planned updates include implementing Donald Knuth's Dancing Links (Algorithm X) for exact cover optimization and building an ASCII-based interactive puzzle generator.",
        ],
      },
    ],
  },
  {
    slug: "number-guessing-game",
    name: "Number Guessing Game",
    tagline: "Interactive terminal game built in C++ featuring ANSI state clearing and responsive feedback.",
    role: "C++ Developer",
    period: "Jun 2024",
    status: "Console application",
    repo: "https://github.com/pratikcoder01/NUmber-gussing-game-",
    diagram: null,
    stack: ["C++", "Console I/O", "ANSI Escape Sequences", "State Loops"],
    highlights: [
      "Custom game loop with difficulty settings, attempt caps, and dynamic hint adjustments.",
      "Smooth terminal UX utilizing ANSI escape codes for clean screen redraws and animated state pacing.",
      "Robust input validation preventing invalid characters from crashing the stream buffer.",
    ],
    caseSections: [
      {
        id: "problem",
        title: "Problem",
        status: "documented",
        paragraphs: [
          "Building terminal applications that feel responsive requires more than basic std::cin and std::cout statements. Poor stream handling leads to input buffer lockups, while unformatted outputs cause visual clutter.",
        ],
      },
      {
        id: "research",
        title: "Terminal UI & Control",
        status: "documented",
        paragraphs: [
          "I used standard ANSI escape codes to programmatically clear screens, reset cursor positions, and format text without introducing heavy third-party curses libraries.",
        ],
      },
      {
        id: "architecture",
        title: "Application Architecture",
        status: "documented",
        paragraphs: [
          "Structured around a finite game state loop: introduction and difficulty selection, random target generation, attempt iteration with feedback, and post-game replay evaluation.",
        ],
      },
      {
        id: "implementation",
        title: "Implementation Details",
        status: "documented",
        paragraphs: [
          "Implemented robust stream sanitization using std::cin.clear() and std::cin.ignore() to prevent infinite loop errors when players enter non-numeric values.",
        ],
      },
      {
        id: "challenges",
        title: "Challenges",
        status: "documented",
        paragraphs: [
          "Ensuring cross-platform terminal compatibility required using standardized ANSI codes supported in modern PowerShell, macOS, and Linux terminal emulators.",
        ],
      },
      {
        id: "results",
        title: "Results",
        status: "documented",
        paragraphs: [
          "Delivered a polished console game that demonstrates disciplined input handling, clean game architecture, and careful attention to user experience in a text-only medium.",
        ],
      },
      {
        id: "future",
        title: "Future Improvements",
        status: "documented",
        paragraphs: [
          "Potential extensions include file-based high-score persistence and multiplayer turn-based rounds.",
        ],
      },
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
  { id: "work", label: "Selected Work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;
