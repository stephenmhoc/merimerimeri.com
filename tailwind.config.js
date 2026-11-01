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
        primary: '#FAF9F6',
        secondary: '#F0EEE9',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
