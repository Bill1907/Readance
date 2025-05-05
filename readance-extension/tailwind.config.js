/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./popup.html",
    "./options.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3498db",
          light: "#5dade2",
          dark: "#2980b9",
        },
        secondary: {
          DEFAULT: "#f1f1f1",
          dark: "#dcdcdc",
        },
      },
    },
  },
  plugins: [],
};
