import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  // Enable instrumentation for monitoring (Sentry, etc.)
  experimental: {
    instrumentationHook: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.themealdb.com',
        port: '',
        pathname: '/**',
      }
    ],
  },

  // Bundle analyzer configuration
  // Run with: npm run build:analyze
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config: any, { isServer }: { isServer: boolean }) => {
      if (!isServer) {
        // Only run on client bundles
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: '../analyze/client.html',
            openAnalyzer: true,
            generateStatsFile: true,
            statsFilename: '../analyze/client-stats.json',
          })
        );
      } else {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: '../analyze/server.html',
            openAnalyzer: false,
            generateStatsFile: true,
            statsFilename: '../analyze/server-stats.json',
          })
        );
      }
      return config;
    },
  }),
};

export default nextConfig;
