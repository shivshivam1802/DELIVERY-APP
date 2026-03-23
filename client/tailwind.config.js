/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        promart: {
          red: "#E23744",
          orange: "#FC8019",
          dark: "#1C1C1C",
          gray: "#8A8A8A",
        },
      },
      fontFamily: {
        sans: ["Proxima Nova", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
