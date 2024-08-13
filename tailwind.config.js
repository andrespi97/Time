/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        libreta: "url('/img/libreta.jpg')",
      },
      fontSize: {
        "table-lg": "1.125rem", // Tamaño de texto grande para las celdas de la tabla
        "table-xl": "1.25rem", // Tamaño de texto extra grande para las celdas de la tabla
      },
    },
  },
  plugins: [],
};
