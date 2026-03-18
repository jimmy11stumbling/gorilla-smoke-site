import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "pulse-slow": {
          '0%, 100%': {
            transform: 'scale(1)', 
            opacity: '1'
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: '0.9'
          },
        },
        "fadeIn": {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        "shimmer": {
          '0%': {
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundPosition: '200% 0',
          },
        },
        "float": {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        "kenBurns": {
          '0%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1.15)' },
        },
        "ember-rise": {
          '0%':   { transform: 'translateY(0) translateX(0px)',    opacity: '0.9' },
          '40%':  { transform: 'translateY(-35vh) translateX(12px)', opacity: '0.6' },
          '70%':  { transform: 'translateY(-65vh) translateX(-8px)', opacity: '0.25' },
          '100%': { transform: 'translateY(-100vh) translateX(4px)', opacity: '0' },
        },
        "glitch": {
          '0%,100%': { transform: 'translate(0,0)',     textShadow: 'none' },
          '10%':     { transform: 'translate(-4px,2px)', textShadow: '3px 0 #ff6a00, -3px 0 #004cff' },
          '20%':     { transform: 'translate(4px,-2px)', textShadow: '-3px 0 #ff6a00,  3px 0 #004cff' },
          '30%':     { transform: 'translate(-3px,0)',   textShadow: '2px 0 #ff6a00' },
          '45%':     { transform: 'translate(0,0)',      textShadow: 'none' },
          '60%':     { transform: 'translate(3px,1px)',  textShadow: '-2px 0 #ff6a00' },
          '75%':     { transform: 'translate(-2px,-1px)',textShadow: '1px 0 #004cff' },
          '88%':     { transform: 'translate(0,0)',      textShadow: 'none' },
        },
        "punch-in": {
          '0%':   { transform: 'scale(1.14)' },
          '55%':  { transform: 'scale(0.96)' },
          '80%':  { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        "wipe-in-right": {
          '0%':   { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0% 0 0)' },
        },
        "wipe-in-left": {
          '0%':   { clipPath: 'inset(0 0 0 100%)' },
          '100%': { clipPath: 'inset(0 0 0 0%)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "pulse-slow":     "pulse-slow 3s ease-in-out infinite",
        "fadeIn":         "fadeIn 0.5s ease-out forwards",
        "shimmer":        "shimmer 2s linear infinite",
        "float":          "float 6s ease-in-out infinite",
        "kenBurns":       "kenBurns 20s ease-out infinite alternate",
        "fadeInLeft":     "fadeIn 0.7s ease-out forwards",
        "fadeInRight":    "fadeIn 0.7s ease-out forwards",
        "ember-rise":     "ember-rise 5s ease-out infinite",
        "glitch":         "glitch 0.7s steps(1) 1 forwards",
        "punch-in":       "punch-in 0.75s cubic-bezier(0.175,0.885,0.32,1.275) 1 forwards",
        "wipe-in-right":  "wipe-in-right 0.85s cubic-bezier(0.77,0,0.175,1) forwards",
        "wipe-in-left":   "wipe-in-left 0.85s cubic-bezier(0.77,0,0.175,1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
