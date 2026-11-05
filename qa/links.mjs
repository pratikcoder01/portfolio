// Link, anchor and route verification.
// Usage: node qa/links.mjs [baseUrl]
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3100";
const ROUTES = ["/", "/projects/athlix", "/projects/platecam", "/projects/dojo-nation", "/projects/sudoku-solver", "/projects/number-guessing-game"];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const anchors = new Map();
const hashTargets = [];

for (const route of ROUTES) {
  await page.goto(`${BASE}${route}`, { waitUntil: "load" });
  const found = await page.evaluate(() =>
    [...document.querySelectorAll("a[href]")].map((a) => ({
      href: a.getAttribute("href"),
      text: (a.textContent || "").trim().slice(0, 40),
      external: a.target === "_blank" || /^https?:/.test(a.getAttribute("href") ?? ""),
    })),
  );
  for (const f of found) {
    const key = f.href.startsWith("/") && !f.href.startsWith("//") ? f.href : f.href;
    if (!anchors.has(key)) anchors.set(key, f.text);
    if (f.href.includes("#")) hashTargets.push({ from: route, ...f });
  }
}

const failures = [];
const inconclusive = [];
const results = [];

for (const [href, text] of anchors) {
  if (href.startsWith("mailto:")) {
    results.push(`mailto  ${href}`);
    continue;
  }
  const isPureHash = href.startsWith("#");
  const isInternalPage = (href.startsWith("/") && !href.startsWith("//")) || isPureHash;
  const url = isInternalPage ? `${BASE}${href.split("#")[0] || "/"}` : href;

  if (isPureHash) {
    // Nothing to fetch: the anchor loop below proves the target id exists.
    results.push(`anchor  ${href}  (${text})`);
    continue;
  }

  if (isInternalPage) {
    const res = await ctx.request
      .get(url, { timeout: 15000 })
      .then((r) => r.status())
      .catch(() => null);
    results.push(`${res}     ${href}  (${text})`);
    if (res === null || res >= 400) failures.push(`${href} -> ${res ?? "no response"}`);
    continue;
  }

  // External links: in-page fetch() is blocked by CORS, so use Playwright's
  // request context (no same-origin rule). Sites that gate bots get a second
  // chance through a real browser navigation on a throwaway page before being
  // called a failure - the main page must stay on this origin for the anchor
  // checks that follow.
  let status = await ctx.request
    .get(url, { maxRedirects: 5, timeout: 20000 })
    .then((r) => r.status())
    .catch(() => null);

  if (status === null || status >= 400) {
    const probe = await ctx.newPage();
    const viaNav = await probe
      .goto(url, { waitUntil: "domcontentloaded", timeout: 25000 })
      .then((r) => r?.status() ?? null)
      .catch(() => null);
    await probe.close();
    if (viaNav !== null && viaNav < 400) {
      results.push(`${status}/${viaNav}  ${href}  (${text})  [request blocked, browser navigation ok]`);
      continue;
    }
    if (viaNav !== null) {
      // LinkedIn answers 999/429 to every unauthenticated client, headless or
      // not; that is their bot gate, not a dead link. Report it as unverifiable
      // instead of pretending it passed or failed.
      const gated = /linkedin\.com/.test(url) && [403, 429, 999].includes(status);
      results.push(
        `${viaNav}   ${href}  (${text})${gated ? "  [bot-gated by LinkedIn - unverifiable headlessly]" : "  [browser navigation]"}`,
      );
      if (gated) inconclusive.push(`${href} -> ${status} from LinkedIn's bot gate`);
      else failures.push(`${href} -> ${status} via request, ${viaNav} via browser navigation`);
      continue;
    }
    failures.push(`${href} -> ${status ?? "no response"} and browser navigation failed`);
    results.push(`ERR   ${href}`);
    continue;
  }

  results.push(`${status}    ${href}  (${text})`);
}

// Hash anchors must resolve to an element on the destination page.
const checked = new Set();
for (const t of hashTargets) {
  const hashIndex = t.href.indexOf("#");
  const id = t.href.slice(hashIndex + 1);
  if (!id) continue;
  const before = t.href.slice(0, hashIndex);
  const dest = t.href.startsWith("#") ? t.from : before || "/";
  const key = `${dest}#${id}`;
  if (checked.has(key)) continue;
  checked.add(key);

  await page.goto(`${BASE}${dest}`, { waitUntil: "load" });
  const exists = await page.evaluate((target) => Boolean(document.getElementById(target)), id);
  if (!exists) failures.push(`anchor ${key} linked from ${t.from} does not exist`);
}

// Metadata + generated routes.
for (const route of ["/sitemap.xml", "/robots.txt", "/icon.svg", "/opengraph-image", "/404-check-me"]) {
  const res = await ctx.request
    .get(`${BASE}${route}`, { timeout: 15000 })
    .then((r) => ({ status: r.status(), type: r.headers()["content-type"] }))
    .catch(() => ({ status: null, type: null }));
  results.push(`${res.status}    ${route}  ${res.type}`);
  if (res.status === null || (route === "/404-check-me" ? res.status !== 404 : res.status >= 400)) {
    failures.push(`${route} -> ${res.status} (expected ${route === "/404-check-me" ? 404 : "<400"})`);
  }
}

await page.goto(`${BASE}/`, { waitUntil: "load" });
const meta = await page.evaluate(() => ({
  og: document.querySelector('meta[property="og:image"]')?.content ?? null,
  ogType: document.querySelector('meta[property="og:type"]')?.content ?? null,
  twitter: document.querySelector('meta[name="twitter:card"]')?.content ?? null,
  canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
  description: document.querySelector('meta[name="description"]')?.content?.length ?? 0,
  lang: document.documentElement.lang,
  title: document.title,
  h1: document.querySelectorAll("h1").length,
  landmarks: ["header", "main", "footer", "nav"].map(
    (t) => `${t}:${document.querySelectorAll(t).length}`,
  ),
  skipLink: document.querySelector('a[href="#main"]')?.className ?? null,
}));

await browser.close();

console.log("\n--- link status ---");
results.forEach((r) => console.log(r));
console.log("\n--- head / landmarks ---");
console.log(JSON.stringify(meta, null, 2));
console.log(`\n--- unverifiable (${inconclusive.length}) ---`);
inconclusive.forEach((f) => console.log(f));
console.log(`\n--- failures (${failures.length}) ---`);
failures.forEach((f) => console.log(f));
process.exit(failures.length ? 1 : 0);
