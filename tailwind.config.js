/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#2b3544',
        },
        primary: {
          DEFAULT: '#EAB308', // Amarillo mostaza
          light: '#FDE047',   // Amarillo claro
          dark: '#CA8A04',    // Amarillo oscuro
        },
        dark: '#1F2937',
      }
    },
  },
  plugins: [require("daisyui")],
}
