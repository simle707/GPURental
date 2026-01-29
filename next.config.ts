import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/__/auth/:path*',
        destination: `https://featurize-75e63.firebaseapp.com/__/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
