/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Outfit", "system-ui", "sans-serif"],
        body: ["DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        ink: "#0c1222",
      },
      backgroundImage: {
        "grid-sliit":
          "radial-gradient(circle at 1px 1px, rgba(16,185,129,0.11) 1px, transparent 0)",
        "hero-mesh":
          "linear-gradient(135deg, #ecfdf5 0%, #e0f2fe 45%, #fae8ff 100%)",
        "card-shine":
          "linear-gradient(120deg, rgba(255,255,255,0.35) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.2) 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.75" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out forwards",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
