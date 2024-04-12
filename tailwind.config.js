/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";
const colors = require('tailwindcss/colors')
module.exports = {
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

    },
  },
  darkMode: 'class',
  plugins: [nextui({
    themes: {
      light: {
        layout: {},
        colors: {
          background: "#FFFFFF", // or DEFAULT
          foreground: "#f5a524", // or 50 to 900 DEFAULT
          primary: {
            foreground: "#FFFFFF",
            DEFAULT: "#F7B750",
          },
          focus: "#fdedd3",
          secondary: {
            50: '#020617',
            100: "#FFFFFF",
            DEFAULT: "#FFFFFF",
          }
        }
      },
      dark: {
        layout: {},
        colors: {
          background: "#000000", // or DEFAULT
          foreground: "#f5a524", // or 50 to 900 DEFAULT
          primary: {
            foreground: "#FFFFFF",
            DEFAULT: "#F7B750",
          },
          secondary: {
            50: '#f8fafc',
            100: "#000000",
            DEFAULT: "#FFFFFF",
          }
        }
      },
    }
  })],
};
