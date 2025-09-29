import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  webpack: (config) => {
    config.infrastructureLogging = {
      ...(config.infrastructureLogging || {}),
      level: "error",
    };
    return config;
  },
};

export default nextConfig;
