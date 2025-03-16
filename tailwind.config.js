const tailwindMobile = require("konsta/config");

module.exports = tailwindMobile({
  content: [
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./*.jsx",
    "./*.js",
    "./index.html",
  ],
  konsta: {
    colors: {
      primary: "#007aff",
      "brand-primary": "#007aff",
      "brand-red": "#ff3b30",
      "brand-green": "#4cd964",
      "brand-yellow": "#ffcc00",
      "brand-purple": "#9c27b0",
      "brand-blue": "#2196f3",
    },
  },
  darkMode: "class",
});
