import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Configure allowed development origins to prevent cross-origin warnings
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '172.19.186.198', // WSL network IP
    '*.local-origin.dev' // Wildcard example from docs
  ],
  turbopack: {
    resolveExtensions: [
      '.mdx',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.mjs',
      '.json',
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /node_modules/,
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
