export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        bg: "#0D0D0F",
        text: "#EAEAEA",
        accent: { light: "#E5E5E5", dark: "#B5B5B5" },
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(180deg,#E5E5E5,#B5B5B5)",
        "chrome-text": "linear-gradient(180deg,#FFFFFF 0%,#D8D8DC 45%,#9A9AA0 70%,#EDEDEF 100%)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        sheen: {
          "0%": { backgroundPosition: "-150% 0" },
          "100%": { backgroundPosition: "250% 0" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};
