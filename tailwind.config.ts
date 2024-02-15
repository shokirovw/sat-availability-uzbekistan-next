import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['var(--font-roboto)'],
        publicsans: ['var(--font-public-sans)'],
      },
      colors: {
        'primary': '#202A72',
        'whitetext': 'white',
        'secondary': '#4F65C6',
        'blacktext': '#1E1E1E'
      },
    },
  },
  plugins: [],
};
export default config;
