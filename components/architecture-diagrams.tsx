/**
 * Inline SVG architecture diagrams.
 * Designed with a clean, technical blueprint aesthetic:
 * sharp micro-radii, monospace protocol/port labels, structured hierarchies, and crisp orthogonal edges.
 */

const TITLE = { fontSize: 12, fontWeight: 600, fill: "var(--fg)", letterSpacing: "0.01em" } as const;
const SUB = { fontSize: 9.5, fill: "var(--fg-muted)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" } as const;
const LABEL = { fontSize: 9, fill: "rgb(var(--volt-rgb))", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontWeight: 600, letterSpacing: "0.04em" } as const;

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string[];
  dashed?: boolean;
}

function Box({ x, y, w, h, title, sub = [], dashed }: BoxProps) {
  const cx = x + w / 2;
  const titleY = sub.length ? y + 22 : y + h / 2 + 4;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={2}
        fill="var(--bg-card)"
        stroke={dashed ? "rgb(var(--volt-rgb) / 0.55)" : "var(--line-strong)"}
        strokeWidth={1}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <text x={cx} y={titleY} textAnchor="middle" style={TITLE}>
        {title}
      </text>
      {sub.map((line, i) => (
        <text key={line} x={cx} y={y + 38 + i * 13} textAnchor="middle" style={SUB}>
          {line}
        </text>
      ))}
    </g>
  );
}

interface EdgeProps {
  d: string;
  uid: string;
  dashed?: boolean;
  bidirectional?: boolean;
  label?: string;
  labelX?: number;
  labelY?: number;
}

function Edge({ d, uid, dashed, bidirectional, label, labelX = 0, labelY = 0 }: EdgeProps) {
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke="rgb(var(--volt-rgb) / 0.75)"
        strokeWidth={1.25}
        strokeDasharray={dashed ? "3 3" : undefined}
        markerEnd={`url(#tip-${uid})`}
        markerStart={bidirectional ? `url(#tip-${uid})` : undefined}
      />
      {label ? (
        <text x={labelX} y={labelY} style={LABEL}>
          {label}
        </text>
      ) : null}
    </g>
  );
}

