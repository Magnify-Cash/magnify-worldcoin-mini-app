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
        modern: {
          purple: "#B66DFF",
          blue: "#6D8BFF",
          background: "#F8F7FC",
          card: "rgba(255, 255, 255, 0.9)",
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'purple-gradient': 'linear-gradient(135deg, #B66DFF 0%, #6D8BFF 100%)',
      },
      boxShadow: {
        'glass': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
