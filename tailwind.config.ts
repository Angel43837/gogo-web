import type { Config } from "tailwindcss";

/**
 * Sistema de diseño GOGO.
 * Todos los colores se leen de las variables CSS definidas en src/app/globals.css.
 * Para cambiar el naranja oficial de la marca basta con editar `--color-primary`.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", sm: "1.5rem", lg: "2rem", "2xl": "2.5rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      // Escala de opacidad completa (0-100) para poder usar /8, /12, /85, etc.
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, i) => [String(i), String(i / 100)]),
      ),
      screens: {
        xs: "390px",
        "3xl": "1680px",
      },
      colors: {
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          soft: "rgb(var(--color-primary-soft) / <alpha-value>)",
          dark: "rgb(var(--color-primary-dark) / <alpha-value>)",
          fg: "rgb(var(--color-primary-foreground) / <alpha-value>)",
        },
        // Escala naranja sólida (las variantes con degradado viven en globals.css
        // como .bg-brand / .bg-brand-deep / .bg-brand-tint).
        flame: {
          tint: "rgb(var(--color-brand-tint) / <alpha-value>)",
          tint2: "rgb(var(--color-brand-tint-2) / <alpha-value>)",
          mid: "rgb(var(--color-brand-mid) / <alpha-value>)",
          mid2: "rgb(var(--color-brand-mid-2) / <alpha-value>)",
          deep: "rgb(var(--color-brand-deep) / <alpha-value>)",
          deeper: "rgb(var(--color-brand-deep-2) / <alpha-value>)",
        },
        onBrand: "rgb(var(--color-on-brand) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          soft: "rgb(var(--color-accent-soft) / <alpha-value>)",
        },
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        ink: {
          DEFAULT: "rgb(var(--color-ink) / <alpha-value>)",
          soft: "rgb(var(--color-ink-soft) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius-md)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
        lift: "var(--shadow-lift)",
        glow: "var(--shadow-glow)",
      },
      spacing: {
        section: "var(--space-section)",
        "section-sm": "var(--space-section-sm)",
      },
      transitionTimingFunction: {
        gogo: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-16px) rotate(-1.5deg)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: "0.7" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "dash-move": {
          to: { strokeDashoffset: "-120" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        "float-slow": "float-slow 7s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
        "pulse-ring": "pulse-ring 2.4s ease-out infinite",
        "dash-move": "dash-move 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
