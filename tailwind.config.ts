import type { Config } from "tailwindcss";

// Definir interfaces para mejor tipado
interface ColorShade {
  DEFAULT: string;
  50?: string;
  100?: string;
  200?: string;
  300?: string;
  400?: string;
  500?: string;
  600?: string;
  700?: string;
  800?: string;
  900?: string;
  foreground?: string;
}

interface ColorPalette {
  current: string;
  transparent: string;
  white: string;
  black: string;
  dark: string;
  primary: ColorShade;
  accent: ColorShade;
  neutral: ColorShade;
  success: ColorShade;
  danger: ColorShade;
  warning: ColorShade;
  info: ColorShade;

  // Mantener para compatibilidad
  yellow?: string | ColorShade;
  "body-color"?: string;
  "body-color-dark"?: string;
  "gray-dark"?: string;
  "gray-light"?: string;
  stroke?: string;
  "stroke-dark"?: string;
  "bg-color-dark"?: string;

  // UI components
  border: string;
  input: string;
  ring: string;
  background: string;
  foreground: string;
  secondary: ColorShade;
  destructive: ColorShade;
  muted: ColorShade;
  popover: ColorShade;
  card: ColorShade;
}

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
        black: "#0F172A", // Actualizado a un negro más moderno
        dark: "#1E293B", // Actualizado
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Primary color (Azul moderno)
        primary: {
          DEFAULT: "#4F7AFA", // Un azul ligeramente actualizado
          50: "#F0F4FF",
          100: "#E0E9FF",
          200: "#C7D7FE",
          300: "#A5BFFD",
          400: "#819DFC",
          500: "#4F7AFA", // Ligeramente ajustado del original #4A6CF7
          600: "#3D5FD0",
          700: "#2D48A8",
          800: "#1E3282",
          900: "#142159",
          foreground: "hsl(var(--primary-foreground))",
        },

        // Accent color (naranja/ámbar moderno que reemplaza al amarillo)
        accent: {
          DEFAULT: "#F79433",
          50: "#FEF7EC",
          100: "#FEEBD0",
          200: "#FDD8A5",
          300: "#FCC278",
          400: "#FAAC4C",
          500: "#F79433", // Reemplaza el amarillo original
          600: "#D37729",
          700: "#A75C1E",
          800: "#7D4515",
          900: "#52300F",
          foreground: "#FFFFFF",
        },

        // Neutral colors (escala de grises moderna)
        neutral: {
          DEFAULT: "#64748B",
          50: "#F8FAFC",
          100: "#EEF2F7",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B", // Actualizado
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },

        // Colores semánticos
        success: {
          DEFAULT: "#10B981",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },

        danger: {
          DEFAULT: "#EF4444",
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },

        warning: {
          DEFAULT: "#F59E0B",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },

        info: {
          DEFAULT: "#3B82F6",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },

        // Mantener nombres antiguos para compatibilidad con código existente
        yellow: "#F79433", // Actualizado al nuevo naranja/ámbar
        "body-color": "#64748B", // Actualizado a neutral-500
        "body-color-dark": "#94A3B8", // Actualizado a neutral-400
        "gray-dark": "#1E293B", // Actualizado a neutral-800
        "gray-light": "#F8FAFC", // Actualizado a neutral-50
        stroke: "#E2E8F0", // Actualizado a neutral-200
        "stroke-dark": "#334155", // Actualizado a neutral-700
        "bg-color-dark": "#0F172A", // Actualizado a neutral-900

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
      boxShadow: {
        signUp: "0px 5px 10px rgba(15, 23, 42, 0.1)", // Actualizado
        one: "0px 2px 3px rgba(15, 23, 42, 0.05)", // Actualizado
        two: "0px 5px 10px rgba(15, 23, 42, 0.1)", // Actualizado
        three: "0px 5px 15px rgba(15, 23, 42, 0.05)", // Actualizado
        sticky: "inset 0 -1px 0 0 rgba(203, 213, 225, 0.3)", // Actualizado
        "sticky-dark": "inset 0 -1px 0 0 rgba(51, 65, 85, 0.3)", // Actualizado
        "feature-2": "0px 10px 40px rgba(79, 122, 250, 0.12)", // Actualizado con el nuevo azul
        submit: "0px 5px 20px rgba(79, 122, 250, 0.1)", // Actualizado con el nuevo azul
        "submit-dark": "0px 5px 20px rgba(15, 23, 42, 0.2)", // Actualizado
        btn: "0px 1px 2px rgba(15, 23, 42, 0.1)", // Actualizado
        "btn-hover": "0px 2px 4px rgba(15, 23, 42, 0.15)", // Actualizado
        "btn-light": "0px 1px 2px rgba(15, 23, 42, 0.05)", // Actualizado
      },
      dropShadow: {
        three: "0px 5px 15px rgba(15, 23, 42, 0.05)", // Actualizado
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    // Add more plugins here
    // require('your-plugin-name'),
  ],
};

export default config;
