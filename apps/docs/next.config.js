const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});
/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  ...withNextra(),
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};
