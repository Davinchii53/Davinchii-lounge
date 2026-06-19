import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'three', 'framer-motion'],
  },
};

export default nextConfig;
