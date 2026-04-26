import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Ensure flag.txt is bundled into the serverless function
    outputFileTracingIncludes: {
      "/api/readfile": ["./flag.txt"],
    },
  },
};

export default nextConfig;
