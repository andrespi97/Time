/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        libreta: "url('/img/libreta.jpg')",
      },
      maxWidth: {
        custom: "calc(100% - 16rem)",
      },
    },
  },
  plugins: [],
};
