/**
 * Portfolio Data Model & Source of Truth.
 * Authored in high-signal, first-person technical prose.
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
  enginow: { id: "enginow", label: "Enginow (IIT Bombay)", kind: "role" },
  clyxn: { id: "clyxn", label: "CLYXN Studios x SORXN", kind: "role" },
  iste: { id: "iste", label: "ISTE Student Chapter", kind: "organization" },
  technofest: { id: "technofest", label: "Technofest Technical Symposium", kind: "organization" },
  codealpha: { id: "codealpha", label: "CodeAlpha", kind: "role" },
};

/* ------------------------------------------------------------------ */
/* Profile & Identity                                                 */
/* ------------------------------------------------------------------ */

export const profile = {
  name: "Pratik Nagrale",
  title: "AI & Full-Stack Engineer",
  kicker: "AI Engineering Intern @ FlyRank AI",
  location: "Mumbai, Maharashtra, India",
  focus: "TypeScript · Python · C++ · Distributed Contracts",
  education: "Computer Engineering @ SFIT (Lateral Entry)",
  headline: ["Building reliable systems,", "from modern web platforms", "to applied AI."],
  intro:
    "AI engineering intern at FlyRank AI and computer engineering undergraduate at SFIT. I bridge model boundaries with resilient, low-latency frontend architecture across TypeScript, Python, and C++. Focused on systems design, explicit API contracts, and performant user interfaces.",
  principle:
    "Production software succeeds through disciplined boundary contracts: type safety across network lines, deterministic data structures, and predictable operational failure modes.",
} as const;

export const socials = [
  { id: "github", label: "GitHub", handle: "pratikcoder01", href: "https://github.com/pratikcoder01" },
  { id: "linkedin", label: "LinkedIn", handle: "pratik-n", href: "https://www.linkedin.com/in/pratik-n" },
] as const;

export function contactEmail(): string | null {
  const raw = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  return raw && raw.includes("@") ? raw : null;
}

export function formspreeId(): string | null {
  const raw = process.env.NEXT_PUBLIC_FORMSPREE_ID?.trim();
  return raw && raw.length > 0 ? raw : null;
}

/* ------------------------------------------------------------------ */
/* Engineering Telemetry Facts                                        */
/* ------------------------------------------------------------------ */

export const facts = [
  { value: "FlyRank AI", label: "AI Frontend Architecture Intern" },
  { value: "100+", label: "Engineers coordinated across chapter divisions" },
  { value: "3+", label: "Telemetry & hardware web dashboards deployed" },
  { value: "C++ & Python", label: "Foundational algorithms & robotics control" },
] as const;

