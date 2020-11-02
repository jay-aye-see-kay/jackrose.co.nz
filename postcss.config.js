const purgecss = [
  "@fullhuman/postcss-purgecss",
  {
    content: ["./components/**/*.tsx", "./pages/**/*.tsx", "./css/**/*.css"],
    defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
  },
];

module.exports = {
  plugins: [
    "postcss-import",
    "tailwindcss",
    "postcss-nested",
    "autoprefixer",
    purgecss,
    // to disable in dev mode:
    // ...(process.env.NODE_ENV === "production" ? [purgecss] : [])
  ],
};
