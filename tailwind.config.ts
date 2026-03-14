import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        app: "rgb(var(--bg-app) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--bg-surface) / <alpha-value>)",
          muted: "rgb(var(--bg-surface-muted) / <alpha-value>)",
          raised: "rgb(var(--bg-surface-raised) / <alpha-value>)"
        },
        text: {
          primary: "rgb(var(--text-primary) / <alpha-value>)",
          secondary: "rgb(var(--text-secondary) / <alpha-value>)",
          muted: "rgb(var(--text-muted) / <alpha-value>)"
        },
        border: {
          subtle: "rgb(var(--border-subtle) / <alpha-value>)",
          strong: "rgb(var(--border-strong) / <alpha-value>)"
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          soft: "rgb(var(--accent-soft) / <alpha-value>)"
        },
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        info: "rgb(var(--info) / <alpha-value>)"
      },
      boxShadow: {
        card: "0 18px 40px rgba(15, 23, 42, 0.08)",
        halo: "0 18px 60px rgba(var(--accent) / 0.24)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 rgba(var(--accent) / 0)" },
          "50%": { boxShadow: "0 0 30px rgba(var(--accent) / 0.18)" }
        }
      },
      animation: {
        rise: "rise 0.55s ease-out both",
        pulseGlow: "pulseGlow 4s ease-in-out infinite"
      }
    }
  }
};

export default config;
