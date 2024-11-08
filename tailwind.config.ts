/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#A3BE8C", // Sage green
        secondary: "#D08770", // Terracotta
        accent: "#EBCB8B", // Cream
        background: "#FDF6E3", // Light beige
        text: "#3C3C3C", // Charcoal
      },
    },
  },
  plugins: [],
};
