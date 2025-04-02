/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        libre: ["var(--font-libre)"],
        amiri: ["var(--font-amiri)"],
      },
      boxShadow: {
        custom: "0 10px 15px rgba(0.5, 0.5, 0.5, 0.5)", // Adjust values as needed
      },
    },
    colors: {
      white: "#ffffff",
      background: "#ffffff",
      black: "#000000",
      grey: "#ffffff",
      brown: "#f0ece8",
      gold: "#e1c782",
      brown_headline: "#C9BCB4",
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
