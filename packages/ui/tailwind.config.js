module.exports = {
  presets: [require("@shadcn/ui/preset")],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EAF2FF',
          300: '#4F94FF',
          500: '#1777FF',
        },
        accent: '#31E1FF',
        surface: '#FFFFFF',
      },
      borderRadius: {
        magic: '1.25rem',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
};
