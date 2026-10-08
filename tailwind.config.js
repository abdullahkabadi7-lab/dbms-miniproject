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
          950: "#040507",
          900: "#08090E",
          850: "#0D0F16",
          800: "#12151E",
          700: "#181C28",
          600: "#242938",
        },
        border: {
          DEFAULT: "#181C26",
          subtle: "rgba(255, 255, 255, 0.08)",
          hover: "rgba(255, 255, 255, 0.18)",
        },
        electric: {
          DEFAULT: "#00A8FF",
          bright: "#38BDF8",
          dark: "#0077B6",
          neon: "#00E5FF",
          glow: "rgba(0, 168, 255, 0.15)",
        },
        emerald: {
          glow: "rgba(16, 185, 129, 0.15)",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#94A3B8",
          muted: "#64748B",
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        widest: '0.2em',
      }
    },
  },
  plugins: [],
}
