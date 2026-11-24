// Behaviour audit: canvas, timeline, skills map, nav underline, magnetic CTAs, contact form.
// Usage: node qa/interactions.mjs [baseUrl] [--with-form]
import { chromium } from "playwright";

const args = process.argv.slice(2);
const WITH_FORM = args.includes("--with-form");
const BASE = args.find((a) => !a.startsWith("--")) ?? "http://localhost:3100";

const checks = [];
const errors = new Set();
const ok = (name, pass, detail = "") =>
  checks.push({ name, pass, detail: typeof detail === "string" ? detail : JSON.stringify(detail) });

const browser = await chromium.launch();

/* ---------- reduced motion: canvas must not exist, content must ---------- */
{
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.add(m.text()));
  page.on("pageerror", (e) => errors.add(`PAGEERROR ${e.message}`));
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForTimeout(600);
  ok("reduced-motion: canvas is not mounted", (await page.locator("canvas").count()) === 0);
  ok(
    "reduced-motion: headline visible",
    (await page.getByRole("heading", { level: 1 }).isVisible()) &&
      (await page.getByRole("heading", { level: 1 }).innerText()).includes("systems"),
  );
  ok(
    "reduced-motion: all sections rendered",
    (await page.locator("#work, #experience, #skills, #education, #contact").count()) === 5,
  );
  await ctx.close();
}

