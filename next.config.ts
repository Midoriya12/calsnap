
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
        hostname: 'www.themealdb.com', // Keep for now in case of any old references
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'spoonacular.com', // Add Spoonacular domain
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.spoonacular.com', // Add Spoonacular image CDN domain
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
