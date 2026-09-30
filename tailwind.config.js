/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        surface: {
          900: "#050505",
          800: "#0A0A0A",
          700: "#121212",
        },
        border: "#1A1A1A",
        electric: {
          DEFAULT: "#00A8FF",
          bright: "#29C5FF",
          dark: "#0077B6",
          glow: "rgba(0, 168, 255, 0.15)",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#A0A0A0",
          muted: "#666666",
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', '"Inter"', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        widest: '0.2em',
      }
    },
  },
  plugins: [],
}