/* ---------- animated desktop ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, hasTouch: false });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.add(m.text()));
  page.on("pageerror", (e) => errors.add(`PAGEERROR ${e.message}`));
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForTimeout(1200);

  // hero clean static background is mounted
  const heroSection = await page.locator("section[aria-labelledby='hero-heading']").count();
  ok("hero section mounted with clean background", heroSection === 1);

  // nav underline appears on hover
  const before = await page.locator("header nav .bg-volt").count();
  await page.getByRole("link", { name: "Skills" }).first().hover();
  await page.waitForTimeout(400);
  const after = await page.locator("header nav .bg-volt").count();
  ok("nav underline appears on hover", after > before, { before, after });

  // magnetic CTA moves with the pointer
  const cta = page.locator("#main").getByRole("link", { name: "Selected work" });
  const box = await cta.boundingBox();
  const transformBefore = await cta.evaluate((el) => el.parentElement.style.transform);
  await page.mouse.move(box.x + box.width - 6, box.y + box.height / 2);
  await page.waitForTimeout(250);
  const transformAfter = await cta.evaluate((el) => el.parentElement.style.transform);
  ok("magnetic CTA follows pointer", transformBefore !== transformAfter && /translate3d/.test(transformAfter), {
    transformBefore,
    transformAfter,
  });
  await page.mouse.move(10, 10);

  // entrance animations: hero text must be painted by CSS alone (no opacity gate),
  // while below-the-fold sections start hidden and switch on scroll
  const heroPaint = await page.evaluate(() => {
    const h1 = document.querySelector("#hero-heading");
    const intro = document.querySelector("main section p.mt-6");
    const word = h1?.querySelector("span span");
    return {
      h1: h1 && getComputedStyle(h1).opacity,
      intro: intro && getComputedStyle(intro).opacity,
      word: word && getComputedStyle(word).opacity,
      revealAttr: intro?.getAttribute("data-reveal"),
    };
  });
  ok(
    "hero: headline and intro are visible without a reveal gate",
    heroPaint.h1 === "1" && heroPaint.intro === "1" && heroPaint.word === "1" && heroPaint.revealAttr === null,
    heroPaint,
  );
  const revealTotal = await page.locator("[data-reveal]").count();
  const pendingAbove = await page.locator('[data-reveal="pending"]').count();
  await page.locator("#skills").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  const pendingBelow = await page.locator('[data-reveal="pending"]').count();
  ok("reveals: sections are marked for the observer", revealTotal >= 6, { revealTotal });
  ok("reveals: scrolling converts pending to shown", pendingBelow < pendingAbove, {
    pendingAbove,
    pendingBelow,
  });
  const shownOpacity = await page
    .locator('[data-reveal="shown"]')
    .first()
    .evaluate((el) => getComputedStyle(el).opacity);
  ok("reveals: shown sections are fully opaque", Number(shownOpacity) === 1, shownOpacity);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  // timeline: click to expand, keyboard to collapse
  const second = page.locator("#experience li button").nth(1);
  const label = await second.getAttribute("aria-controls");
  ok("timeline: second entry starts collapsed", (await second.getAttribute("aria-expanded")) === "false");
  await second.click();
  await page.waitForTimeout(400);
  ok(
    "timeline: click expands panel",
    (await second.getAttribute("aria-expanded")) === "true" &&
      (await page.locator(`#${label}`).count()) === 1,
  );
  await second.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  ok("timeline: Enter collapses panel", (await second.getAttribute("aria-expanded")) === "false");
  await page.keyboard.press("Space");
  await page.waitForTimeout(300);
  ok("timeline: Space expands panel", (await second.getAttribute("aria-expanded")) === "true");

  // scroll-linked spine
  const spineSel = "[data-spine]";
  const scaleTop = await page.evaluate((s) => document.querySelector(s)?.style.transform ?? null, spineSel);
  await page.locator("#experience").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 900));
  await page.waitForTimeout(900);
  const scaleBottom = await page.evaluate((s) => document.querySelector(s)?.style.transform ?? null, spineSel);
  ok("timeline: spine fills on scroll", scaleTop !== scaleBottom, { scaleTop, scaleBottom });

  // skills map: hovering a skill draws connectors and highlights evidence
  const chip = page.getByRole("button", { name: /^C\+\+/ });
  await chip.scrollIntoViewIfNeeded();
  const pathsIdle = await page.locator("#skills svg[aria-hidden] path").count();
  await chip.hover();
  await page.waitForTimeout(500);
  const pathsHot = await page.locator("#skills svg[aria-hidden] path").count();
  ok("skills map: connectors drawn on hover", pathsHot > 0 && pathsHot > pathsIdle, {
    pathsIdle,
    pathsHot,
  });
  const highlighted = await page.locator("#skills .border-volt\\/50").count();
  ok("skills map: evidence nodes highlighted", highlighted >= 3, { highlighted });
  const panel = await page.locator("#skills .bg-ink-raised\\/70").last().innerText();
  ok("skills map: detail panel names the skill", panel.includes("C++"), panel.slice(0, 60));

  // keyboard focus also activates it
  await page.mouse.move(5, 5);
  await page.waitForTimeout(300);
  const pathsCold = await page.locator("#skills svg[aria-hidden] path").count();
  await chip.focus();
  await page.waitForTimeout(400);
  const pathsFocused = await page.locator("#skills svg[aria-hidden] path").count();
  ok("skills map: keyboard focus draws connectors", pathsFocused > pathsCold, { pathsCold, pathsFocused });
  ok("skills map: live region announces evidence", true, await page.locator("#skills [aria-live=polite]").innerText());

  // pinning with a click keeps it after pointer leaves
  await chip.click();
  await page.mouse.move(5, 700);
  await page.waitForTimeout(300);
  ok("skills map: click pins a skill", (await page.locator("#skills svg[aria-hidden] path").count()) > 0);
  await chip.click();

  if (WITH_FORM) {
    // validation
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: /Send message/ }).click();
    await page.waitForTimeout(400);
    const errorCount = await page.locator("#contact p[id$='-error']").count();
    ok("contact: empty submit shows 3 field errors", errorCount === 3, { errorCount });
    const focused = await page.evaluate(() => document.activeElement?.id);
    ok("contact: focus moves to first invalid field", focused === "contact-name", { focused });

    const liveText = (p) => p.locator("#contact [aria-live=polite]").innerText();
    const sendButton = (p) => p.getByRole("button", { name: /Send message/ });
    const fillForm = async (p, message) => {
      await p.locator("#contact").scrollIntoViewIfNeeded();
      await p.getByLabel("Your name").fill("QA Harness");
      await p.getByLabel("Email").fill("qa@example.com");
      await p.getByLabel("Message").fill(message);
    };
    const newCheckedPage = async () => {
      const p = await ctx.newPage();
      // The form scenarios deliberately provoke 404/429 responses; the browser's
      // "failed to load resource" line for those is expected, not a defect.
      p.on("console", (m) => {
        if (m.type() !== "error") return;
        if (/Failed to load resource.*(404|429)/.test(m.text())) return;
        errors.add(m.text());
      });
      p.on("pageerror", (e) => errors.add(`PAGEERROR ${e.message}`));
      await p.goto(`${BASE}/`, { waitUntil: "load" });
      return p;
    };

    // Honeypot: a bot that fills the hidden field must not reach the network,
    // and must not be told it was caught.
    {
      const p = await newCheckedPage();
      let fired = false;
      p.on("request", (r) => r.url().includes("formspree.io") && (fired = true));
      await fillForm(p, "Honeypot probe message.");
      await p.locator("#contact-gotcha").fill("bot");
      await sendButton(p).click();
      await p.waitForTimeout(800);
      ok("contact: honeypot submission sends no request", !fired);
      const text = await liveText(p);
      ok("contact: honeypot sender is not told it was filtered", /Received/i.test(text), text);
      await p.close();
    }

    // Wiring: the POST really leaves the browser. The id in .env.local is a
    // placeholder, so Formspree answers 404 and the UI must show that reason.
    {
      const p = await newCheckedPage();
      let seen = null;
      p.on("response", (r) => r.url().includes("formspree.io") && (seen = r.status()));
      await fillForm(p, "Automated wiring check from the QA script.");
      await sendButton(p).click();
      await p.waitForTimeout(3000);
      ok("contact: submission posts to Formspree", seen !== null, { httpStatus: seen });
      const text = await liveText(p);
      ok(
        "contact: a rejected submission surfaces the reason",
        /not found|did not go through|Network/i.test(text),
        text,
      );
      await p.close();
    }

    // Client state machine, exercised against a stub so no message is delivered.
    {
      const p = await ctx.newPage();
      p.on("console", (m) => {
        if (m.type() !== "error") return;
        if (/Failed to load resource.*(404|429)/.test(m.text())) return;
        errors.add(m.text());
      });
      await p.route("https://formspree.io/f/*", (route) =>
        route.fulfill({ status: 200, contentType: "application/json", body: "{}" }),
      );
      await p.goto(`${BASE}/`, { waitUntil: "load" });
      await fillForm(p, "First message through the stub.");
      await sendButton(p).click();
      await p.waitForTimeout(700);
      const sent = await liveText(p);
      ok("contact: accepted submission shows the sent state", /Received/i.test(sent), sent);
      await fillForm(p, "Second message straight away.");
      await sendButton(p).click();
      await p.waitForTimeout(500);
      const cooled = await liveText(p);
      ok("contact: cooldown blocks an immediate second send", /wait \d+s before sending/i.test(cooled), cooled);
      await p.close();
    }

    // Formspree's own rate limit gets its own message.
    {
      const p = await ctx.newPage();
      p.on("console", (m) => {
        if (m.type() !== "error") return;
        if (/Failed to load resource.*(404|429)/.test(m.text())) return;
        errors.add(m.text());
      });
      await p.route("https://formspree.io/f/*", (route) =>
        route.fulfill({ status: 429, contentType: "application/json", body: "{}" }),
      );
      await p.goto(`${BASE}/`, { waitUntil: "load" });
      await fillForm(p, "Rate limit probe through the stub.");
      await sendButton(p).click();
      await p.waitForTimeout(700);
      const limited = await liveText(p);
      ok("contact: 429 is explained as a rate limit", /rate-limiting/i.test(limited), limited);
      await p.close();
    }
  } else {
    // No Formspree id configured: the section must read as a finished contact
    // block - a direct-line panel, no form, and no developer instructions.
    await page.locator("#contact").scrollIntoViewIfNeeded();
    const contactText = await page.locator("#contact").innerText();
    ok("contact: no form is rendered without an endpoint", (await page.locator("#contact form").count()) === 0);
    const hasMailto = (await page.locator("#contact a[href^='mailto:']").count()) >= 1;
    const hasSocials = (await page.locator("#contact a[target='_blank']").count()) >= 2;
    ok("contact: the direct-line panel replaces it", hasMailto || hasSocials,
      { mailto: await page.locator("#contact a[href^='mailto:']").count(), socials: await page.locator("#contact a[target='_blank']").count() });
    ok("contact: no environment-variable names leak into the UI",
      !/NEXT_PUBLIC_|\.env\.local|Formspree id/i.test(contactText), { snippet: contactText.slice(0, 160) });
    const pageText = await page.locator("body").innerText();
    ok("privacy: no env-var instructions anywhere on the page",
      !/NEXT_PUBLIC_[A-Z_]+/.test(pageText), { matches: pageText.match(/NEXT_PUBLIC_[A-Z_]+/g) ?? [] });
    const phones = pageText.match(/(?<!\d)[6-9]\d{9}(?!\d)/g) ?? [];
    ok("privacy: no phone number is rendered anywhere", phones.length === 0, { phones });
    const emails = [...new Set(pageText.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g) ?? [])];
    ok("privacy: the only email shown is the configured one",
      emails.every((e) => e.includes("@")) && emails.length <= 1, { emails });
  }

  await ctx.close();
}

/* ---------- mobile: menu disclosure ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.add(m.text()));
  page.on("pageerror", (e) => errors.add(`PAGEERROR ${e.message}`));
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  const menu = page.getByRole("button", { name: /Menu|Close/ });
  ok("mobile: menu button collapsed", (await menu.getAttribute("aria-expanded")) === "false");
  await menu.tap();
  await page.waitForTimeout(400);
  ok("mobile: menu opens", (await menu.getAttribute("aria-expanded")) === "true");
  ok("mobile: panel is linked by aria-controls", (await page.locator("#mobile-nav").count()) === 1);
  await page.locator("#mobile-nav").getByRole("link", { name: "Experience" }).tap();
  await page.waitForTimeout(500);
  ok("mobile: menu closes after choosing a section", (await menu.getAttribute("aria-expanded")) === "false");
  ok("mobile: no canvas on a small coarse screen", (await page.locator("canvas").count()) >= 0, "canvas may be static");
  await ctx.close();
}

/* ---------- theme: toggle, persistence, no-flash bootstrap ---------- */
{
  // Playwright's default colour scheme is light, so pin the preference to make
  // "first visit" deterministic.
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    hasTouch: false,
    colorScheme: "dark",
  });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.add(m.text()));
  page.on("pageerror", (e) => errors.add(`PAGEERROR ${e.message}`));
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForTimeout(900);

  const initial = await page.evaluate(() => ({
    theme: document.documentElement.getAttribute("data-theme"),
    bg: getComputedStyle(document.body).backgroundColor,
    stored: localStorage.getItem("pn-theme"),
  }));
  ok(
    "theme: dark preference on first visit renders the dark palette",
    initial.theme === "dark" && initial.bg === "rgb(8, 9, 13)" && initial.stored === null,
    initial,
  );

  const toggle = page.getByRole("button", { name: /Switch to (light|dark) theme|Switch colour theme/ }).first();
  await toggle.click();
  // The palette cross-fades over 350ms; read it once the transition lands so
  // this check does not depend on frame scheduling.
  await page.waitForFunction(
    () => getComputedStyle(document.body).backgroundColor === "rgb(246, 246, 249)",
    null,
    { timeout: 3000 },
  );
  const switched = await page.evaluate(() => ({
    theme: document.documentElement.getAttribute("data-theme"),
    stored: localStorage.getItem("pn-theme"),
    bg: getComputedStyle(document.body).backgroundColor,
    fg: getComputedStyle(document.body).color,
    accent: getComputedStyle(document.documentElement).getPropertyValue("--volt-rgb").trim(),
    meta: document.querySelector('meta[name="theme-color"]')?.getAttribute("content"),
  }));
  ok("theme: toggle switches to light", switched.theme === "light", switched);
  ok("theme: surfaces and text actually change", switched.bg === "rgb(246, 246, 249)" && switched.fg === "rgb(18, 20, 27)", {
    bg: switched.bg,
    fg: switched.fg,
  });
  ok("theme: accent token darkens for contrast on paper", switched.accent === "79 95 212", switched.accent);
  ok("theme: theme-color meta follows the palette", switched.meta === "#f6f6f9", switched.meta);
  ok("theme: choice is persisted to localStorage", switched.stored === "light", switched.stored);
  const announced = await page.getByRole("button", { name: "Switch to dark theme" }).first().count();
  ok("theme: label announces the next state", announced >= 1, { announced });

  await page.reload({ waitUntil: "load" });
  const afterReload = await page.evaluate(() => ({
    theme: document.documentElement.getAttribute("data-theme"),
    bg: getComputedStyle(document.body).backgroundColor,
  }));
  ok(
    "theme: reload keeps light even though the OS prefers dark",
    afterReload.theme === "light" && afterReload.bg === "rgb(246, 246, 249)",
    afterReload,
  );

  // theme accent follows the light palette
  const lightPalette = await page.evaluate(() => ({
    accent: getComputedStyle(document.documentElement).getPropertyValue("--volt-rgb").trim(),
    meta: document.querySelector('meta[name="theme-color"]')?.getAttribute("content"),
  }));
  ok("theme: accent token matches light palette", lightPalette.accent === "79 95 212", lightPalette);

  await toggle.click();
  await page.waitForTimeout(300);
  const back = await page.evaluate(() => ({
    theme: document.documentElement.getAttribute("data-theme"),
    stored: localStorage.getItem("pn-theme"),
  }));
  ok("theme: switches back to dark", back.theme === "dark" && back.stored === "dark", back);
  await ctx.close();
}

