import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "stream-nest.b-cdn.net", protocol: "https", pathname: "/**" },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
