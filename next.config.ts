import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['images.unsplash.com', 'img.freepik.com', 'res.cloudinary.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
