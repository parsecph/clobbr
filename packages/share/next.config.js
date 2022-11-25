const { config } = require('./config/config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: config.basePath,
  experimental: {
    externalDir: true
  },

  webpack: (config, { buildId, dev }) => {
    config.resolve.symlinks = false;
    return config;
  }
};

module.exports = nextConfig;
