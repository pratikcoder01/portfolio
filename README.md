# Pratik Nagrale — portfolio

A dark-first, editorial portfolio for an AI & full-stack engineer. Built with **Next.js 15.5 (App Router,
React Server Components)**, **TypeScript**, **Tailwind CSS v3**, **Framer Motion** and **Lucide** icons.

## Quick start

```bash
cp .env.example .env.local   # then fill in the values you want
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run lint
```

## Environment variables

All client-visible config goes through `NEXT_PUBLIC_*`. Nothing personal is hardcoded in the source.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_CONTACT_EMAIL` | no | The **only** place the site gets an email address from. If it is empty, the email is hidden everywhere and the contact section falls back to the form + social links. Phone numbers are never rendered. |
| `NEXT_PUBLIC_FORMSPREE_ID` | for the form | Formspree form id. Without it the submit button is disabled and the form shows a "not live yet" notice. |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical origin used by metadata, Open Graph, `sitemap.xml` and `robots.txt`. |

`.env.local` is git-ignored. `.env.example` documents the shape.

## Contact form + Formspree setup

1. Create a form at <https://formspree.io> (free tier is enough) and copy its id, e.g. `xywokqab`.
2. Put it in `.env.local`:
   ```
   NEXT_PUBLIC_FORMSPREE_ID=xywokqab
   ```
3. Restart `npm run dev` (public env vars are inlined at build time).
4. In the Formspree dashboard, configure the fields the form posts: `name`, `email`, `message`
   (plus `_gotcha`, which is the honeypot and should never be displayed).
5. Recommended submission settings: enable Formspree's built-in spam filtering and set a
   submission limit on your plan. Turn on email notifications so submissions reach your inbox.

Client-side protections in `components/contact.tsx`:

- **Validation** — name ≥ 2 chars, email pattern match, message ≥ 12 chars. Errors are announced
  inline with `aria-invalid` + `aria-describedby`, and focus moves to the first invalid field.
- **Honeypot** — an off-screen `_gotcha` input that real users never see or reach (`tabIndex={-1}`).
  If it arrives filled, the submission is discarded silently.
- **Rate limiting (messaging)** — a 20-second cooldown between sends and a maximum of 3 submissions
  per 5 minutes per device, tracked in `localStorage`. A Formspree `429` is surfaced as its own
  message. *This is a UX guard, not a security control: it is per-device and can be bypassed. The
  real enforcement belongs in Formspree's own limits (and, if you outgrow it, a route handler).*

## Content model

Every string on the site comes from [`lib/data.ts`](lib/data.ts), which is the single source of
truth and records the provenance of each claim (`pdf` = LinkedIn profile export, `readme` =
repository README, `repo` = GitHub metadata).

- `experience`, `education`, `certifications`, `projects` — factual records.
- `skills[]` each carry an `evidence: SourceId[]` list, which powers the skills-to-evidence map.
- `projects[].caseSections` follow **Problem → Research → Architecture → Implementation →
  Challenges → Results → Future Improvements**. A section with no source material is stored as
  `status: "todo"` with a `needed` note and renders as a visible **"To be completed"** block —
  the site never fills those gaps with invented text.
- Architecture diagrams in [`components/architecture-diagrams.tsx`](components/architecture-diagrams.tsx)
  only draw components named in the READMEs (Athlix: Next.js client, Express API, MongoDB Atlas,
  Socket.io, Cloudinary/Multer, MediaPipe Kata Analyzer, docs contracts; PlateCam: image → OpenCV →
  EasyOCR → REST API → mobile app; DojoNation: Vite React SPA → Supabase Auth + Postgres).

### Adding a project

1. Add the repo facts to `projects` in `lib/data.ts` (tagline, stack, `caseSections` with provenance).
2. If it has a documented architecture, add a diagram component and register it in `diagrams`.
3. The case-study page, sitemap entry and nav counts update automatically
   (`app/projects/[slug]/page.tsx` is statically generated from `generateStaticParams`).

## Layout

```
app/
  layout.tsx              fonts, metadata, skip link, header/footer landmarks
  page.tsx                home: hero, work, experience, skills, education, contact
  projects/[slug]/page.tsx  static case studies
  opengraph-image.tsx     1200x630 OG card via next/og
  icon.svg  not-found.tsx  sitemap.ts  robots.ts  globals.css
