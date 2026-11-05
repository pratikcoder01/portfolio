import type { Config } from "tailwindcss";

const withAlpha = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Channel triplets defined in app/globals.css, one set per theme.
      colors: {
        ink: {
          DEFAULT: withAlpha("--ink-rgb"),
          raised: withAlpha("--ink-raised-rgb"),
          card: withAlpha("--ink-card-rgb"),
          line: "#23283a",
        },
        paper: {
          DEFAULT: withAlpha("--paper-rgb"),
          muted: withAlpha("--paper-muted-rgb"),
          faint: withAlpha("--paper-faint-rgb"),
        },
        volt: {
          DEFAULT: withAlpha("--volt-rgb"),
          soft: withAlpha("--volt-soft-rgb"),
          deep: withAlpha("--volt-deep-rgb"),
        },
        danger: withAlpha("--danger-rgb"),
      },
      fontFamily: {
        sans: ["var(--font-grotesk)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        shell: "76rem",
      },
      letterSpacing: {
        display: "-0.03em",
        label: "0.18em",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
