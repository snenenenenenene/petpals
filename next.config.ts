/* eslint-disable @typescript-eslint/no-require-imports */
// next.config.ts
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  webpack: (config) => {
    config.externals = [...(config.externals || [])];
    return config;
  }
};

module.exports = withNextIntl(nextConfig);