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
      colors: {
        ink: {
          DEFAULT: withAlpha("--ink-rgb"),
          raised: withAlpha("--ink-raised-rgb"),
          card: withAlpha("--ink-card-rgb"),
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
        sans: ["var(--font-grotesk)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        body: ["var(--font-body)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "JetBrains Mono",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
      maxWidth: {
        shell: "78rem",
      },
      letterSpacing: {
        display: "-0.025em",
        tight: "-0.015em",
        mono: "0.04em",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
