/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Shopify Polaris color palette
        shopify: {
          50: '#f4f9f8',
          100: '#e5f3f0',
          200: '#c8e6df',
          300: '#9cd4c7',
          400: '#6bbea9',
          500: '#4ba58f',
          600: '#008060',
          700: '#006e52',
          800: '#005a45',
          900: '#004838',
          950: '#00332a',
        },
        surface: {
          DEFAULT: '#ffffff',
          subdued: '#fafbfb',
          hovered: '#f7f8f9',
          pressed: '#f3f4f5',
          disabled: '#fafbfb',
        },
        text: {
          DEFAULT: '#202223',
          subdued: '#6d7175',
          disabled: '#919395',
        },
        border: {
          DEFAULT: '#c9cccf',
          subdued: '#e3e5e7',
          strong: '#898f94',
        },
        action: {
          primary: '#008060',
          'primary-hovered': '#006e52',
          'primary-pressed': '#005a45',
          secondary: '#303030',
          'secondary-hovered': '#1a1a1a',
        },
        interactive: {
          DEFAULT: '#2c6ecb',
          hovered: '#1f5199',
          pressed: '#103262',
        },
        critical: {
          DEFAULT: '#d72c0d',
          subdued: '#fef1ef',
          text: '#d72c0d',
        },
        warning: {
          DEFAULT: '#ffc453',
          subdued: '#fff5ea',
          text: '#916a00',
        },
        success: {
          DEFAULT: '#008060',
          subdued: '#e5f3f0',
          text: '#004838',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        'polaris-sm': '0 1px 0 0 rgba(0,0,0,.05)',
        'polaris': '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.15)',
        'polaris-md': '0 4px 8px -2px rgba(0,0,0,.2)',
        'polaris-lg': '0 8px 16px -4px rgba(0,0,0,.25)',
        'polaris-xl': '0 12px 24px -6px rgba(0,0,0,.3)',
      },
      borderRadius: {
        'polaris': '8px',
        'polaris-lg': '12px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

