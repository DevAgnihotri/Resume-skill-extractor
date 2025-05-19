module.exports = {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        accent: "hsl(var(--accent))",
        border: "hsl(var(--border))",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
      },
      animation: {
        marquee: "marquee 20s linear infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        glow: {
          "0%": { textShadow: "0 0 4px rgba(0, 0, 0, 0)" },
          "100%": { textShadow: "0 0 10px rgba(67, 139, 255, 0.8)" },
        },
      },
    },
  },
  plugins: [],
}
