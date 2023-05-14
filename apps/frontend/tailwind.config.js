/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        white: "#e5e5e5",
        black: "#000814",
        primary: "#ffd60a",
        secondary: "#ebf2ff",
        accent: "#fbff05",
      },
    },
  },
  plugins: [],
};
