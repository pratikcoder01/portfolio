// Responsive + rendering audit.
// Usage: node qa/responsive.mjs [baseUrl]
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.argv[2] ?? "http://localhost:3100";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "screenshots");
const WIDTHS = [360, 390, 768, 1024, 1440, 1920];
const THEMES = ["dark", "light"];
const PAGES = [
  { path: "/", name: "home" },
  { path: "/projects/athlix", name: "case-athlix" },
  { path: "/projects/platecam", name: "case-platecam" },
  { path: "/projects/dojo-nation", name: "case-dojo-nation" },
  { path: "/this-route-does-not-exist", name: "not-found" },
];

const inPageAudit = () => {
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r, g, b, a = "1"] = m[1].split(",").map((s) => parseFloat(s.trim()));
    return { r, g, b, a: parseFloat(a) };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (fg, bg) => {
    const [l1, l2] = [lum(fg), lum(bg)].sort((a, b) => b - a);
    return (l1 + 0.05) / (l2 + 0.05);
  };

  const viewportW = window.innerWidth;
  const overflow = [];
  const clipped = [];
  const contrast = [];

  // Composite the real backdrop for a node: every semi-transparent background
  // between it and the body, layered over the body colour. Hardcoding one
  // fallback would be wrong the moment the page has two palettes.
  const resolveBg = (node) => {
    const layers = [];
    for (let el = node; el; el = el.parentElement) {
      const c = parse(getComputedStyle(el).backgroundColor);
      if (c && c.a > 0) {
        layers.push(c);
        if (c.a >= 1) break;
      }
      if (!el.parentElement) break;
    }
    const base = parse(getComputedStyle(document.body).backgroundColor) ?? { r: 255, g: 255, b: 255, a: 1 };
    let out = { r: base.r, g: base.g, b: base.b };
    for (let i = layers.length - 1; i >= 0; i--) {
      const l = layers[i];
      const a = Math.min(1, Math.max(0, l.a));
      out = {
        r: l.r * a + out.r * (1 - a),
        g: l.g * a + out.g * (1 - a),
        b: l.b * a + out.b * (1 - a),
      };
    }
    return out;
  };
  const flatten = (fg, bg) => (fg.a >= 1 ? fg : {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
  });

  // A deliberate horizontal scroller (the architecture diagrams) is allowed to
  // hold wider content; only the document itself must never scroll sideways.
  const inScroller = (node) => {
    for (let el = node?.parentElement; el; el = el.parentElement) {
      if (/auto|scroll/.test(getComputedStyle(el).overflowX)) return true;
    }
    return false;
  };

  for (const el of document.querySelectorAll("body *")) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    if (el.closest("[aria-hidden=true]") && !el.textContent?.trim()) continue;

    // 1. anything extending past the right edge of the viewport
    if (rect.right > viewportW + 1.5 && rect.left >= 0 && !inScroller(el)) {
      overflow.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || "").toString().slice(0, 70),
        right: Math.round(rect.right),
        text: (el.textContent || "").trim().slice(0, 50),
      });
    }

    // 2. text clipped by its own box. Visually-hidden helpers (sr-only, the
    // resting skip link) are 1px by design, so they are not findings.
    const style = getComputedStyle(el);
    const hiddenByDesign =
      /\b(sr-only|skip-link)\b/.test(el.className?.toString() ?? "") ||
      (style.position === "absolute" && rect.width <= 1.5 && rect.height <= 1.5);
    const hides = /hidden|clip/.test(style.overflowX + " " + style.overflowY);
    if (hides && !hiddenByDesign && el.children.length === 0 && el.textContent?.trim()) {
      if (el.scrollWidth > el.clientWidth + 2) {
        clipped.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || "").toString().slice(0, 70),
          scrollW: el.scrollWidth,
          clientW: el.clientWidth,
          text: el.textContent.trim().slice(0, 50),
        });
      }
    }

    // 3. contrast of rendered text against its resolved background.
    //    Decorative text (aria-hidden) carries no meaning, so WCAG 1.4.3 does not
    //    apply to it — the oversized quote glyph behind the pull-quote is one.
    const text = el.textContent?.trim();
    if (!text || el.children.length > 0 || hiddenByDesign) continue;
    if (el.closest("[aria-hidden=true]")) continue;
    {
      const color = parse(style.color);
      if (!color) continue;
      const bg = resolveBg(el);
      const fg = flatten(color, bg);
      const size = parseFloat(style.fontSize);
      const bold = parseInt(style.fontWeight || "400", 10) >= 700;
      const large = size >= 24 || (bold && size >= 18.66);
      const need = large ? 3 : 4.5;
      const got = ratio(fg, bg);
      if (got < need) {
        contrast.push({
          text: text.slice(0, 40),
          size,
          need,
          got: Math.round(got * 100) / 100,
          color: style.color,
          theme: document.documentElement.getAttribute("data-theme"),
          bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
        });
      }
    }
  }

  return {
    docScrollW: document.documentElement.scrollWidth,
    viewportW,
    overflow: overflow.slice(0, 12),
    clipped: clipped.slice(0, 12),
    contrast: contrast.slice(0, 20),
    hOverflow: document.documentElement.scrollWidth > viewportW + 1,
  };
};

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const problems = [];
const consoleErrors = new Set();

