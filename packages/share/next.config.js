const { config } = require("./config/config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: config.basePath,
};

module.exports = nextConfig;
