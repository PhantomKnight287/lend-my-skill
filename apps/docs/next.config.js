const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

const isProd = process.env.NODE_ENV === "production";
/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  ...withNextra(),
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  assetPrefix: isProd ? "https://phantomknight287.github.io/lend-my-skill" : "",
  basePath: isProd ? "/lend-my-skill" : "",
};
