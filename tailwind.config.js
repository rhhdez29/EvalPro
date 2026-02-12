/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#EAB308', // Amarillo mostaza
          light: '#FDE047',   // Amarillo claro
          dark: '#CA8A04',    // Amarillo oscuro
        },
        dark: '#1F2937',
      }
    },
  },
  plugins: [],
}