components/               islands: hero + canvas, nav, timeline, skills map, contact, theme toggle
components/tilt-surface.tsx  the 3D pointer surface the project cards sit in
components/portrait.tsx      the one photograph, as an instrument plate in the hero
public/portrait.png          400x400 source photo (served as a ~6 kB optimized WebP)
lib/data.ts               all content + provenance
lib/theme.ts              palette bootstrap, storage key, applyTheme()
qa/                       Playwright responsive + behaviour audit, Lighthouse runner
```

## Theme — dark and light

The site ships two palettes and remembers which one you picked.

- **Control**: the pill in the header (desktop nav and mobile row) switches between them. It is a real
  `<button>` with an `aria-label` that names the state you are going to get ("Switch to light theme"),
  and the icon swap is done in CSS on `[data-theme]` — never by conditional markup, because the theme
  is decided before hydration and a markup branch on it would break SSR.
- **Default**: your OS `prefers-color-scheme`. Once you touch the toggle, your choice wins and is stored
  in `localStorage` under `pn-theme` (`"dark"` | `"light"`).
- **No flash**: `THEME_BOOTSTRAP` in [`lib/theme.ts`](lib/theme.ts) runs as an inline script in `<head>`
  before the first paint, sets `data-theme` on `<html>` and updates the `theme-color` meta tag. With JS
  disabled you get the dark palette, which is the design default.
- **Tokens**: nothing in a component hardcodes a colour. `app/globals.css` defines channel triplets
  (`--ink-rgb`, `--paper-muted-rgb`, `--volt-rgb`, `--danger-rgb`, …) per palette, and
  `tailwind.config.ts` maps `ink/paper/volt/danger` to `rgb(var(…) / <alpha-value>)` so alpha modifiers
  like `bg-ink-card/45` still resolve. To add a colour, add a triplet to both palettes and map it in the
  Tailwind config.
- **Contrast is re-checked in both palettes**: the light accent is `#4f5fd4` rather than `#7c8cff`,
  because `#7c8cff` only reaches 3.0:1 on paper. `qa/responsive.mjs` runs the whole layout audit twice
  and composites each text node over its real layered background.
- The canvas node graph reads `--volt-rgb` at paint time and repaints when `data-theme` changes, and the
  Open Graph image stays dark — social cards do not follow a visitor's theme.

## Signature motion — project cards as instrument panels

`components/tilt-surface.tsx` wraps every project card in a real 3D surface. It is the one piece of
spectacle on the page, so it is built to cost nothing when you are not using it.

- **What happens**: the pointer sets a target tilt (±8°), a critically-damped lerp chases it in a single
  `requestAnimationFrame` loop, and the card lifts 22px toward the viewer inside an 800px perspective.
  The card content is split onto `translateZ` shelves — title and tagline at 14px, stack chips and status
  at 26px, the architecture diagram at 40px — so the card separates into layers as it turns instead of
  rotating as one flat bitmap.
- **What is drawn on top**: a pointer light and a 1px edge ring whose brightest point is the point
  nearest your cursor (both painted from `--mx`/`--my`, so they stay inside the rounded card); a diagonal
  gloss and a hairline crosshair that track the pointer by `transform` only; four corner brackets; and a
  normalised `0.42 · 0.67` coordinate readout set vertically in the left gutter, which is the detail that
  says "instrument" rather than "hero gradient".
- **Per frame, the only writes are**: one `transform` string, three custom properties and the readout
  text, all on one element. No layout, no React re-render, no state.
- **It switches itself off** for `prefers-reduced-motion`, coarse pointers, viewports under 640px,
  devices reporting ≤2 cores or ≤2 GB, and Save-Data. Then `--engage` is never written, every decorative
  layer is `opacity: 0`, and the markup is a plain card — which is also what you get with JavaScript
  disabled. `will-change: transform` is applied only while a pointer is on the card, and the loop stops
  as soon as the target is reached (`data-settled` on the surface tells you when).
- **Light palette**: a glow on paper does not read as height, so an engaged card casts a shadow instead
  (`[data-theme="light"] .tilt-root[data-engaged="true"] .tilt-card`).
- Reference frames: `qa/screenshots/tilt-dark-18-12.png`, `tilt-dark-80-80.png`, `tilt-light-18-12.png`.

## The portrait plate

`components/portrait.tsx` puts the one real photograph on the site in the hero, treated like a piece of
hardware rather than a headshot: hairline frame, reticle brackets in the corners, a vignette that pulls the
studio-grey background into the page, and a single scan band that crosses the frame every 9 s and brightens
when the pointer is on it — the same "instrument" language the project cards use.

