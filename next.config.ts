import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  turbopack: {
    // Pin workspace root to this project so Next doesn't pick up a parent lockfile.
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
