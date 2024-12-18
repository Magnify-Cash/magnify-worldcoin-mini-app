import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
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
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
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
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        modern: {
          // Primary Colors
          purple: {
            light: "#D6BCFA",
            DEFAULT: "#9B87F5",
            dark: "#7E69AB"
          },
          blue: {
            light: "#D3E4FD",
            DEFAULT: "#6D8BFF",
            dark: "#4A5FC9"
          },
          // Background Colors
          background: {
            light: "#F8F7FC",
            DEFAULT: "#F1F0FB",
            dark: "#E5E4F3"
          },
          // UI Elements
          card: "rgba(255, 255, 255, 0.95)",
          border: "rgba(255, 255, 255, 0.2)",
          glass: "rgba(255, 255, 255, 0.8)",
          // Status Colors
          success: {
            light: "#86EFAC",
            DEFAULT: "#22C55E",
            dark: "#16A34A"
          },
          warning: {
            light: "#FCD34D",
            DEFAULT: "#F59E0B",
            dark: "#D97706"
          },
          error: {
            light: "#FCA5A5",
            DEFAULT: "#EF4444",
            dark: "#DC2626"
          },
          // Neutral Colors
          neutral: {
            100: "#F8F7FC",
            200: "#E5E4F3",
            300: "#D1D0E4",
            400: "#9D9BB5",
            500: "#6B6987",
            600: "#4A485F",
            700: "#2D2C3D",
            800: "#1D1C2B",
            900: "#0F0E1A"
          }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'purple-gradient': 'linear-gradient(135deg, var(--purple-start) 0%, var(--purple-end) 100%)',
        'blue-gradient': 'linear-gradient(135deg, var(--blue-start) 0%, var(--blue-end) 100%)',
      },
      boxShadow: {
        'glass': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'glass-hover': '0 8px 12px -2px rgba(0, 0, 0, 0.08), 0 4px 8px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.12)',
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;