import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        xs: "450px",
        sm: "575px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        current: "currentColor",
        transparent: "transparent",
        white: "#FFFFFF",
        black: "#0D1117",
        dark: "#161B22",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Terminal palette via CSS custom properties
        "t-bg": "var(--color-bg)",
        "t-surface": "var(--color-surface)",
        "t-text": "var(--color-text)",
        "t-muted": "var(--color-text-secondary)",
        "t-border": "var(--color-border)",
        "t-primary": "var(--color-primary)",
        "t-accent": "var(--color-accent)",
        "t-green": "var(--color-green)",

        // Legacy compatibility
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "hsl(var(--primary-foreground))",
        },
        neutral: {
          DEFAULT: "#64748B",
          50: "#F8FAFC",
          100: "#EEF2F7",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        success: { DEFAULT: "#10B981" },
        danger: { DEFAULT: "#EF4444" },
        warning: { DEFAULT: "#F59E0B" },
        info: { DEFAULT: "#3B82F6" },
        yellow: "#F59E0B",
        "body-color": "#656D76",
        "body-color-dark": "#8B949E",
        "gray-dark": "#1F2328",
        "gray-light": "#F6F8FA",
        stroke: "#D0D7DE",
        "stroke-dark": "#30363D",
        "bg-color-dark": "#0D1117",

        secondary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        heading: "var(--font-heading), system-ui, sans-serif",
        body: "var(--font-body), system-ui, sans-serif",
        mono: "var(--font-mono), monospace",
      },
      boxShadow: {
        one: "0px 2px 3px rgba(13, 17, 23, 0.05)",
        two: "0px 5px 10px rgba(13, 17, 23, 0.1)",
        three: "0px 5px 15px rgba(13, 17, 23, 0.05)",
        sticky: "inset 0 -1px 0 0 rgba(208, 215, 222, 0.3)",
        "sticky-dark": "inset 0 -1px 0 0 rgba(48, 54, 61, 0.3)",
        card: "0px 1px 3px rgba(31, 35, 40, 0.08)",
        "card-hover": "0px 4px 12px rgba(31, 35, 40, 0.12)",
        submit: "0px 5px 20px rgba(47, 129, 247, 0.15)",
        "submit-dark": "0px 5px 20px rgba(13, 17, 23, 0.3)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      dropShadow: {
        three: "0px 5px 15px rgba(13, 17, 23, 0.05)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          from: { transform: "translateY(-100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
