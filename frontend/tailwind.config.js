/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FEFEFE",
        textColor: "#253446",
        callToAction: {
          DEFAULT: "#3D5CEF", // 100% opacity
          50: "#3D5CEF0D", // 5% opacity
          100: "#3D5CEF1A", // 10% opacity
          200: "#3D5CEF33", // 20% opacity
          300: "#3D5CEF4D", // 30% opacity
          400: "#3D5CEF66", // 40% opacity
          500: "#3D5CEF80", // 50% opacity
          600: "#3D5CEF99", // 60% opacity
          700: "#3D5CEFB3", // 70% opacity
          800: "#3D5CEFCC", // 80% opacity
          900: "#3D5CEFE6", // 90% opacity
        },
        Silver: {
          1: "#7E899E",
          2: "#ACB3C3",
          3: "#E0E1E6",
          4: "#E9EAEC",
          5: "#F3F4F6",
          6: "#F0F2FE",
        },
        UtilColors: {
          Blue: "#63ADFF",
          Pink: "#E8588A",
          Green: "#46B988",
          Orange: "#FDB335",
          Red: "#E95151",
        },
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
      fontWeight: {
        extralight: 200,
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
    },
  },
  plugins: [],
};
