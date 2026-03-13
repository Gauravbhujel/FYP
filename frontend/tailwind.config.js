/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0f5132",
        secondary: "#198754",
        accent: "#ff6b00",
        "text-dark": "#212529",
        "text-light": "#6c757d",
        "bg-light": "#f8f9fa",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