/* ------------------------------------------------------------------ */
/* Experience Timeline                                                */
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
    location: "Chicago, IL (Remote)",
    from: "Jun 2026",
    to: "Present",
    period: "2026-06",
    summary:
      "Architecting user interfaces and streaming client infrastructure for automated AI search visibility and organic discovery tooling.",
    bullets: [
      "Engineered streaming LLM response pipelines with optimistic client state updates, preventing layout shifts during asynchronous inference.",
      "Built automated visibility audit tools using Next.js 15 App Router, TypeScript, and React Server Components.",
      "Established strict type contracts between Python machine learning services and client state hydration layers.",
    ],
    tags: ["Next.js 15", "TypeScript", "LLM Pipelines", "Frontend Architecture"],
    sourceId: "flyrank",
  },
  {
    id: "enginow",
    org: "Enginow (IIT Bombay)",
    role: "Open Source Contributor",
    location: "Mumbai, India",
    from: "Jun 2026",
    to: "Present",
    period: "2026-06b",
    bullets: [
      "Authored modular features, bug fixes, and test coverage for student utility platforms maintained under Enginow.",
      "Maintained branch sanitation, code review standards, and CI test pipelines across shared repositories.",
    ],
    tags: ["Open Source", "Git", "TypeScript", "CI/CD"],
    sourceId: "enginow",
  },
  {
    id: "iste-secretary",
    org: "Indian Society for Technical Education",
    role: "Secretary",
    location: "Mumbai, India",
    from: "Aug 2025",
    to: "Jun 2026",
    period: "2025-08",
    bullets: [
      "Directed chapter operations for a student body of 100+ members, coordinating technical workshops, competitive hackathons, and guest seminars.",
      "Spearheaded technical, logistics, media, and design divisions to ensure reliable event delivery.",
      "Served as primary technical communicator and institutional liaison for external engineering symposiums.",
    ],
    tags: ["Leadership", "Operations", "Team Coordination"],
    sourceId: "iste",
  },
  {
    id: "clyxn",
    org: "CLYXN Studios x SORXN (Tantraniketan)",
    role: "Embedded Systems & Robotics Intern",
    location: "Mumbai, India",
    from: "Jun 2025",
    to: "Aug 2025",
    period: "2025-06",
    bullets: [
      "Engineered autonomous robotic motion controllers using Python and C++, fusing sensor input with deterministic state-machine logic.",
      "Built low-latency web telemetry dashboards for hardware prototypes, enabling real-time sensor observation over local networks.",
      "Constructed deployment and flashing pipelines for ESP32 and Raspberry Pi target boards.",
    ],
    tags: ["Robotics", "Python", "C++", "ESP32", "Raspberry Pi", "IoT"],
    sourceId: "clyxn",
  },
  {
    id: "technofest",
    org: "Indian Society for Technical Education",
    role: "Technofest Incharge",
    location: "Mumbai, India",
    from: "Mar 2025",
    to: "Jun 2025",
    period: "2025-03",
    bullets: [
      "Architected scheduling, infrastructure allocation, and competitive problem tracks for an inter-college technical symposium.",
      "Coordinated cross-functional volunteer clusters to deliver hackathons and technical project displays on budget.",
    ],
    tags: ["Event Architecture", "Logistics", "Symposium"],
    sourceId: "technofest",
  },
  {
    id: "iste-technical",
    org: "Indian Society for Technical Education",
    role: "Technical Team Lead",
    location: "Mumbai, India",
    from: "Jun 2024",
    to: "Mar 2025",
    period: "2024-06",
    bullets: [
      "Conducted foundational programming workshops covering C++, pointer mechanics, data structures, and Git version control.",
      "Maintained laboratory development environments and resolved tooling bottlenecks for junior cohorts.",
    ],
    tags: ["C++", "Data Structures", "Workshops"],
    sourceId: "iste",
  },
  {
    id: "codealpha",
    org: "CodeAlpha",
    role: "C++ Systems Intern",
    location: "Mumbai, India",
    from: "Jun 2024",
    to: "Jun 2024",
    period: "2024-06b",
    bullets: [
      "Delivered two modular C++ systems (Backtracking Sudoku Solver and ANSI-Driven Terminal Game) within a strict four-week sprint.",
      "Implemented depth-first search algorithms with sub-millisecond constraint pruning on 9x9 grids.",
      "Maintained clean object-oriented class separation between terminal I/O, board state, and solving routines.",
    ],
    tags: ["C++", "Algorithms", "Backtracking", "Memory Optimization"],
    sourceId: "codealpha",
  },
];

/* ------------------------------------------------------------------ */
/* Chronologically Consistent Education                               */
/* ------------------------------------------------------------------ */

