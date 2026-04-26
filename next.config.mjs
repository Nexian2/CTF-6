/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/api/readfile": ["./flag.txt"],
    },
  },
};

export default nextConfig;
