/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // enables manual theme toggling
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#4A7C59", // elegant green tone
          dark: "#9be7b1", // soft mint green for dark mode
        },
        accent: {
          light: "#FF7EB6", // pink highlight for links/buttons
          dark: "#7ee0a0", // mint accent in dark mode
        },
        background: {
          light: "#F9FAFB", // soft off-white background
          dark: "#0E1117", // deep gray-blue for dark mode
        },
        card: {
          light: "#FFFFFF", // card background (light)
          dark: "#1A1D23", // card background (dark)
        },
        text: {
          light: "#1F2937", // neutral gray for body text
          dark: "#E5E7EB", // soft white for dark text
        },
      },
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.05)",
        glow: "0 0 25px rgba(157, 255, 205, 0.2)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "Avenir",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.6s ease-out forwards",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.text.light"),
            a: {
              color: theme("colors.primary.light"),
              textDecoration: "none",
              fontWeight: "500",
              "&:hover": { color: theme("colors.accent.light") },
            },
            h1: { color: theme("colors.text.light"), fontWeight: "700" },
            h2: { color: theme("colors.text.light"), fontWeight: "600" },
            h3: { color: theme("colors.text.light"), fontWeight: "600" },
            blockquote: {
              borderLeftColor: theme("colors.primary.light"),
              fontStyle: "italic",
              color: theme("colors.text.light"),
            },
            strong: { color: theme("colors.text.light") },
          },
        },
        invert: {
          css: {
            color: theme("colors.text.dark"),
            a: {
              color: theme("colors.primary.dark"),
              "&:hover": { color: theme("colors.accent.dark") },
            },
            h1: { color: theme("colors.text.dark") },
            h2: { color: theme("colors.text.dark") },
            blockquote: {
              borderLeftColor: theme("colors.primary.dark"),
              color: theme("colors.text.dark"),
            },
            strong: { color: theme("colors.text.dark") },
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
  ],
};
