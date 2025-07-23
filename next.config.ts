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
  // Configure server actions to support 50MB PDF uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  // Suppress hydration warnings in development
  reactStrictMode: true,
  // Reduce error overlay verbosity
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
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
      // Suppress webpack cache serialization warnings
      config.infrastructureLogging = {
        level: 'error',
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
