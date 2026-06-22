import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: [
    "@repo/ui",
    "@repo/shared",
    "@repo/types",
    "@repo/config",
    "@repo/utils",
    "@repo/validation",
  ],
};

export default nextConfig;
