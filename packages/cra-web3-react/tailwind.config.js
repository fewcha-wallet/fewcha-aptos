module.exports = {
  mode: 'jit',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: '376px',
      sm: '460px',
      md: '768px',
      '2md': '900px',
      lg: '1024px',
      xl: '1440px',
      '2xl': '1536px'
    },
    extend: {
      colors: {
        gray: {
          100: '#f2f4f7',
          200: '#e1e4e9',
          300: '#dadcdf',
          400: '#cfd4dc',
          500: '#a0a7b5',
          600: '#9ea5b2',
          700: '#818a98',
          800: '#848c9b',
          900: '#6b7381',
        },
        normal: {
          100: '#545a65',
          200: '#3d434c',
          300: '#282c32',
          400: '#292c33',
          500: '#1e2126',
          600: '#14161a',
        },
        primary: {
          100: '#56abff',
          200: '#007efb',
          300: '#0072e2',
          400: '#005ab4',
        },
        success: {
          100: '#7ddb91',
          200: '#33b04e',
        },
        error: {
          100: '#ff6f50',
          200: '#db330e',
        },
        active: {
          100: '#5679ff',
          200: '#1e4cff',
        },
        purple: {
          100: '#6c5dd3',
        },
        pink: {
          100: '#ff98e5',
        },
        "sea-green": {
          100: '#24ba9d',
        },
        cotta: {
          100: '#ed705f',
        }
      },
    },
  },
  plugins: [],
};
