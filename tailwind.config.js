/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        ink: {
          50: '#f5f6f8',
          100: '#e8ebef',
          200: '#cdd3dc',
          300: '#a3adbd',
          400: '#6f7d94',
          500: '#4c5a73',
          600: '#36425b',
          700: '#262f44',
          800: '#171d2e',
          900: '#0b1120',
          950: '#060a16',
        },
        gold: {
          50: '#fbf7ec',
          100: '#f6ecc8',
          200: '#ecd78a',
          300: '#e0bd52',
          400: '#d4a74a',
          500: '#b88a2a',
          600: '#95701f',
          700: '#70531b',
          800: '#4d3a16',
          900: '#2e2210',
        },
        paper: {
          50: '#fbf9f5',
          100: '#f5f1e9',
          200: '#ebe4d4',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      backgroundImage: {
        'dot-grid':
          'radial-gradient(circle, rgba(11,17,32,0.06) 1px, transparent 1px)',
        'ink-gradient':
          'linear-gradient(135deg, #0b1120 0%, #171d2e 55%, #262f44 100%)',
        'gold-shine':
          'linear-gradient(135deg, #f6ecc8 0%, #d4a74a 45%, #95701f 100%)',
      },
      backgroundSize: {
        'dot-grid': '24px 24px',
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgb(11 17 32 / 0.08), 0 6px 20px -6px rgb(11 17 32 / 0.08)',
        'gold': '0 8px 24px -8px rgb(184 138 42 / 0.45)',
        'ink': '0 10px 30px -10px rgb(11 17 32 / 0.35)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.4s ease-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
