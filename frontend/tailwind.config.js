/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#111111",
        "primary-light": "#333333",
        secondary: "#4b5563",
        accent: "#ff6b00",
        "accent-light": "#ff8533",
        "text-dark": "#111111",
        "text-mid": "#374151",
        "text-light": "#6b7280",
        "bg-light": "#f5f5f5",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "fade-up": "fadeSlideUp 0.7s cubic-bezier(0.4,0,0.2,1) both",
        "fade-in": "fadeIn 0.6s ease both",
        "pulse-glow": "pulseGlow 2s infinite",
        "spin-slow": "spin 2s linear infinite",
      },
      keyframes: {
        fadeSlideUp: {
          from: { opacity: 0, transform: "translateY(30px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255,107,0,0.4)" },
          "50%":      { boxShadow: "0 0 0 8px rgba(255,107,0,0)" },
        },
      },
      transitionDuration: {
        350: "350ms",
        400: "400ms",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