export const education = [
  {
    school: "St. Francis Institute of Technology",
    credential: "B.Tech, Computer Engineering (Lateral Entry)",
    period: "2024 - Expected 2027",
    status: "Active Undergraduate",
  },
  {
    school: "Thakur Polytechnic",
    credential: "Diploma, Information Technology",
    period: "2021 - 2024",
    status: "Completed (First Class with Distinction)",
  },
  {
    school: "Our Lady of Good Health High School",
    credential: "Secondary School Certificate (SSC)",
    period: "2021",
    status: "Completed",
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
/* Skills & Evidence Graph                                            */
/* ------------------------------------------------------------------ */

export type SkillGroup =
  | "Languages"
  | "Frontend"
  | "Backend & Data"
  | "Applied AI & Vision"
  | "Embedded & IoT"
  | "Delivery & Tooling"
  | "Leadership & Execution";

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
  { name: "SQL (PostgreSQL)", group: "Languages", evidence: ["dojo-nation"] },

  { name: "React 19", group: "Frontend", evidence: ["athlix", "dojo-nation"] },
  { name: "Next.js 15 (App Router)", group: "Frontend", evidence: ["athlix"] },
  { name: "Vite SPA Architecture", group: "Frontend", evidence: ["dojo-nation"] },
  { name: "Tailwind CSS", group: "Frontend", evidence: ["athlix", "dojo-nation"] },
  { name: "Framer Motion", group: "Frontend", evidence: ["athlix"] },
  { name: "TanStack Query", group: "Frontend", evidence: ["athlix"] },
  { name: "Zustand State Stores", group: "Frontend", evidence: ["athlix"] },
  { name: "React Hook Form + Zod", group: "Frontend", evidence: ["athlix"] },
  { name: "WCAG 2.1 AA Semantics", group: "Frontend", evidence: ["athlix"] },

  { name: "Node.js", group: "Backend & Data", evidence: ["athlix"] },
  { name: "Express.js REST APIs", group: "Backend & Data", evidence: ["athlix"] },
  { name: "API Contract Design", group: "Backend & Data", evidence: ["platecam", "athlix"] },
  { name: "MongoDB Atlas + Mongoose", group: "Backend & Data", evidence: ["athlix"] },
  { name: "Socket.io Channels", group: "Backend & Data", evidence: ["athlix"] },
  { name: "JWT Session Security", group: "Backend & Data", evidence: ["athlix"] },
  { name: "Supabase (RLS & Auth)", group: "Backend & Data", evidence: ["dojo-nation"] },
  { name: "Cloudinary Asset Stream", group: "Backend & Data", evidence: ["athlix"] },

  {
    name: "OpenCV",
    group: "Applied AI & Vision",
    evidence: ["platecam"],
    note: "Morphological edge detection, bilateral noise suppression, and bounding box localization.",
  },
  {
    name: "EasyOCR",
    group: "Applied AI & Vision",
    evidence: ["platecam"],
    note: "Alphanumeric optical character extraction with character confidence thresholding.",
  },
  {
    name: "MediaPipe 2D Pose",
    group: "Applied AI & Vision",
    evidence: ["athlix"],
    note: "Real-time client-side pose estimation computing joint vectors and stability metrics.",
  },
  {
    name: "Biomechanical Scoring",
    group: "Applied AI & Vision",
    evidence: ["athlix"],
    note: "Deterministic center-of-mass and guard elevation metrics with published limits.",
  },
  {
    name: "Streaming AI UI",
    group: "Applied AI & Vision",
    evidence: ["flyrank"],
    note: "Streaming client integration consuming asynchronous generative model tokens.",
  },

  { name: "ESP32", group: "Embedded & IoT", evidence: ["clyxn"] },
  { name: "Raspberry Pi", group: "Embedded & IoT", evidence: ["clyxn"] },
  { name: "Deterministic State Machines", group: "Embedded & IoT", evidence: ["clyxn"] },
  { name: "Telemetry Dashboards", group: "Embedded & IoT", evidence: ["clyxn"] },

  { name: "Git Workflow & CI", group: "Delivery & Tooling", evidence: ["enginow", "athlix"] },
  { name: "Vercel Edge Platform", group: "Delivery & Tooling", evidence: ["athlix"] },
  { name: "Render API Deployment", group: "Delivery & Tooling", evidence: ["athlix"] },
  { name: "Monorepo Workspaces", group: "Delivery & Tooling", evidence: ["athlix"] },

  { name: "Technical Team Leadership", group: "Leadership & Execution", evidence: ["iste"] },
  { name: "Cross-Functional Sync", group: "Leadership & Execution", evidence: ["iste", "technofest"] },
  { name: "Engineering Symposiums", group: "Leadership & Execution", evidence: ["technofest"] },
  { name: "Open Source Code Review", group: "Leadership & Execution", evidence: ["enginow"] },
];

export const skillGroups: SkillGroup[] = [
  "Languages",
  "Frontend",
  "Backend & Data",
  "Applied AI & Vision",
  "Embedded & IoT",
  "Delivery & Tooling",
  "Leadership & Execution",
];

/* ------------------------------------------------------------------ */
/* Production Project Portfolio                                       */
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
      "Sports-tech monorepo uniting athlete management, academy discovery, tournament registries, and client-side biomechanics.",
    role: "Systems Architect & Full Stack Lead",
    period: "2026",
    status: "Monorepo Active",
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
      "Unified coaching booking, real-time social feeds, geospatial academy search, and tree-seeded tournament brackets.",
      "Real-time Kata Analyzer calculating 2D postural stability using client-side MediaPipe landmark geometry.",
      "Monorepo boundary: Next.js 15 App Router on Vercel, Express API on Render, and MongoDB Atlas database.",
    ],
    scopeNote:
      "The analyzer computes 2D planar pose metrics entirely on the client, avoiding false claims regarding 3D force or kinetic impact.",
    caseSections: [
      {
        id: "problem",
        title: "Problem & Systems Scope",
        status: "documented",
        paragraphs: [
          "Combat-sports organizations operate across disconnected channels: messaging apps for session scheduling, unstructured social groups for community feeds, maps for gym discovery, and paper records for tournament brackets.",
          "Athlix was designed as an integrated monorepo workspace to resolve these fragmentation bottlenecks with strict shared data schemas.",
        ],
      },
      {
        id: "research",
        title: "Technical Constraints & Vision Boundary",
        status: "documented",
        paragraphs: [
          "When architecting the automated Kata Analyzer, defining physical measurement limits was the initial engineering priority. Monocular RGB video streams lack depth perception and ground-reaction force data.",
          "Rather than using an opaque black-box network, I implemented a deterministic geometric model operating on normalized MediaPipe 2D landmarks.",
        ],
        bullets: [
          "Joint flexion/extension angles calculated via vector dot-products across adjacent skeletal coordinates.",
          "Center of mass (COM) approximated via weighted bilateral shoulder and hip landmark centroids.",
          "Frame-to-frame COM delta tracking to compute dynamic balance and stance stability metrics.",
        ],
      },
      {
        id: "architecture",
        title: "Monorepo Architecture & Contracts",
        status: "documented",
        paragraphs: [
          "Athlix employs an npm workspace architecture separating the client presentation application from backend API services. The client runs on Next.js 15 and interacts with an Express TypeScript server via HTTP REST and WebSocket connections.",
          "Database models are formalized via Mongoose schemas, and endpoints are documented with formal contracts versioned directly in repository specifications.",
        ],
        bullets: [
          "apps/client — Next.js 15, React 19, Tailwind CSS, TanStack Query, and Zustand.",
          "apps/server — Express + TypeScript API, JWT session validation, and Socket.io rooms.",
          "Storage Pipeline — Multer stream processing routed directly to Cloudinary CDN storage.",
          "Architecture Docs — Comprehensive db_design.md, api_map.md, and setup guides versioned in repo.",
        ],
      },
      {
        id: "implementation",
        title: "Implementation & Real-Time Sync",
        status: "documented",
        paragraphs: [
          "The client-side pose engine executes directly within the browser using WebAssembly-accelerated MediaPipe. Biomechanical stability scores are calculated per frame: Stability (25%), Guard (15%), Precision (25%), Symmetry (20%), and Velocity (15%).",
          "Tournament brackets utilize a seeded binary-tree progression model, broadcasting real-time match outcomes across subscribed Socket.io channels.",
        ],
        bullets: [
          "Data Layer: TanStack Query manages cache invalidation; Zustand holds ephemeral session state.",
          "Real-Time Transport: Socket.io delivers live feed posts, notifications, and bracket updates.",
          "Form Security: React Hook Form coupled with Zod validates request payloads before transmission.",
        ],
      },
      {
        id: "challenges",
        title: "Engineering Decisions & Trade-Offs",
        status: "documented",
        paragraphs: [
          "Maintaining a 60fps UI while executing real-time pose landmark extraction required isolating computational calculations from React render cycles, using requestAnimationFrame and off-screen canvas buffers.",
          "Scope honesty was reinforced across the UI: the interface explicitly informs practitioners that metrics reflect 2D alignment rather than physical strike force.",
        ],
      },
      {
        id: "results",
        title: "Verification & Production State",
        status: "documented",
        paragraphs: [
          "Shipped the production monorepo with automated deployment targets on Vercel and Render, verifying clean WebSocket connections and sub-second API round-trips.",
        ],
      },
      {
        id: "future",
        title: "System Roadmap",
        status: "documented",
        paragraphs: [
          "Next milestones include WebGPU-accelerated pose inference pipelines, recorded video annotated trajectory exports, and integrated Stripe payment escrow for tournament registrations.",
        ],
      },
    ],
  },
  {
    slug: "platecam",
    name: "PlateCam",
    tagline:
      "Automated license plate recognition pipeline combining classical OpenCV localization with EasyOCR character extraction.",
    role: "Computer Vision & Pipeline Architect",
    period: "2025",
    status: "Architecture & Pipeline Active",
    repo: "https://github.com/pratikcoder01/PlateCam",
    diagram: "platecam",
    stack: ["Python", "OpenCV", "EasyOCR", "REST API", "NumPy"],
    highlights: [
      "Two-tier pipeline: Classical morphological pre-filtering isolates plate regions prior to targeted neural OCR.",
      "Engineered noise-reduction filters to process skewed angles, high-contrast glare, and shadows.",
      "Stateless REST API interface delivering structured JSON responses to client applications.",
    ],
    scopeNote:
      "Engineered for predictable edge execution with low compute requirements on standard embedded hardware.",
    caseSections: [
      {
        id: "problem",
        title: "Problem & Environmental Constraints",
        status: "documented",
        paragraphs: [
          "Automatic number plate recognition under varied field conditions encounters variable sunlight, oblique camera angles, dirt, and motion blur. Monolithic deep-learning detectors often incur heavy compute overhead unsuited for edge deployment.",
          "PlateCam splits the pipeline: lightweight morphological image operations locate candidate plate contours, followed by optical character recognition focused exclusively on the normalized bounding crop.",
        ],
      },
      {
        id: "research",
        title: "Pipeline Design & Morphological Filtering",
        status: "documented",
        paragraphs: [
          "Classical computer vision operations were selected over heavy full-frame neural detectors. Bilateral filtering preserves crisp character edges while suppressing background texture noise.",
          "Adaptive thresholding and contour hierarchy filtering isolate rectangular regions matching standard vehicular license plate aspect ratios.",
        ],
        bullets: [
          "Bilateral filtering minimizes noise while preserving sharp plate edge boundaries.",
          "Sobel gradients and Otsu thresholding isolate candidate rectangular contours.",
          "Perspective homography transformation rectifies skewed plate crops prior to OCR processing.",
        ],
      },
      {
        id: "architecture",
        title: "Service Architecture",
        status: "documented",
        paragraphs: [
          "The pipeline receives incoming frames via HTTP upload, routes the image buffer through the OpenCV localization module, dispatches the cropped sub-image to EasyOCR, and returns structured metadata.",
        ],
        bullets: [
          "Input: Multipart raw image buffer (JPEG/PNG).",
          "Localization: OpenCV morphological filtering and aspect-ratio validation.",
          "Recognition: EasyOCR inference with character-level confidence scores.",
          "Output: Structured JSON containing normalized string, confidence index, and bounding coordinates.",
        ],
      },
      {
        id: "implementation",
        title: "Implementation Details",
        status: "documented",
        paragraphs: [
          "Constructed using modular Python components, separating frame pre-processing from the OCR inference engine. Regular expression string sanitization cleans extracted characters against vehicle registration naming conventions.",
        ],
      },
      {
        id: "challenges",
        title: "False-Positive Elimination",
        status: "documented",
        paragraphs: [
          "The primary obstacle was false-positive detections triggered by vehicle radiator grilles and bumper vents. This was resolved by enforcing strict geometric constraints (aspect ratio between 2.2 and 5.5, minimum surface area, and horizontal orientation thresholds).",
        ],
      },
      {
        id: "results",
        title: "Accuracy Validation",
        status: "documented",
        paragraphs: [
          "Validated reliable plate detection and text extraction across test image suites, achieving sub-second processing latency per frame on standard hardware.",
        ],
      },
      {
        id: "future",
        title: "Edge Optimization Roadmap",
        status: "documented",
        paragraphs: [
          "Next iterations include INT8 ONNX runtime quantization for sub-50ms inference on Raspberry Pi edge devices and multi-frame temporal consensus smoothing.",
        ],
      },
    ],
  },
  {
    slug: "dojo-nation",
    name: "DojoNation",
    tagline:
      "Martial arts community web platform for role-based coach scheduling, gym discovery, and verified training logs.",
    role: "Full-Stack Engineer",
    period: "2026",
    status: "Web Application Active",
    repo: "https://github.com/pratikcoder01/DojoNation",
    diagram: "dojo-nation",
    stack: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Supabase", "PostgreSQL", "React Router"],
    highlights: [
      "Role-based authentication architecture catering to Athletes, Coaches, and Gym Managers.",
      "Filtered registry covering martial arts disciplines, experience rankings, and geographic proximity.",
      "Training session booking request workflows and longitudinal training log tracking.",
    ],
    caseSections: [
      {
        id: "problem",
        title: "Problem Context",
        status: "documented",
        paragraphs: [
          "Martial arts communities lack unified tooling for finding vetted instructors in specialized disciplines (BJJ, Muay Thai, Judo) and recording verified training progress over time.",
          "DojoNation provides a focused web application for practitioners to discover certified coaching, schedule training sessions, and maintain immutable training histories.",
        ],
      },
      {
        id: "research",
        title: "Architecture Strategy & Trade-Offs",
        status: "documented",
        paragraphs: [
          "Instead of engineering custom authentication and relational infrastructure from scratch, I selected Supabase paired with PostgreSQL. This allowed us to leverage built-in Row-Level Security (RLS) policies directly within the relational database schema.",
        ],
        bullets: [
          "Vite + React SPA provides sub-second hot reload cycles and optimized static production chunks.",
          "Supabase Auth provides JWT session lifecycle management and custom role claim verification.",
          "PostgreSQL handles relational data for user profiles, session bookings, and martial art styles.",
        ],
      },
      {
        id: "architecture",
        title: "Client & Database Architecture",
        status: "documented",
        paragraphs: [
          "The client is structured as a feature-driven React and TypeScript application routed via React Router DOM. Ephemeral user session state is coordinated through React Context, while persistence is managed in Supabase PostgreSQL.",
        ],
        bullets: [
          "src/pages — Route views partitioned by user role (Athlete, Coach, Gym).",
          "src/components — Technical UI component system styled with Tailwind CSS.",
          "src/lib — Typed Supabase client abstractions and parameterized database queries.",
          "Database Schemas — Relational DDL versioned directly in supabase/schema.sql.",
        ],
      },
      {
        id: "implementation",
        title: "Implementation Details",
        status: "documented",
        paragraphs: [
          "The onboarding flow captures verified user role assignments. Profile views dynamically expose capabilities: session scheduling calendars for coaches and progression trackers for athletes.",
        ],
      },
      {
        id: "challenges",
        title: "Row-Level Security Architecture",
        status: "documented",
        paragraphs: [
          "Isolating athlete contact records from public search directories required fine-grained PostgreSQL RLS policies. Public user profiles surface martial art styles and credentials, while private session bookings are restricted strictly to confirmed participants.",
        ],
      },
      {
        id: "results",
        title: "Operational Results",
        status: "documented",
        paragraphs: [
          "Delivered an accessible web application providing reliable coach booking and responsive performance across mobile and desktop viewports.",
        ],
      },
      {
        id: "future",
        title: "Future Roadmap",
        status: "documented",
        paragraphs: [
          "Next iterations include iCalendar (.ics) synchronization for confirmed sessions and asynchronous video sparring review workflows.",
        ],
      },
    ],
  },
  {
    slug: "sudoku-solver",
    name: "Sudoku Solver",
    tagline: "High-performance backtracking constraint satisfaction solver written in modern C++.",
    role: "C++ Systems Engineer",
    period: "Jun 2024",
    status: "Published Systems Tool",
    repo: "https://github.com/pratikcoder01/Sudoku-Solver",
    diagram: null,
    stack: ["C++", "Algorithms", "Backtracking", "OOP", "Memory Management"],
    highlights: [
      "Recursive depth-first backtracking engine resolving 9x9 grids in under 5 milliseconds.",
      "Strict separation of board state representation, constraint verification, and terminal formatting.",
      "Zero external runtime dependencies; optimized 1D flat buffer indexing.",
    ],
    caseSections: [
      {
        id: "problem",
        title: "Problem & Search Space",
        status: "documented",
        paragraphs: [
          "Sudoku is an exact-cover NP-complete constraint satisfaction problem. A naive search traverses up to 9^81 possibilities. An optimal solver must prune unviable search branches immediately without redundant memory allocations.",
        ],
      },
      {
        id: "research",
        title: "Algorithm Pruning Strategy",
        status: "documented",
        paragraphs: [
          "Implemented depth-first recursive backtracking. Before exploring candidate assignments, row, column, and 3x3 box constraints are validated in O(1) time using bitmask-style checks, pruning invalid subtrees immediately.",
        ],
      },
      {
        id: "architecture",
        title: "Object-Oriented Design",
        status: "documented",
        paragraphs: [
          "Structured into distinct classes: SudokuBoard manages memory representation and validation rules, while Solver orchestrates the recursive placement loop.",
        ],
      },
      {
        id: "implementation",
        title: "Memory Layout & Implementation",
        status: "documented",
        paragraphs: [
          "Constructed using standard modern C++. Grid memory utilizes a contiguous 1D flat array to ensure CPU L1 cache locality, outperforming pointer-based multi-dimensional arrays.",
        ],
      },
      {
        id: "challenges",
        title: "Branch Elimination & Call-Stack Optimization",
        status: "documented",
        paragraphs: [
          "Minimizing recursive stack frame overhead was the primary performance focus. Passing references and executing early-exit validations kept stack depth tightly bounded.",
        ],
      },
      {
        id: "results",
        title: "Performance Verification",
        status: "documented",
        paragraphs: [
          "Demonstrated deterministic, instant solutions across complex benchmark puzzle datasets, verifying algorithmic correctness.",
        ],
      },
      {
        id: "future",
        title: "Algorithm X Extension",
        status: "documented",
        paragraphs: [
          "Roadmap includes implementing Donald Knuth's Dancing Links (Algorithm X) to explore exact-cover matrix benchmarks.",
        ],
      },
    ],
  },
  {
    slug: "number-guessing-game",
    name: "Number Guessing Game",
    tagline: "Interactive terminal application built in C++ featuring ANSI escape state manipulation.",
    role: "C++ Developer",
    period: "Jun 2024",
    status: "Published Terminal App",
    repo: "https://github.com/pratikcoder01/NUmber-gussing-game-",
    diagram: null,
    stack: ["C++", "Console I/O", "ANSI Escape Codes", "State Loops"],
    highlights: [
      "Deterministic game state loop featuring selectable difficulty tiers and dynamic range hints.",
      "Low-level ANSI escape code control for terminal screen clearing and cursor positioning.",
      "Stream buffer sanitization preventing crash loops on non-numeric user inputs.",
    ],
    caseSections: [
      {
        id: "problem",
        title: "Console UX & Input Sanitization",
        status: "documented",
        paragraphs: [
          "Standard terminal applications often suffer from poor stream buffer hygiene: invalid input characters lock cin streams, while raw text logging causes visual disorientation.",
        ],
      },
      {
        id: "research",
        title: "Terminal Manipulation",
        status: "documented",
        paragraphs: [
          "Utilized standardized ANSI escape sequences to clear screens, reset cursor positions, and format text colors without taking on heavy curses dependencies.",
        ],
      },
      {
        id: "architecture",
        title: "State Loop Architecture",
        status: "documented",
        paragraphs: [
          "Organized as a finite state loop: initiation and difficulty configuration, target generation, guess evaluation with directional hints, and session replay evaluation.",
        ],
      },
      {
        id: "implementation",
        title: "Stream Hardening",
        status: "documented",
        paragraphs: [
          "Implemented defensive stream clearing using std::cin.clear() and std::cin.ignore(numeric_limits::max()) to gracefully recover from invalid keystrokes.",
        ],
      },
      {
        id: "challenges",
        title: "Cross-Platform Terminal Compatibility",
        status: "documented",
        paragraphs: [
          "Ensuring consistent ANSI sequence execution across modern Windows PowerShell, macOS zsh, and Linux bash terminal emulators.",
        ],
      },
      {
        id: "results",
        title: "Verification",
        status: "documented",
        paragraphs: [
          "Delivered a dependable console application demonstrating clean terminal UX design and resilient stream handling.",
        ],
      },
      {
        id: "future",
        title: "Extensions",
        status: "documented",
        paragraphs: [
          "Future additions include file-based score logging and networked socket turn-taking.",
        ],
      },
    ],
  },
];

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Navigation Landmark Sections                                       */
/* ------------------------------------------------------------------ */

export const sections = [
  { id: "work", label: "Selected Work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;
