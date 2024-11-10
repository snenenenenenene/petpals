/* eslint-disable @typescript-eslint/no-require-imports */
// next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  webpack: (config) => {
    config.externals = [...(config.externals || [])];
    return config;
  }
};

module.exports = nextConfig;