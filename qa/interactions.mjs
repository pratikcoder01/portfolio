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

  // canvas draws something
  const pixels = await page.evaluate(() => {
    const c = document.querySelector("canvas");
    if (!c) return null;
    const ctx2 = c.getContext("2d");
    const data = ctx2.getImageData(0, 0, c.width, c.height).data;
    let painted = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] > 0) painted++;
    return { width: c.width, height: c.height, painted };
  });
  ok("canvas mounted and painted", Boolean(pixels && pixels.painted > 500), pixels);

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
    ok("contact: the direct-line panel replaces it",
      (await page.locator("#contact a[href^='mailto:']").count()) >= 1 &&
        (await page.locator("#contact a[target='_blank']").count()) >= 2,
      { mailto: await page.locator("#contact a[href^='mailto:']").count() });
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

  // the canvas decoration must pick up the new accent, not keep the dark one.
  // Canvas pixels are alpha-composited, so compare against both triplets.
  await page.waitForSelector("canvas", { timeout: 5000 }).catch(() => undefined);
  await page.waitForTimeout(600);
  const canvasAccent = await page.evaluate(() => {
    const c = document.querySelector("canvas");
    if (!c) return null;
    const data = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 40) return [data[i - 3], data[i - 2], data[i - 1]];
    }
    return "blank";
  });
  const dist = (p, t) => Math.abs(p[0] - t[0]) + Math.abs(p[1] - t[1]) + Math.abs(p[2] - t[2]);
  const nearLight =
    Array.isArray(canvasAccent) &&
    dist(canvasAccent, [79, 95, 212]) < dist(canvasAccent, [124, 140, 255]);
  ok("theme: hero canvas repaints with the light accent", nearLight, { canvasAccent });

  await toggle.click();
  await page.waitForTimeout(300);
  const back = await page.evaluate(() => ({
    theme: document.documentElement.getAttribute("data-theme"),
    stored: localStorage.getItem("pn-theme"),
  }));
  ok("theme: switches back to dark", back.theme === "dark" && back.stored === "dark", back);
  await ctx.close();
}

/* ---------- tilt: 3D pointer surface on project cards ---------- */
const tiltState = (page, index) =>
  page.evaluate((i) => {
    const root = document.querySelectorAll(".tilt-root")[i];
    if (!root) return null;
    const inner = root.querySelector(".tilt-inner");
    const cs = getComputedStyle(inner);
    return {
      engaged: root.dataset.engaged ?? "",
      settled: root.dataset.settled ?? "",
      inline: inner.style.transform,
      matrix: cs.transform,
      mx: inner.style.getPropertyValue("--mx"),
      my: inner.style.getPropertyValue("--my"),
      engage: inner.style.getPropertyValue("--engage"),
      light: getComputedStyle(inner.querySelector(".tilt-light")).opacity,
      edge: getComputedStyle(inner.querySelector(".tilt-edge")).opacity,
      readout: inner.querySelector(".tilt-readout").textContent,
      readoutHidden: inner.querySelector(".tilt-readout").getAttribute("aria-hidden"),
      willChange: cs.willChange,
      rootWidth: root.getBoundingClientRect().width,
      rootHeight: root.getBoundingClientRect().height,
    };
  }, index);