- **Layout follows the hero**: at `lg` the hero is `grid-cols-[minmax(0,1fr)_15rem]` and the plate is the
  second column, caption under the photo. Below `lg` it collapses to an inline identity row — photo left,
  name and title beside it — so the picture never floats alone above the headline on a phone.
- **Caption text is data, not decoration**: `profile.name`, `profile.title`, `profile.location` from
  [`lib/data.ts`](lib/data.ts). Nothing about the photo claims a metric, an award or a client.
- **The source is 400×400 and is never drawn larger than 240px**, so it stays sharp at 1x on desktop and
  ~2.5x on a phone. `next/image` serves it as a 6.3 kB WebP and `priority` emits the `<link rel=preload>`;
  `qa/interactions.mjs` asserts the preload exists, that the img is not lazy, that `/portrait.png` decodes
  at exactly 400×400, and that the drawn box is square with no overflow.
- **Motion is optional by construction**: the scan band is `display: none` under `prefers-reduced-motion`
  and the whole plate is static markup — server-rendered, no client island, no hydration cost.
- Reference frames: `qa/screenshots/hero-1440-dark.png`, `hero-1440-light.png`, `hero-390-dark.png`,
  `hero-768-light.png`.

## Performance & accessibility notes

- **The hero entrance is CSS, not JavaScript.** `components/hero.tsx` renders plain markup and
  staggers it with `animation-delay: var(--d)` on transform-only keyframes (`rise-in`, `word-rise`)
  inside `@media (prefers-reduced-motion: no-preference)`. An `opacity: 0` start owned by Framer kept
  the hero paragraph — the LCP node — unpainted until hydration finished, which measured as a 3.6 s
  LCP with a 1.7 s render delay; the CSS version measures 1.2 s and is readable with JS disabled.
- **Section reveals share one `IntersectionObserver`.** `components/reveal.tsx` toggles
  `data-reveal="pending" → "shown"` and the hidden state again lives in CSS. Per-element Framer
  `whileInView` subscriptions were the largest contributor to main-thread Style & Layout time.
- **Off-screen diagrams are skipped** with `content-visibility: auto` + `contain-intrinsic-size`, so
  the four inline SVG architecture diagrams cost no layout, paint or stroke animation until scrolled
  into view. On mobile they are hidden on the card and reachable on the case-study page, where the
  figure scrolls sideways instead of overflowing the document.
- **Framer Motion is lazy-loaded** through `LazyMotion` + `domAnimation` (`strict`, so `m.*` must be
  used instead of `motion.*`) and `MotionConfig reducedMotion="user"`. That is ~26 kB less First Load JS.
