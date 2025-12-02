
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
};

export default nextConfig;
