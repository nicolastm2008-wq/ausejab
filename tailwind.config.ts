import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff8ff",
          100: "#dbeefe",
          200: "#bfe3fe",
          300: "#93d2fd",
          400: "#5fb8fa",
          500: "#3a9cf2",
          600: "#237de6",
          700: "#1c65c9",
          800: "#1c53a3",
          900: "#1c4680",
          950: "#152c4f",
        },
        aqua: {
          50: "#effcf6",
          100: "#d7f7e8",
          200: "#b2ecd4",
          300: "#7fdcba",
          400: "#48c59c",
          500: "#23a982",
          600: "#178a6a",
          700: "#146e57",
          800: "#135846",
          900: "#11493b",
          950: "#062a22",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(28, 83, 163, 0.25)",
      },
      backgroundImage: {
        "wave-pattern":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M0,64L60,58.7C120,53,240,43,360,48C480,53,600,75,720,80C840,85,960,75,1080,64C1200,53,1320,43,1380,37.3L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z'%3E%3C/path%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
