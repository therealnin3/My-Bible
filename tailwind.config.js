/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Colors
        primary: "#2065ee",
        "primary-focus": "#1e58cc",
        secondary: "#6420ee",
        "secondary-focus": "#501abc",
        accent: "#20eea9",
        "accent-focus": "#1bc089",

        // Background
        "base-100": "#3e4456",
        "base-200": "#262A35",
        "base-300": "#191A1F",

        // Text
        "content-100": "#EFF0F2",
        "content-200": "#8a8a8a",
      },
    },
  },
  plugins: [],
};
