module.exports = {
  content: [
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './_blog/*.html',
    './assets/js/**/*.js',
    './*.html',
    './blog/**/*.html',
    './apps/**/*.html',
    './_projects/*.md',
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
