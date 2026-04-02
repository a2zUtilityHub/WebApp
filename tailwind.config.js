/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
  	container: {
  		center: true,
  		padding: {
  			DEFAULT: '1rem',
  			sm: '1.5rem',
  			md: '2rem',
  			lg: '2rem',
  			xl: '2rem'
  		},
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		spacing: {
  			'18': '4.5rem',
  			'22': '5.5rem',
  			'4.5': '1.125rem'
  		},
  		colors: {
  			brand: {
  				primary: 'var(--color-primary)',
          'primary-light': 'var(--color-primary-light)',
          'primary-dark': 'var(--color-primary-dark)',
  				secondary: 'var(--color-secondary)',
          'secondary-light': 'var(--color-secondary-light)',
          'secondary-dark': 'var(--color-secondary-dark)',
          accent: 'var(--color-accent)',
  				'gradient-start': 'var(--color-primary)',
  				'gradient-end': 'var(--color-accent)',
  				light: 'rgba(124, 58, 237, 0.1)'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'var(--color-primary)',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'var(--color-primary)',
  				foreground: '#FFFFFF'
  			},
  			secondary: {
  				DEFAULT: 'var(--color-secondary)',
  				foreground: '#FFFFFF'
  			},
  			destructive: {
  				DEFAULT: 'var(--color-error)',
  				foreground: '#FFFFFF'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'var(--color-accent)',
  				foreground: '#FFFFFF'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			success: 'var(--color-success)',
  			warning: 'var(--color-warning)',
  			error: 'var(--color-error)',
  			info: 'var(--color-info)',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius-lg)',
  			md: 'var(--radius-md)',
  			sm: 'var(--radius-sm)',
  			xl: 'var(--radius-xl)',
  			'2xl': 'var(--radius-2xl)',
  			pill: '9999px'
  		},
  		fontFamily: {
  			sans: [
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'"SF Pro Display"',
  				'"SF Pro Text"',
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		boxShadow: {
  			'elevation-1': 'var(--shadow-sm)',
  			'elevation-2': 'var(--shadow-md)',
  			'elevation-3': 'var(--shadow-lg)',
  			glass: '0 8px 32px rgba(0, 0, 0, 0.08)',
  			glow: 'var(--shadow-brand)'
  		},
  		transitionDuration: {
  			'150': '150ms',
  			'200': '200ms',
  			'250': '250ms',
  			'300': '300ms'
  		},
  		transitionTimingFunction: {
  			apple: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  			'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: 0 },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: 0 }
  			},
  			'fade-in': {
  				'0%': { opacity: '0', transform: 'translateY(10px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			'fade-out': {
  				'0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
  				'100%': { opacity: '0', transform: 'translateY(10px) scale(0.95)' }
  			},
  			'scale-in': {
  				'0%': { transform: 'scale(0.95)', opacity: '0' },
  				'100%': { transform: 'scale(1)', opacity: '1' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in': 'fade-in 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
  			'fade-out': 'fade-out 0.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
  			'scale-in': 'scale-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}