import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        editor: {
          bg: "#1e1e1e",
          panel: "#252526",
          border: "#3c3c3c",
          text: "#d4d4d4",
          muted: "#8b949e",
          accent: "#0e639c",
          accentHover: "#1177bb"
        }
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.45)"
      }
    }
  },
  plugins: []
};

export default config;
