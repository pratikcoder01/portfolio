// Lighthouse runner: mobile + desktop, prints measured category scores.
// Usage: node qa/lighthouse.mjs [baseUrl]
import { execFileSync } from "node:child_process";
import { mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3100";
const HERE = dirname(fileURLToPath(import.meta.url));
const REPORTS = join(HERE, "reports");
await mkdir(REPORTS, { recursive: true });

process.env.CHROME_PATH = chromium.executablePath();
console.log("chrome:", process.env.CHROME_PATH);

const run = (label, extra) => {
  const out = join(REPORTS, `${label}`);
  execFileSync(
    "npx",
    [
      "lighthouse",
      BASE,
      `--output=json`,
      `--output=html`,
      `--output-path=${out}`,
      `--only-categories=performance,accessibility,best-practices,seo`,
      `--chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage"`,
      "--quiet",
      "--no-upload",
      ...extra,
    ].filter(Boolean),
    { stdio: "inherit", shell: true },
  );
  return readFile(`${out}.report.json`, "utf8");
};

const targets = { Performance: 90, Accessibility: 95, "Best Practices": 95, SEO: 95 };

for (const [label, extra] of [
  ["mobile", ["--form-factor=mobile"]],
  ["desktop", ["--preset=desktop"]],
]) {
  const raw = await run(label, extra);
  const report = JSON.parse(raw);
  console.log(`\n=== ${label} (${report.finalDisplayedFormFactor ?? report.configSettings.formFactor}) ${report.lighthouseVersion} ===`);
  for (const [key, cat] of Object.entries(report.categories)) {
    const score = Math.round(cat.score * 100);
    const target = targets[key] ?? 90;
    console.log(`${score.toString().padStart(3)} / ${target}  ${key}`);
  }
  const failing = Object.entries(report.audits)
    .filter(([, a]) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode === "binary")
    .slice(0, 14)
    .map(([k, a]) => `${k} (${a.score})`);
  console.log(`failing audits: ${failing.join(", ") || "none"}`);
}
