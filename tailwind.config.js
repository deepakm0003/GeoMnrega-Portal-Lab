/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sidebar-bg': '#1a2b3c',
        'navbar-bg': '#f8f9fa',
        'hover-blue': '#e1f5fe',
        'accent-blue': '#007bff',
      }
    },
  },
  plugins: [],
}
