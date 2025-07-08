import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.s3.ap-southeast-2.amazonaws.com',
      },
    ],
  },
  // experimental: {
  //     ppr: 'incremental'
  // }
};

export default nextConfig;
