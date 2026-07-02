import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/investment-plans", destination: "/trading", permanent: false },
      { source: "/my-plans", destination: "/earnings", permanent: false },
      { source: "/my-investments", destination: "/earnings", permanent: false },
    ];
  },
};

export default nextConfig;
