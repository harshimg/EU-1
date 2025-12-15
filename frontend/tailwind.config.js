/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./lib/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
      extend: {
        colors: {
          brand: {
            50: "#eff6ff",
            100: "#dbeafe",
            500: "#2563eb",
          }
        }
      },
    },
    plugins: [],
  }
  