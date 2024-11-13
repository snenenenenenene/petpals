/* eslint-disable @typescript-eslint/no-require-imports */
// next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    config.externals = [...(config.externals || [])];
    return config;
  }
};

module.exports = nextConfig;
