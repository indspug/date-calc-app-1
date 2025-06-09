// postcss.config.mjs
export default {
  plugins: {
    // ここを tailwindcss から @tailwindcss/postcss に変更
    '@tailwindcss/postcss': {},
    //autoprefixer: {},
  }
}