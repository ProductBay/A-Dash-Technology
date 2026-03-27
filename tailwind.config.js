/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#05070d",
        glow: "#6cf2ff",
      },
      boxShadow: {
        glow: "0 0 40px rgba(108,242,255,0.25)",
      },
    },
  },
  plugins: [],
};
