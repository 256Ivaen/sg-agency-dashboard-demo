/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: '#F9D769', 
        secondary: '#734D20',  
        
        'primary-scale': {
          50: '#FEF7E6',
          100: '#FDECC0',
          200: '#FCE099',
          300: '#FBD472',
          400: '#F9D769',
          500: '#E8C547',
          600: '#D4B332',
          700: '#B8981F',
          800: '#9C7E0F',
          900: '#734D20',
          950: '#5A3C19',
        },
        
        'secondary-scale': {
          50: '#F7F3ED',
          100: '#EDE4D3',
          200: '#DBC9A7',
          300: '#C9AE7B',
          400: '#734D20',
          500: '#654218',
          600: '#573716',
          700: '#492C14',
          800: '#3B2212',
          900: '#2D1A0F',
          950: '#1F110A',
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        skeleton: "hsl(var(--skeleton))",
        border: "hsl(var(--btn-border))",
        input: "hsl(var(--input))",
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #F9D769 0%, #E8C547 50%, #734D20 100%)',
        'gradient-primary-soft': 'linear-gradient(135deg, #F9D769 0%, #E8C547 100%)',
        'gradient-primary-dark': 'linear-gradient(135deg, #734D20 0%, #5A3C19 100%)',
        'gradient-primary-reverse': 'linear-gradient(135deg, #734D20 0%, #E8C547 50%, #F9D769 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #734D20 0%, #654218 50%, #2D1A0F 100%)',
        'gradient-secondary-soft': 'linear-gradient(135deg, #734D20 0%, #654218 100%)',
      },
      animation: {
        'skew-scroll': 'skew-scroll 20s linear infinite',
        'ripple': 'ripple 2s ease calc(var(--i, 0) * 0.2s) infinite',
        'orbit': 'orbit calc(var(--duration) * 1s) linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      keyframes: {
        'skew-scroll': {
          '0%': {
            transform: 'rotateX(20deg) rotateZ(-20deg) skewX(20deg) translateZ(0) translateY(0)',
          },
          '100%': {
            transform: 'rotateX(20deg) rotateZ(-20deg) skewX(20deg) translateZ(0) translateY(-100%)',
          },
        },
        'ripple': {
          '0%, 100%': { 
            transform: 'translate(-50%, -50%) scale(1)' 
          },
          '50%': { 
            transform: 'translate(-50%, -50%) scale(0.9)' 
          },
        },
        'orbit': {
          '0%': {
            transform: 'rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)',
          },
        },
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        input: [
          "0px 2px 3px -1px rgba(0, 0, 0, 0.1)",
          "0px 1px 0px 0px rgba(25, 28, 33, 0.02)",
          "0px 0px 0px 1px rgba(25, 28, 33, 0.08)",
        ].join(", "),
      },
      gridTemplateColumns: {
        '10': 'repeat(10, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-7': 'span 7 / span 7',
        'span-3': 'span 3 / span 3',
      },
    },
  },
  plugins: [], // Removed @tailwindcss/forms
  variants: {
    extend: {
      backgroundColor: ['checked', 'hover', 'checked:hover'],
      borderColor: ['checked', 'hover', 'checked:hover'],
      textColor: ['checked', 'hover', 'checked:hover'],
    },
  }
}