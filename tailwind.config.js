module.exports = {
  content: [
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './_posts/*.md',
    './*.html',
    './blog/**/*.html',
    './consulting/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFA',
        secondary: '#F5F4E9',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
