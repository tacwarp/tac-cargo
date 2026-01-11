import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "28px",
      },
      screens: {
        lg: "1100px",
        xl: "1240px",
      },
    },
    extend: {
      maxWidth: {
        "form": "1240px",
        "form-min": "1100px",
        "summary": "380px",
      },
      spacing: {
        "section": "28px",
        "group": "20px",
        "field": "14px",
      },
      gridTemplateColumns: {
        "12": "repeat(12, minmax(0, 1fr))",
      },
      gap: {
        "x": "20px",
        "y": "28px",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