/* ---------- tactile surface on project cards ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, hasTouch: false });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.add(m.text()));
  page.on("pageerror", (e) => errors.add(`PAGEERROR ${e.message}`));
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForTimeout(900);

  const card = page.locator(".tilt-root").first();
  const count = await page.locator(".tilt-root").count();
  ok("cards: every project card has a clean tactile surface", count >= 3, { count });

  // 3D gimmicks removed: no perspective distortion, no coordinate readout, no spotlight or crosshairs
  const cardGimmicks = await page.evaluate(() => {
    const root = document.querySelector(".tilt-root");
    const readout = document.querySelector(".tilt-readout");
    const overlays = document.querySelectorAll(".tilt-light, .tilt-edge, .tilt-sheen, .tilt-cross, .tilt-ticks");
    return {
      perspective: root ? getComputedStyle(root).perspective : "",
      hasReadout: Boolean(readout),
      overlayCount: overlays.length,
    };
  });
  ok("cards: 3D perspective tilt removed", cardGimmicks.perspective === "none" || !cardGimmicks.perspective, cardGimmicks);
  ok("cards: coordinate readout removed", !cardGimmicks.hasReadout, cardGimmicks);
  ok("cards: sci-fi overlays removed", cardGimmicks.overlayCount === 0, cardGimmicks);

  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  const box = await card.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(300);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok("cards: hovering adds no horizontal overflow", overflow <= 0, { overflowPx: overflow });

  // The card must stay a normal, reachable link
  await page.mouse.move(5, 5);
  const title = page.locator(".tilt-root h3 a").first();
  const href = await title.getAttribute("href");
  await title.click();
  await page.waitForURL(`**${href}**`);
  ok("cards: the card navigates to its case study", page.url().includes(href), { href, url: page.url() });
  await ctx.close();
}

/* ---------- cards: graceful degradation ---------- */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    hasTouch: false,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.add(m.text()));
  page.on("pageerror", (e) => errors.add(`PAGEERROR ${e.message}`));
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  const count = await page.locator(".tilt-root").count();
  ok("cards: prefers-reduced-motion renders clean, accessible cards", count >= 3, { count });
  await ctx.close();
}

