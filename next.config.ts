// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: process.env.NODE_ENV !== "production",
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: process.env.NODE_ENV !== "production",
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "stream-nest.b-cdn.net",
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "lh3.googleusercontent.com",
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//         pathname: "/**",
//       },
//     ],
//   },
//   experimental: {
//     serverActions: {
//       bodySizeLimit: "50mb",
//     },
//   },
//   output: "standalone",
// };

// export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { hostname: "stream-nest.b-cdn.net", protocol: "https", pathname: "/**" },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
