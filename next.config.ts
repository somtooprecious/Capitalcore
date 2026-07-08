import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.coincap.io",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/my-investments", destination: "/earnings", permanent: false },
    ];
  },
};

export default nextConfig;