- Reduced motion is read after hydration (`lib/use-prefers-reduced-motion.ts`) or handled by CSS media
  queries — never during the first render, because a server/client branch on the preference caused a
  React hydration mismatch (#418) that discarded the hero tree.
- Only `HeroField` (the canvas node graph) is lazy-loaded with `next/dynamic` + `ssr: false`; it is
  absolutely positioned so its arrival cannot shift layout, and its animation loop starts only after
  an idle moment. Every interactive section is SSR'd to avoid CLS and stays a focused client island.
- The canvas uses transform-only drawing, pauses when off-screen (`IntersectionObserver`) and when
  the tab is hidden, and is disabled entirely under `prefers-reduced-motion`. Low-power devices
  (≤2 cores, ≤2 GB reported memory, Save-Data, small coarse pointers) get a single static frame.
- Text contrast targets 4.5:1 or better against `#08090d`; `qa/responsive.mjs` asserts it in-page.
- Landmarks: `header`/`nav`/`main`/`footer`, a skip link, `aria-labelledby` on every section,
  `aria-expanded`/`aria-controls` on the disclosure controls, and a visible `:focus-visible` ring.
- `<noscript>` forces every reveal to its final state so the whole page is readable without JS.

## QA scripts

Run a production server first (`npm run build && npx next start -p 3100`), then:

```bash
node qa/responsive.mjs        # both palettes x 6 widths + case studies: overflow, clipping, contrast
node qa/interactions.mjs      # behaviour: canvas, reveals, timeline, skills map, menu, theme, tilt, contact form
node qa/interactions.mjs --with-form   # adds the Formspree paths (needs NEXT_PUBLIC_FORMSPREE_ID)
node qa/links.mjs             # internal anchors + external link status + head/landmark audit
node qa/lighthouse.mjs        # mobile + desktop Lighthouse, writes qa/reports
```

Last measured run (Lighthouse 13.6, `next start` on localhost):

| | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| mobile | **82** | 100 | 100 | 100 |
| desktop | **96** | 100 | 100 | 100 |

Mobile FCP 1.16 s, LCP 1.16 s (the headline — the photograph never becomes LCP on a phone), CLS 0.000, TBT 708 ms,
TTI 3.4 s; desktop FCP 0.28 s, LCP 0.85 s, TBT 135 ms. (Headless Chrome prefers the light palette, so that is what
Lighthouse measured — the palette does not move these numbers.) On desktop the portrait plate is now the LCP element
at 0.85 s, and Lighthouse flags its request as "discoverable but not fetchpriority-annotated": Next 15 emits the
`<link rel=preload>` for a `priority` image without a `fetchpriority` hint, and passing the prop explicitly does not
change the SSR output, so the annotation is left to the framework. The 3D tilt surface costs ~1 point per form factor
(it does nothing until a pointer enters a card, and mobile never has one); the portrait costs a few more on mobile
mostly through run-to-run variance in the throttled TBT, which is the metric still below target: under the simulated
4× CPU throttle, React hydration of the interactive islands costs ~1.3 s of script evaluation (longest single task
~440 ms). Reaching 90 on mobile would mean dropping Framer Motion from the initial islands and re-implementing the
nav underline, magnetic CTAs, timeline and skills map in CSS — which trades directly against the motion design that
was asked for, so it is left as a decision rather than done silently.

`qa/responsive.mjs` covers 28 page × width × palette runs with 0 console errors and 0 overflow, clipping
or contrast findings; `qa/interactions.mjs` reports 79/79 behaviour checks with 0 console errors — 25 of
them the tilt surface, including that the plane really is `matrix3d`, that `--mx/--my` reach the light,
that the layout box does not move while engaged, that the rAF loop stops once settled, that the card is
flat and its decor invisible under reduced motion and on a 390px touch context, and that the card still
navigates to its case study — and 13 on the portrait plate (source decodes 400×400, preloaded and never lazy,
drawn square at ≤240px, caption holds only data-derived text, every overlay `aria-hidden` and click-through,
scan band gone under reduced motion, identity row intact with 0px document overflow at 390);
`qa/links.mjs` reports 0 failures, with `linkedin.com/in/pratik-n` returning
999 to headless clients (LinkedIn's bot gate) and therefore unverifiable from this machine.

## Deploying (Vercel)

The repo is a plain Next.js 15 app with no Vercel-specific config: import it and the framework preset does the
right thing. Verified from a clean clone of the pushed commit, with no `.env.local` present:

```
npm ci        475 packages, 43 s
next build    48 s, 13 static routes, First Load JS 155 kB
```

`playwright` and `lighthouse` are devDependencies but neither downloads a browser during install (Playwright 1.64
has no postinstall script), so the CI install step stays at that time.

**Set the environment variables before the first production deploy**, otherwise the site publishes its own setup
notes: with `NEXT_PUBLIC_SITE_URL` unset, `metadataBase`, the canonical link and `og:url` all resolve to
`http://localhost:3000`, and with the two contact variables unset the contact section renders the
"set NEXT_PUBLIC_CONTACT_EMAIL / NEXT_PUBLIC_FORMSPREE_ID" fallback copy instead of real contact options.

1. vercel.com → **Add New… → Project** → import `pratikcoder01/portfolio` (main).
2. Environment Variables: `NEXT_PUBLIC_SITE_URL` = the production origin (you can set it after the first
   preview deploy gives you the URL, then promote), plus `NEXT_PUBLIC_CONTACT_EMAIL` and
   `NEXT_PUBLIC_FORMSPREE_ID` if you want those surfaces live.
3. Build command `next build`, output directory `.next` — leave both at the detected defaults. No
   `vercel.json` is needed; `outputFileTracingRoot` in `next.config.ts` is pinned to the project root so
   the lockfile in your home directory cannot be mistaken for a monorepo root.
4. Add a custom domain under Settings → Domains when you have one, then redeploy so the canonical URL and
   sitemap pick it up.

After it is live, point the QA runners at it (`node qa/links.mjs https://<origin>`) — `qa/links.mjs` checks
internal anchors and external status from any base URL.

