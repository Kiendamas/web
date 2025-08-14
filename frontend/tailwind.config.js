module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'raleway': ['Raleway', 'sans-serif'],
        'sans': ['Raleway', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        // Paleta personalizada Kiendamas
        'kiendamas': {
          'cream': '#F7E5CD',      // Crema claro
          'beige': '#F2E2CE',      // Beige (sidebar, textos servicios)
          'lightBeige': '#FFF5DE', // Beige muy claro
          'brown': '#786044',      // Marrón medio
          'darkBrown': '#805429',  // Marrón oscuro
          'darkest': '#45220C',    // Marrón más oscuro
          'gold': '#E6AF32',       // Dorado/Amarillo
          'text': '#646464',       // Gris para títulos, iconos y textos
          'light-brown': '#8C592B', // Para compatibilidad
          'rosa':'#FFB1AE'
        },
        // Mantener algunos colores base para compatibilidad
        brown: {
          light: '#8C592B',
          DEFAULT: '#8C592B',
          dark: '#6d4422',
        }
      },
      fontSize: {
        'kiendamas-title': ['30px', { lineHeight: '100%', letterSpacing: '0%' }],
        'title': ['30px', { lineHeight: '100%', letterSpacing: '0%' }],
      },
      letterSpacing: {
        'none': '0%',
      },
    },
  },
  plugins: [],
};
