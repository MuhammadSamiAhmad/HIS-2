/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FEFEFE",
        textColor: "#253446",
        callToAction: "#3D5CEF",
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
    },
  },
  plugins: [],
};
