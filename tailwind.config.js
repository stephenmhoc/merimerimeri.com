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
        primary: '#FAFAFA',
        secondary: '#F0F0F0',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
