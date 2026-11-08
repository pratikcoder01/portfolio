import fs from "fs";
import path from "path";
import type { NextConfig } from "next";

const hasResume = fs.existsSync(path.join(process.cwd(), "public", "resume.pdf"));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A stray lockfile exists in the home directory; pin tracing to this project.
  outputFileTracingRoot: process.cwd(),
  env: {
    NEXT_PUBLIC_HAS_RESUME: hasResume ? "true" : "false",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
