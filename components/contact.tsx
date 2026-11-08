"use client";

import { AlertCircle, ArrowUpRight, Check, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { Magnetic } from "@/components/magnetic";
import { Reveal } from "@/components/reveal";
import { contactEmail, formspreeId, socials } from "@/lib/data";

const COOLDOWN_SECONDS = 20;
const MAX_PER_WINDOW = 3;
const WINDOW_MS = 5 * 60 * 1000;
const STORAGE_KEY = "pn.contact.attempts";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; text: string }
  | { kind: "limited"; text: string };

function readAttempts(): number[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

/**
 * DirectPanel — what the right column shows when no Formspree id is configured.
 * It is a finished contact block, not an error state: no form, and no mention of
 * environment variables, because a visitor has no idea what those are.
 */
function DirectPanel({ email }: { email: string | null }) {
  return (
    <div className="rounded-xl border border-[var(--line-strong)] bg-ink-card/45 p-6 sm:p-7">
      <p className="eyebrow">Direct line</p>
      <p className="mt-3 max-w-[42ch] text-[0.95rem] leading-relaxed text-paper">
        {email
          ? "Email works best - put the role or the problem in the first line and I will answer properly."
          : "The fastest way to reach me is a message on GitHub or LinkedIn."}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {email && (
          <Magnetic strength={0.2}>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 rounded-full bg-volt px-5 py-2.5 font-sans text-[0.88rem] font-medium text-[var(--on-accent)] transition-shadow hover:shadow-[0_0_0_4px_rgb(var(--volt-rgb)/0.22)]"
            >
              {email}
              <Send className="h-4 w-4" aria-hidden="true" />
            </a>
          </Magnetic>
        )}

        {socials.map((s) => (
          <Magnetic key={s.id} strength={0.16}>
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] px-5 py-2.5 font-sans text-[0.88rem] text-paper transition-colors hover:border-volt/60 hover:bg-volt/10"
            >
              {s.label}
              <ArrowUpRight className="h-4 w-4 text-volt" aria-hidden="true" />
              <span className="sr-only">{`- ${s.handle} on ${s.label}, opens in a new tab`}</span>
            </a>
          </Magnetic>
        ))}
      </div>

      <p className="mt-6 flex items-start gap-2 text-[0.78rem] leading-relaxed text-paper-faint">
        <span className="mt-2 h-px w-4 shrink-0 bg-[var(--line-strong)]" aria-hidden="true" />
        A short brief beats a long one: what you need, by when, and what done looks like.
      </p>
    </div>
  );
}