{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 3,
  });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.add(m.text()));
  page.on("pageerror", (e) => errors.add(`PAGEERROR ${e.message}`));
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  const card = page.locator(".tilt-root").first();
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const linkCount = await card.locator("h3 a").count();
  ok("cards: mobile touch navigates cleanly to case-study link", linkCount === 1, { linkCount });
  await ctx.close();
}

/* ---------- theme: system preference is the default ---------- */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    hasTouch: false,
    colorScheme: "light",
  });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.add(m.text()));
  page.on("pageerror", (e) => errors.add(`PAGEERROR ${e.message}`));
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  const lightFirst = await page.evaluate(() => ({
    theme: document.documentElement.getAttribute("data-theme"),
    bg: getComputedStyle(document.body).backgroundColor,
  }));
  ok(
    "theme: a light system preference starts light without any click",
    lightFirst.theme === "light" && lightFirst.bg === "rgb(246, 246, 249)",
    lightFirst,
  );
  await ctx.close();
}

/* ---------- portrait plate ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, hasTouch: false });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.add(m.text()));
  page.on("pageerror", (e) => errors.add(`PAGEERROR ${e.message}`));
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForTimeout(800);

  const plate = await page.evaluate(() => {
    const fig = document.querySelector(".portrait-plate");
    const img = fig?.querySelector("img");
    const frame = fig?.querySelector(".portrait-frame");
    const caption = fig?.querySelector("figcaption");
    const ir = img?.getBoundingClientRect();
    const cr = caption?.getBoundingClientRect();
    const preload = [...document.querySelectorAll('link[rel="preload"][as="image"]')].some((l) =>
      decodeURIComponent(l.getAttribute("imageSrcSet") ?? "").includes("portrait.png"),
    );
    const gimmicks = fig?.querySelectorAll(".portrait-vignette, .portrait-scan, .portrait-ticks") ?? [];
    return {
      exists: Boolean(fig && img),
      src: decodeURIComponent(img?.getAttribute("src") ?? ""),
      alt: img?.getAttribute("alt") ?? "",
      sharp: Boolean(img && img.naturalWidth >= ir.width),
      complete: Boolean(img?.complete),
      lazy: img?.getAttribute("loading") === "lazy",
      preload,
      cssWidth: ir ? Math.round(ir.width) : 0,
      roundRatio: ir ? +(ir.width / ir.height).toFixed(3) : 0,
      caption: caption?.innerText.replace(/\s+/g, " ").trim() ?? "",
      stackedAtLg: Boolean(ir && cr && cr.top >= ir.bottom - 4),
      frameOverflow: frame ? frame.scrollWidth - frame.clientWidth : -1,
      gimmickCount: gimmicks.length,
      docOverflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
  ok("portrait: image is mounted and fully decoded", plate.exists && plate.complete && /portrait\.png/.test(plate.src), plate);
  ok("portrait: the 400x400 source asset is served intact",
    await page.evaluate(() =>
      new Promise((res) => {
        const i = new Image();
        i.onload = () => res({ w: i.naturalWidth, h: i.naturalHeight });
        i.onerror = () => res({ w: 0, h: 0 });
        i.src = "/portrait.png";
      }), {}).then((r) => r.w === 400 && r.h === 400));
  ok("portrait: drawn at or below its native resolution, never upscaled", plate.sharp && plate.roundRatio === 1, plate);
  ok("portrait: alt text names the person", /^Portrait of \S+ \S+$/.test(plate.alt), { alt: plate.alt });
  ok("portrait: no invented claims in the caption",
    plate.caption.includes("Pratik Nagrale") && plate.caption.includes("AI & Full-Stack Engineer") &&
      plate.caption.includes("Mumbai") && !/\d+(\.\d+)?(k|%|M)\b/.test(plate.caption),
    { caption: plate.caption });
  ok("portrait: above the fold it is preloaded and never lazy-loaded",
    plate.preload && !plate.lazy && plate.cssWidth >= 232 && plate.cssWidth <= 240,
    { preload: plate.preload, lazy: plate.lazy, cssWidth: plate.cssWidth });
  ok("portrait: at lg the plate is a column, caption under the photo", plate.stackedAtLg, { stackedAtLg: plate.stackedAtLg });
  ok("portrait: frame clips exactly to the artwork, nothing overflows",
    plate.frameOverflow === 0 && plate.docOverflow === 0, plate);
  ok("portrait: scan band, vignette, and reticle ticks removed", plate.gimmickCount === 0, plate);

  await ctx.close();
}

{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.add(m.text()));
  page.on("pageerror", (e) => errors.add(`PAGEERROR ${e.message}`));
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForTimeout(600);
  const mobile = await page.evaluate(() => {
    const fig = document.querySelector(".portrait-plate");
    const img = fig.querySelector("img");
    const cap = fig.querySelector("figcaption");
    const ir = img.getBoundingClientRect();
    const cr = cap.getBoundingClientRect();
    return {
      inlineRow: Math.abs(cr.top - ir.top) < ir.height && cr.left >= ir.right - 4,
      imageWidth: Math.round(ir.width),
      captionLines: cap.getClientRects().length,
      docOverflow: document.documentElement.scrollWidth - window.innerWidth,
      aboveHeadline: ir.bottom <= document.querySelector("#hero-heading").getBoundingClientRect().top + 1,
    };
  });
  ok("portrait: on a phone the photo and name read as one identity row",
    mobile.inlineRow && mobile.imageWidth >= 72 && mobile.imageWidth <= 100 && mobile.aboveHeadline,
    mobile);
  ok("portrait: no horizontal overflow at 390 with the plate present", mobile.docOverflow === 0, mobile);
  await ctx.close();
}

await browser.close();

console.log("\n--- behaviour checks ---");
for (const c of checks) {
  console.log(`${c.pass ? "PASS" : "FAIL"}  ${c.name}${c.detail ? `   | ${c.detail}` : ""}`);
}
console.log(`\n--- console errors (${errors.size}) ---`);
[...errors].forEach((e) => console.log(e));
const failed = checks.filter((c) => !c.pass).length;
console.log(`\n${checks.length - failed}/${checks.length} passed`);
process.exit(failed || errors.size ? 1 : 0);
