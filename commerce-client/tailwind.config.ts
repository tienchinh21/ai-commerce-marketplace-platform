import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          night: "#000000",
          "night-elevated": "#0a0a0a",
          light: "#ffffff",
          cream: "#fbfbf5",
        },
        surface: {
          "elevated-dark": "#1e2c31",
        },
        aloe: {
          10: "#c1fbd4",
        },
        pistachio: {
          10: "#d4f9e0",
        },
        hairline: {
          light: "#e4e4e7",
          dark: "#1e2c31",
        },
        shade: {
          30: "#d4d4d8",
          40: "#a1a1aa",
          50: "#71717a",
          60: "#52525b",
          70: "#3f3f46",
        },
        ink: "#000000",
        "on-primary": "#ffffff",
        link: {
          "cool-1": "#9dabad",
          "cool-2": "#9797a2",
          "cool-3": "#bdbdca",
          mint: "#99b3ad",
        },
      },
      boxShadow: {
        "elevation-1": "0 1px 2px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.04)",
        "elevation-2": "0 0 0 1px rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.3), 0 5px 10px rgba(0,0,0,0.2)",
        "elevation-3": "0 8px 8px rgba(0,0,0,0.06), 0 4px 4px rgba(0,0,0,0.05), 0 2px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06)",
        "elevation-4": "0 25px 50px -12px rgba(0,0,0,0.25)",
      },
      borderRadius: {
        pill: "9999px",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "Inter",
          "Neue Haas Grotesk Display",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