export function Contact() {
  const endpoint = useMemo(() => formspreeId(), []);
  const email = useMemo(() => contactEmail(), []);

  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [cooldown, setCooldown] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const validate = (): Errors => {
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      next.email = "Please enter a valid email address.";
    if (values.message.trim().length < 12)
      next.message = "A little more detail helps - at least 12 characters.";
    return next;
  };

  const rateLimitCheck = (): string | null => {
    const now = Date.now();
    const attempts = readAttempts().filter((t) => now - t < WINDOW_MS);
    if (attempts.length >= MAX_PER_WINDOW) {
      const wait = Math.ceil((WINDOW_MS - (now - attempts[0])) / 1000);
      return `Too many messages from this device in the last 5 minutes. Try again in about ${Math.max(1, Math.round(wait / 60))} minute(s), or email directly.`;
    }
    if (cooldown > 0) return `Please wait ${cooldown}s before sending again.`;
    return null;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!endpoint) return;

    // Honeypot: bots fill it, humans never see it. Discard silently.
    if (honeypotRef.current?.value) {
      setStatus({ kind: "sent" });
      setValues({ name: "", email: "", message: "" });
      return;
    }

    const limited = rateLimitCheck();
    if (limited) {
      setStatus({ kind: "limited", text: limited });
      return;
    }

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstKey = (["name", "email", "message"] as const).find((k) => found[k]);
      if (firstKey) formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const response = await fetch(`https://formspree.io/f/${endpoint}`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          _gotcha: honeypotRef.current?.value ?? "",
        }),
      });

      if (response.ok) {
        // Wrap in try/catch: a storage failure (e.g. private-browsing quota,
        // SecurityError) must never turn a successful send into an error state.
        try {
          window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify([...readAttempts(), Date.now()]),
          );
        } catch {
          // Storage unavailable — rate-limit tracking is skipped this round,
          // but the message was sent successfully so we still show "Received".
        }
        setCooldown(COOLDOWN_SECONDS);
        setValues({ name: "", email: "", message: "" });
        setStatus({ kind: "sent" });
        return;
      }

      if (response.status === 429) {
        setStatus({
          kind: "limited",
          text: "Formspree is rate-limiting submissions right now. Please wait a minute and try again.",
        });
        return;
      }

      const payload = (await response.json().catch(() => null)) as {
        errors?: Array<{ code?: string; message?: string; field?: string }>;
      } | null;
      const message =
        payload?.errors?.map((e) => e.message ?? e.code).filter(Boolean).join(" ") ||
        "That submission did not go through. Please try again or email directly.";
      setStatus({ kind: "error", text: message });
    } catch {
      setStatus({
        kind: "error",
        text: "Network problem - the message was not sent. Check your connection or email directly.",
      });
    }
  };

  const field = (key: "name" | "email" | "message") => ({
    id: `contact-${key}`,
    name: key,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `contact-${key}-error` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    value: values[key],
    className:
      "w-full rounded-lg border bg-ink px-3.5 py-2.5 text-[0.9rem] text-paper placeholder:text-paper-faint transition-colors " +
      (errors[key]
        ? "border-danger focus:border-danger"
        : "border-[var(--line-strong)] hover:border-[var(--line-strong)] focus:border-volt"),
  });

  return (
    <section id="contact" aria-labelledby="contact-heading" className="shell py-20 sm:py-28">
      <div className="ticks mb-6 w-40 opacity-70" aria-hidden="true" />
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <h2 id="contact-heading" className="font-sans text-[1.6rem] font-medium sm:text-[2rem]">
            Start a conversation
          </h2>
          <p className="mt-4 max-w-[46ch] text-[0.92rem] leading-relaxed text-paper-muted">
            Roles where algorithmic thinking matters more than years of experience, a problem that
            needs an owner, or a build you want a second pair of hands on.
          </p>

          <div className="mt-7 space-y-2 text-[0.86rem]">
            {/* With no endpoint the panel on the right already makes the address the
                primary action, so the left column does not repeat it. */}
            {endpoint &&
              (email ? (
                <p>
                  <a href={`mailto:${email}`} className="link-underline">
                    {email}
                  </a>
                </p>
              ) : (
                <p className="max-w-[40ch] text-paper-muted">
                  No public email address on this page - use GitHub or LinkedIn and I will see it.
                </p>
              ))}
            <ul className="flex flex-wrap gap-x-5 gap-y-1 pt-1">
              {socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-quiet"
                  >
                    {s.handle}
                    <span className="sr-only">{` - ${s.label}, opens in a new tab`}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal>
          {endpoint ? (
            <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-4">
              {/* Honeypot - never visible, never focusable, discarded server-side. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="contact-gotcha">Leave this field empty</label>
                <input
                  ref={honeypotRef}
                  id="contact-gotcha"
                  name="_gotcha"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="contact-name" className="eyebrow mb-2 block">
                  Your name
                </label>
                <input {...field("name")} type="text" autoComplete="name" placeholder="Name" />
                {errors.name && (
                  <p id="contact-name-error" className="mt-1.5 flex items-center gap-1.5 text-[0.78rem] text-danger">
                    <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-email" className="eyebrow mb-2 block">
                  Email
                </label>
                <input
                  {...field("email")}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@company.com"
                />
                {errors.email && (
                  <p id="contact-email-error" className="mt-1.5 flex items-center gap-1.5 text-[0.78rem] text-danger">
                    <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-message" className="eyebrow mb-2 block">
                  Message
                </label>
                <textarea {...field("message")} rows={5} placeholder="What are you building or hiring for?" />
                {errors.message && (
                  <p id="contact-message-error" className="mt-1.5 flex items-center gap-1.5 text-[0.78rem] text-danger">
                    <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Magnetic strength={0.2}>
                  <button
                    type="submit"
                    disabled={status.kind === "sending"}
                    className="inline-flex items-center gap-2 rounded-full bg-volt px-5 py-2.5 font-sans text-[0.88rem] font-medium text-[var(--on-accent)] transition-[opacity,box-shadow] hover:shadow-[0_0_0_4px_rgb(var(--volt-rgb)/0.22)] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {status.kind === "sending" ? "Sending" : "Send message"}
                    {status.kind !== "sending" && <Send className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </Magnetic>

                <p aria-live="polite" className="min-h-[1.25rem] text-[0.8rem]">
                  {status.kind === "sent" && (
                    <span className="flex items-center gap-2 text-volt-soft">
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Received - I will reply from this address.
                    </span>
                  )}
                  {status.kind === "sending" && <span className="text-paper-muted">Sending...</span>}
                  {(status.kind === "error" || status.kind === "limited") && (
                    <span className="max-w-[46ch] text-danger">{status.text}</span>
                  )}
                  {status.kind === "idle" && endpoint && (
                    <span className="text-paper-faint">
                      Submissions go to Formspree. {COOLDOWN_SECONDS}s between sends, {MAX_PER_WINDOW} per
                      5 minutes per device.
                    </span>
                  )}
                </p>
              </div>
            </form>
          ) : (
            <DirectPanel email={email} />
          )}
        </Reveal>
      </div>
    </section>
  );
}
