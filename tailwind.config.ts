import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#654c8e",
          "primary-soft": "#b497d6",
          "deep-luxury": "#2f2147",
          accent: "#8e6cc4",
          "light-section": "#f3effa",
          "text-dark": "#1c1c1c",
          gold: "#c9a96e",
          "gold-soft": "#e8d5b0",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        arabic: ["var(--font-noto-arabic)", "serif"],
      },
      screens: {
        xs: "480px",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
