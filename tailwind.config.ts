import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF6FA",
        ink: "#3A1F4D",
        plum: "#6B3F8A",
        bubble: "#FFB3D9",
        rose: "#FF8FBF",
        magenta: "#E957A8",
        lavender: "#C8B0FF",
        peri: "#A8B5FF",
        mint: "#B5F0DA",
        butter: "#FFE9A8",
        sky: "#CDE6FF",
        axolotl: "#FFA8C8"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "serif"],
        hand: ["var(--font-hand)", "cursive"],
        pixel: ["var(--font-pixel)", "monospace"]
      },
      boxShadow: {
        card: "0 18px 40px -18px rgba(58,31,77,0.35), 0 2px 4px rgba(58,31,77,0.08)",
        pop: "0 26px 60px -22px rgba(233,87,168,0.45)",
        glow: "0 0 40px rgba(255,143,191,0.5)"
      }
    }
  },
  plugins: []
};
export default config;