function Frame({
  uid,
  viewBox,
  title,
  desc,
  children,
}: {
  uid: string;
  viewBox: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-labelledby={`${uid}-title ${uid}-desc`}
      className="h-auto w-full max-w-[46rem]"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <title id={`${uid}-title`}>{title}</title>
      <desc id={`${uid}-desc`}>{desc}</desc>
      <defs>
        <marker
          id={`tip-${uid}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="rgb(var(--volt-rgb) / 0.75)" />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

export function AthlixDiagram() {
  const uid = "athlix";
  return (
    <Frame
      uid={uid}
      viewBox="0 0 620 440"
      title="Athlix architecture"
      desc="A browser client loads the Next.js 15 client, which exchanges REST requests and Socket.io events with an Express TypeScript API. The API reads and writes MongoDB Atlas and uploads media to Cloudinary. A client-side Kata Analyzer uses MediaPipe, and repository docs hold the database and API contracts."
    >
      <Box x={20} y={8} w={340} h={56} title="Athlete · Coach · Gym · Organiser" />
      <Box
        x={20}
        y={112}
        w={340}
        h={72}
        title="Next.js 15 Client"
        sub={["React 19 · TypeScript · App Router", "TanStack Query · Zustand · Zod"]}
      />
      <Box
        x={20}
        y={232}
        w={340}
        h={72}
        title="Express + TypeScript API"
        sub={["JWT + bcrypt", "Node.js runtime"]}
      />
      <Box x={20} y={352} w={160} h={68} title="MongoDB Atlas" sub={["Mongoose Schemas"]} />
      <Box x={200} y={352} w={160} h={68} title="Cloudinary" sub={["Multer uploads"]} />
      <Box
        x={400}
        y={112}
        w={200}
        h={72}
        title="Kata Analyzer"
        sub={["MediaPipe 2D pose", "Client-side biomechanics"]}
        dashed
      />
      <Box
        x={400}
        y={232}
        w={200}
        h={72}
        title="Socket.io Channels"
        sub={["Social feed updates", "Tournament brackets"]}
        dashed
      />
      <Box
        x={400}
        y={352}
        w={200}
        h={68}
        title="Docs & Contracts"
        sub={["db_design · api_map", "setup_guide"]}
        dashed
      />

      <Edge uid={uid} d="M 190 64 V 112" label="loads" labelX={198} labelY={92} />
      <Edge uid={uid} d="M 150 184 V 232" label="REST" labelX={100} labelY={212} />
      <Edge uid={uid} d="M 250 232 V 184" label="events" labelX={258} labelY={212} />
      <Edge uid={uid} d="M 360 148 H 400" dashed />
      <Edge uid={uid} d="M 360 268 H 400" bidirectional />
      <Edge uid={uid} d="M 110 304 V 352" label="read / write" labelX={20} labelY={332} />
      <Edge uid={uid} d="M 300 304 V 352" label="upload" labelX={308} labelY={332} />
      <Edge uid={uid} d="M 360 288 H 380 V 386 H 400" dashed />
    </Frame>
  );
}

export function PlateCamDiagram() {
  const uid = "platecam";
  return (
    <Frame
      uid={uid}
      viewBox="0 0 620 250"
      title="PlateCam pipeline"
      desc="An image enters OpenCV detection, which locates the plate. EasyOCR extracts the plate text. A REST API serves the result to a mobile app. The README states real-time use, edge deployment and cross-platform compatibility as design targets."
    >
      <Box x={16} y={16} w={110} h={76} title="Input Frame" sub={["Image buffer"]} />
      <Box x={166} y={16} w={160} h={76} title="OpenCV" sub={["Contour detection", "Plate localization"]} />
      <Box x={366} y={16} w={140} h={76} title="EasyOCR" sub={["Text extraction"]} />
      <Box x={366} y={150} w={140} h={76} title="REST API" sub={["JSON response"]} />
      <Box x={166} y={150} w={160} h={76} title="Client App" sub={["Integration", "via HTTP API"]} dashed />
      <Box
        x={16}
        y={150}
        w={110}
        h={76}
        title="Target"
        sub={["Low-latency", "Edge deploy"]}
        dashed
      />

      <Edge uid={uid} d="M 126 54 H 166" />
      <Edge uid={uid} d="M 326 54 H 366" />
      <Edge uid={uid} d="M 436 92 V 150" label="HTTP payload" labelX={444} labelY={126} />
      <Edge uid={uid} d="M 366 188 H 326" />
    </Frame>
  );
}

export function DojoNationDiagram() {
  const uid = "dojonation";
  return (
    <Frame
      uid={uid}
      viewBox="0 0 620 312"
      title="DojoNation architecture"
      desc="Users reach a React and TypeScript single page app built with Vite, routed by React Router DOM and styled with Tailwind CSS. React Context holds global state. The app authenticates through Supabase Auth and queries a Postgres database whose schema lives in supabase/schema.sql."
    >
      <Box x={20} y={8} w={340} h={56} title="Athlete · Coach · Gym" />
      <Box
        x={20}
        y={104}
        w={340}
        h={72}
        title="React + TypeScript SPA"
        sub={["Vite build · React Router DOM", "Tailwind CSS"]}
      />
      <Box x={20} y={224} w={160} h={68} title="Supabase Auth" sub={["Role-based JWT"]} />
      <Box x={200} y={224} w={160} h={68} title="PostgreSQL" sub={["schema.sql with RLS"]} />
      <Box x={400} y={104} w={200} h={72} title="React Context" sub={["Client session state"]} dashed />
      <Box
        x={400}
        y={224}
        w={200}
        h={68}
        title="Core Features"
        sub={["Directory · Booking", "Training logs"]}
        dashed
      />

      <Edge uid={uid} d="M 190 64 V 104" label="signs in" labelX={198} labelY={88} />
      <Edge uid={uid} d="M 360 140 H 400" dashed />
      <Edge uid={uid} d="M 110 176 V 224" label="auth" labelX={62} labelY={204} />
      <Edge uid={uid} d="M 300 176 V 224" label="queries" labelX={308} labelY={204} />
      <Edge uid={uid} d="M 380 176 V 258 H 400" dashed />
    </Frame>
  );
}

export const diagrams = {
  athlix: AthlixDiagram,
  platecam: PlateCamDiagram,
  "dojo-nation": DojoNationDiagram,
} as const;
