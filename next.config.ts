import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["pancaran-group.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pancaran-group.com",
      },
    ],
  },
};

export default nextConfig;
