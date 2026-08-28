import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.amarjeetmishra.com",
      },
    ],
  },
};

export default nextConfig;
