export const theme = {
  colors: {
    primary: {
      DEFAULT: '#0D9488', // your new teal
      50: '#F0FDFA',
      100: '#CCFBF1',
      200: '#99F6E4',
      300: '#5EEAD4',
      400: '#2DD4BF',
      500: '#14B8A6',
      600: '#0D9488', // Main brand color
      700: '#0F766E',
      800: '#115E59',
      900: '#134E4A',
      950: '#042F2E',
    },
    secondary: {
      DEFAULT: '#8B5CF6', // purple accent
    },
    accent: {
      DEFAULT: '#10B981', // success green
    },
    neutral: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
      950: '#030712',
    }
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      heading: ['Poppins', 'sans-serif'],
    }
  },
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    6: '24px',
    8: '32px',
    12: '48px',
    16: '64px',
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  transitions: {
    fast: '200ms ease-in-out',
    normal: '300ms ease-in-out',
  }
};