for (const page of PAGES) {
  const widths = page.name === "home" ? WIDTHS : [390, 1440];
  for (const theme of THEMES) {
    for (const width of widths) {
      const ctx = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
        isMobile: width < 500,
        hasTouch: width < 500,
        reducedMotion: "reduce",
        colorScheme: theme === "light" ? "light" : "dark",
      });
      // The palette is chosen by a pre-paint script from localStorage, so the
      // audit has to seed storage rather than click the toggle.
      await ctx.addInitScript(([key, value]) => {
        try {
          localStorage.setItem(key, value);
        } catch {
          /* ignore */
        }
      }, ["pn-theme", theme]);
      const p = await ctx.newPage();
      p.on("console", (m) => {
        if (m.type() !== "error") return;
        // The 404 route answers with a 404 status; that log line is the document
        // response, not a defect.
        if (page.name === "not-found" && /404 \(Not Found\)/.test(m.text())) return;
        consoleErrors.add(`${page.path} [${theme}] :: ${m.text()}`);
      });
      p.on("pageerror", (e) => consoleErrors.add(`${page.path} [${theme}] :: PAGEERROR ${e.message}`));

      await p.goto(`${BASE}${page.path}`, { waitUntil: "load" });
      await p.waitForTimeout(700);
      await p.evaluate(() => document.fonts.ready);

      const applied = await p.evaluate(() => document.documentElement.getAttribute("data-theme"));
      if (applied !== theme) problems.push(`${page.name}@${width} [${theme}]: bootstrap applied "${applied}"`);

      const result = await p.evaluate(inPageAudit);
      const label = `${page.name}@${width}-${theme}`;
      if (result.hOverflow) problems.push(`${label}: document scrollWidth ${result.docScrollW} > ${result.viewportW}`);
      for (const o of result.overflow) problems.push(`${label} OVERFLOW ${JSON.stringify(o)}`);
      for (const c of result.clipped) problems.push(`${label} CLIPPED ${JSON.stringify(c)}`);
      for (const c of result.contrast) problems.push(`${label} CONTRAST ${JSON.stringify(c)}`);

      await p.screenshot({ path: join(OUT, `${label}.png`), fullPage: true });
      await ctx.close();
    }
  }
}

await browser.close();

console.log(`\n--- console / page errors (${consoleErrors.size}) ---`);
[...consoleErrors].forEach((e) => console.log(e));
console.log(`\n--- layout & contrast problems (${problems.length}) ---`);
problems.slice(0, 60).forEach((p) => console.log(p));
console.log(problems.length ? "" : "none");
process.exit(problems.length || consoleErrors.size ? 1 : 0);
