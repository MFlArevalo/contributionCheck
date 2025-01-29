const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xs: "500px",
      },
      transitionProperty: {
        height: "height",
      },
      fontFamily: {
        sans: ["DM Sans", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        gray: {
          25: "#F7F7F8",
          50: "#EDEDED",
          150: "#D1D1DB",
          200: "#CCCCCC",
          700: "#A9A9BC",
          800: "#404040",
        },
        blue: {
          25: "#F0FAFF",
          50: "#DBF3FF",
          100: "#ADE4FF",
          600: "#296FE6",
          700: "#005985",
        },
        green: {
          50: "#EEFBF4",
          200: "#56D990",
          400: "#28E2A7",
          700: "#26A95F",
          800: "#17663A",
        },
        red: {
          50: "#FEF0F4",
          700: "#F3164E",
          800: "#AF0932",
        },
        orange: {
          50: "#FFF9EB",
          200: "#FFC233",
          600: "#C28800",
          700: "#FAAF00",
          800: "#8A6100",
        },
        "dark-light": "#d3d3d3",
        "dark-mid": "#616160",
        "dark-high": "#404040",
        "raisin-black": "#252424",
        "alice-blue": "#F0FAFF",
        "chinese-white": "#E0E0E0",
        "rich-black": "#0B0D12",
        "blue-cola": "#0090D6",
        "cyan-cobalt-blue": "#2B579A",
        "crayola": "#A9A9BC",
        "gray-x11": "#BDBDBD",
        "text-dark": "#252424",
        "raisin-black": "#252424",
        "alice-blue": "#F0FAFF",
        "chinese-white": "#E0E0E0",
        "rich-black": "#0B0D12",
        "blue-cola": "#0090D6",
        "cyan-cobalt-blue": "#2B579A",
        crayola: "#A9A9BC",
      },
      keyframes: {
        fadeOutRight: {
          '0%' : {transform: 'translateX(0)', opacity: 1},
          '100%': {transform: 'translateX(100%)', opacity: 0}
        }
      },
      animation: {
        'fadeOutRight': 'fadeOutRight 0.5s ease-in-out forwards'
      },
      gridTemplateColumns: {
        'autofit-140px': 'repeat(auto-fit, minmax(140px, max-content))',
        '2-100px-140px': 'repeat(2, minmax(100px, 140px))',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    plugin(function ({ addBase }) {
      addBase({
        html: { fontSize: "14px" },
      });
    }),
  ],
};
