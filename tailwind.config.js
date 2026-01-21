/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7a1f2b", // burgundy
          hover: "#611822",
          soft: "#f4e6e8",
        },
        surface: {
          DEFAULT: "#fafafa",
        },
        text: {
          primary: "#1f2937",
          secondary: "#6a7282",
        },
        border: {
          DEFAULT: "#d1d5db",
        },
      },
    },
  },
  plugins: [],
};
