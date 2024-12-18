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
      fontFamily: {
        sans: ['Bai Jamjuree', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2DFFF9",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#DAEFFF",
          foreground: "#374151",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F8F7FC",
          foreground: "#6B7280",
        },
        accent: {
          DEFAULT: "#FF7777",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "rgba(218, 239, 255, 0.9)",
          foreground: "#374151",
        },
        brand: {
          turquoise: "#2DFFF9",
          skyBlue: "#DAEFFF", 
          coral: "#FF7777",
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
          text: {
            primary: "#374151",
            secondary: "#6B7280",
          }
        }
      },
      backgroundImage: {
        'main-gradient': 'linear-gradient(135deg, #2DFFF9 0%, #FF7777 100%)',
        'radial-gradient': 'radial-gradient(circle, rgba(45, 255, 249, 0.2) 20%, rgba(255, 119, 119, 0.1) 80%, transparent 100%)',
      },
      boxShadow: {
        'glass': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'glass-hover': '0 8px 12px -2px rgba(0, 0, 0, 0.08), 0 4px 8px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;