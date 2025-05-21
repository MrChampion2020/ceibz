/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  /*purge: ["./index.html", "./src/**//*.{js,ts,jsx,tsx}"],*/
  content: [
    "./src/**/*.{html,js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
