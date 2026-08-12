import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#050816",
          900: "#080b22",
          850: "#0a0f2e",
          800: "#0f1230"
        },
        cyan: {
          neon: "#38d8ff",
          soft: "#7fe9ff"
        },
        violet: {
          neon: "#b98bff"
        },
        pink: {
          neon: "#ff4fd8"
        }
      },
      fontFamily: {
        display: ["var(--font-space)", "Space Grotesk", "system-ui", "sans-serif"],
        sans: ["var(--font-space)", "Space Grotesk", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 32px rgba(56, 216, 255, 0.25)",
        panel: "0 24px 70px rgba(0, 0, 0, 0.42)"
      }
    }
  },
  plugins: []
};

export default config;
