module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'raleway': ['Raleway', 'sans-serif'],
      },
      colors: {
        'kiendamas': {
          'brown': '#8C592B',
          'cream': '#F2E2CE',
          'light-brown': '#B8860B',
        },
      },
      fontSize: {
        'kiendamas-title': ['30px', '100%'],
      },
      letterSpacing: {
        'none': '0%',
      },
    },
  },
  plugins: [],
};
