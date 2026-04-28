const konstaConfig = require("konsta/config");

module.exports = konstaConfig({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: "class",
});
