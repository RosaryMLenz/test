import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/adapter-pg",
    "pg",
    "pg-cloudflare",
  ],
};

export default nextConfig;