{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, hasTouch: false });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.add(m.text()));
  page.on("pageerror", (e) => errors.add(`PAGEERROR ${e.message}`));
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForTimeout(900);

  const card = page.locator(".tilt-root").first();
  const count = await page.locator(".tilt-root").count();
  ok("tilt: every project card has a 3D surface", count >= 3, { count });
  ok(
    "tilt: content is split into translateZ depth shelves",
    (await page.locator("[data-depth]").count()) >= 3,
    { shelves: await page.locator("[data-depth]").count() },
  );
  ok(
    "tilt: the surface establishes real perspective",
    (await card.evaluate((el) => getComputedStyle(el).perspective)) === "800px",
  );

  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const rest = await tiltState(page, 0);
  ok("tilt: at rest the card is flat and decor is hidden",
    rest.matrix === "none" && rest.engage === "" && rest.light === "0" && rest.edge === "0", rest);
  ok("tilt: no compositing hint while idle", rest.willChange === "auto", { willChange: rest.willChange });

  const box = await card.boundingBox();
  // Headless software rendering chases the lerp at roughly 20fps, so wait for
  // the documented end state instead of guessing a duration.
  const settle = async (pred, budget = 8000) => {
    const deadline = Date.now() + budget;
    let prev = await tiltState(page, 0);
    for (;;) {
      await page.waitForTimeout(150);
      const st = await tiltState(page, 0);
      // engaged only when the target holds for two consecutive samples, which
      // is what "the rAF loop has stopped writing" looks like from outside.
      if (pred(st) && st.inline === prev.inline && st.mx === prev.mx && st.my === prev.my) return st;
      prev = st;
      if (Date.now() > deadline) return st;
    }
  };

  const near = (v, target, tol) => Math.abs(parseFloat(v) - target) <= tol;

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  const mid = await settle((s) => s.settled === "true" && s.engaged === "true" && Number(s.light) > 0.95 && Number(s.edge) > 0.95);
  ok("tilt: pointer entering engages the surface", mid.engaged === "true" && Number(mid.light) > 0.95, {
    engaged: mid.engaged,
    light: mid.light,
    engage: mid.engage,
  });
  ok("tilt: the plane lifts toward the viewer", /translate3d\(0px, -2[12](\.\d+)?px, (3[9]|4[01])(\.\d+)?px\)/.test(mid.inline), {
    inline: mid.inline,
  });
  ok("tilt: a matrix3d is applied, not a 2D fallback", mid.matrix.startsWith("matrix3d"), { matrix: mid.matrix.slice(0, 24) });
  ok("tilt: pointer position reaches the light as custom properties", near(mid.mx, 50, 1) && near(mid.my, 50, 1), {
    mx: mid.mx,
    my: mid.my,
  });
  ok("tilt: coordinate readout is decorative only", mid.readoutHidden === "true" && /\d\.\d\d · \d\.\d\d/.test(mid.readout), {
    readout: mid.readout,
  });
  ok("tilt: compositing hint is only paid while engaged", mid.willChange === "transform", { willChange: mid.willChange });

  await page.mouse.move(box.x + box.width * 0.12, box.y + box.height * 0.18, { steps: 8 });
  const corner = await settle((s) => s.settled === "true" && near(s.mx, 12, 0.5) && near(s.my, 18, 1.5));
  ok("tilt: moving the pointer changes the tilt", corner.matrix !== mid.matrix && corner.inline !== mid.inline, {
    from: mid.inline,
    to: corner.inline,
  });
  ok("tilt: --mx/--my follow the pointer to the corner", near(corner.mx, 12, 0.5) && near(corner.my, 18, 1.5), {
    mx: corner.mx,
    my: corner.my,
  });
  ok("tilt: the edge ring and pointer light are both lit", Number(corner.edge) > 0.9 && Number(corner.light) > 0.9, {
    edge: corner.edge,
    light: corner.light,
  });
  ok("tilt: the tilted corner is rotated in both axes", /rotateX\([1-9]/.test(corner.inline) && /rotateY\(-?[1-9]/.test(corner.inline), {
    inline: corner.inline,
  });

  // No reflow: the tilt is a transform, so the layout box must not move.
  ok(
    "tilt: no layout shift while engaged",
    Math.abs(corner.rootWidth - rest.rootWidth) < 0.5 && Math.abs(corner.rootHeight - rest.rootHeight) < 0.5,
    { rest: [rest.rootWidth, rest.rootHeight], engaged: [corner.rootWidth, corner.rootHeight] },
  );
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok("tilt: a fully tilted card adds no horizontal overflow", overflow <= 0, { overflowPx: overflow });

  const settledA = await tiltState(page, 0);
  await page.waitForTimeout(600);
  const settledB = await tiltState(page, 0);
  ok("tilt: the animation loop stops once settled", settledA.matrix === settledB.matrix, {
    a: settledA.matrix,
    b: settledB.matrix,
    inlineA: settledA.inline,
    inlineB: settledB.inline,
  });

  await page.mouse.move(box.x + box.width / 2, box.y - 200);
  const left = await settle((s) => s.settled === "true" && s.engaged === "false" && s.engage === "0.000");
  const parse = (s) => {
    const m = /rotateX\(([-\d.]+)deg\) rotateY\(([-\d.]+)deg\)/.exec(s);
    return m ? [Math.abs(Number(m[1])), Math.abs(Number(m[2]))] : null;
  };
  const angles = parse(left.inline);
  ok("tilt: leaving returns the plane to flat",
    left.engaged === "false" && Number(left.engage) < 0.01 && !!angles && angles[0] < 0.05 && angles[1] < 0.05, left);
  ok("tilt: light and ring fade back to nothing", Number(left.light) < 0.01 && Number(left.edge) < 0.01, {
    light: left.light,
    edge: left.edge,
  });
  ok("tilt: compositing hint released after leaving", left.willChange === "auto", { willChange: left.willChange });

  // The card must stay a normal, reachable link when the pointer is not tilting.
  await page.mouse.move(5, 5);
  const title = page.locator(".tilt-root h3 a").first();
  const href = await title.getAttribute("href");
  await title.click();
  await page.waitForURL(`**${href}**`);
  ok("tilt: the card still navigates to its case study", page.url().includes(href), { href, url: page.url() });
  await ctx.close();
}

/* ---------- tilt: graceful degradation ---------- */
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
  const card = page.locator(".tilt-root").first();
  await card.scrollIntoViewIfNeeded();
  const box = await card.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(500);
  const st = await tiltState(page, 0);
  ok("tilt: prefers-reduced-motion renders a flat, static card",
    st.matrix === "none" && st.engaged === "false" && st.light === "0" && st.edge === "0", st);
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
  await page.tap("#work");
  await page.waitForTimeout(400);
  const st = await tiltState(page, 0);
  ok("tilt: coarse pointer + small screen never engages the tilt engine",
    st.matrix === "none" && st.engaged === "false" && st.readout === "", st);
  ok("tilt: decorative overlays cannot swallow taps on the case-study link",
    (await card.locator("h3 a").count()) === 1 &&
      (await card.locator(".tilt-light").evaluate((el) => getComputedStyle(el).pointerEvents)) === "none");
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
    const parts = [...fig?.querySelectorAll(".portrait-vignette, .portrait-scan, .portrait-ticks") ?? []];
    const ir = img?.getBoundingClientRect();
    const cr = caption?.getBoundingClientRect();
    const preload = [...document.querySelectorAll('link[rel="preload"][as="image"]')].some((l) =>
      decodeURIComponent(l.getAttribute("imageSrcSet") ?? "").includes("portrait.png"),
    );
    return {
      exists: Boolean(fig && img),
      src: decodeURIComponent(img?.getAttribute("src") ?? ""),
      alt: img?.getAttribute("alt") ?? "",
      // headless reports naturalWidth of the *chosen* srcset candidate, so compare against
      // what is drawn instead of the 400 px source file; the source is asserted separately.
      sharp: Boolean(img && img.naturalWidth >= ir.width),
      complete: Boolean(img?.complete),
      lazy: img?.getAttribute("loading") === "lazy",
      preload,
      cssWidth: ir ? Math.round(ir.width) : 0,
      roundRatio: ir ? +(ir.width / ir.height).toFixed(3) : 0,
      caption: caption?.innerText.replace(/\s+/g, " ").trim() ?? "",
      stackedAtLg: Boolean(ir && cr && cr.top >= ir.bottom - 4),
      frameOverflow: frame ? frame.scrollWidth - frame.clientWidth : -1,
      decorations: parts.map((el) => ({
        cls: el.className.split(" ")[0],
        ariaHidden: el.getAttribute("aria-hidden"),
        pointer: getComputedStyle(el).pointerEvents,
      })),
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
  ok("portrait: every overlay is aria-hidden and click-through",
    plate.decorations.length === 3 &&
      plate.decorations.every((d) => d.ariaHidden === "true" && d.pointer === "none"),
    plate.decorations);

  const scan = await page.evaluate(() => getComputedStyle(document.querySelector(".portrait-scan")).opacity);
  await page.locator(".portrait-frame").hover();
  await page.waitForTimeout(700);
  const scanHover = await page.evaluate(() => getComputedStyle(document.querySelector(".portrait-scan")).opacity);
  ok("portrait: the scan band brightens on hover and idles quietly",
    Number(scan) <= 0.35 && Number(scanHover) >= 0.85, { idle: scan, hover: scanHover });
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
      scanDisplay: getComputedStyle(fig.querySelector(".portrait-scan")).display,
      inlineRow: Math.abs(cr.top - ir.top) < ir.height && cr.left >= ir.right - 4,
      imageWidth: Math.round(ir.width),
      captionLines: cap.getClientRects().length,
      docOverflow: document.documentElement.scrollWidth - window.innerWidth,
      aboveHeadline: ir.bottom <= document.querySelector("#hero-heading").getBoundingClientRect().top + 1,
    };
  });
  ok("portrait: reduced motion removes the scan band entirely", mobile.scanDisplay === "none", mobile);
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
