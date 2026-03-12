import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "pine-green": "#0E5546",
                "pine-dark": "#0A2E23",
                "bone-white": "#F9F7F2",
                "accent-green": "#66AD83",
                "accent-gold": "#FB8B24",
                "highlight-terracotta": "#E36414",
                "green-tint": "#D4EDE0",
                "gold-tint": "#FEE8CE",
            },
            fontFamily: {
                playfair: ["var(--font-playfair)", "serif"],
                inter: ["var(--font-inter)", "sans-serif"],
            },
            keyframes: {
                "float-up": {
                    "0%": { transform: "translateY(110vh) rotate(0deg)", opacity: "0" },
                    "10%": { opacity: "0.15" },
                    "90%": { opacity: "0.15" },
                    "100%": { transform: "translateY(-20vh) rotate(45deg)", opacity: "0" },
                },
                "scale-in": {
                    "0%": { transform: "scale(0.8)", opacity: "0" },
                    "100%": { transform: "scale(1)", opacity: "1" },
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "slide-up-fade": {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                "draw-triangle": {
                    "0%": { strokeDasharray: "700", strokeDashoffset: "700" },
                    "100%": { strokeDasharray: "700", strokeDashoffset: "0" },
                },
                "glow-pulse": {
                    "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
                    "50%": { opacity: "1", transform: "scale(1.5)" },
                },
            },
            animation: {
                "scale-in": "scale-in 600ms ease-out forwards",
                "fade-in": "fade-in 600ms ease-out forwards",
                "float-up": "float-up 20s linear infinite",
                "slide-up-fade": "slide-up-fade 600ms ease-out forwards",
                "draw-triangle": "draw-triangle 800ms ease-out forwards",
                "glow-pulse": "glow-pulse 2s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
export default config;
