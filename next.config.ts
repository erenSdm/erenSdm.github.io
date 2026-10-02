import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // This project ships its own package-lock; pin the workspace root so Next
  // doesn't infer an ancestor directory that also contains a lockfile.
  turbopack: {
    root: path.join(__dirname),
  },
  // Static exports of client sites live in public/sites/<name>. Public files are
  // matched first, so these only catch directory URLs and serve their index.html.
  async rewrites() {
    return [
      { source: "/sites/:site", destination: "/sites/:site/index.html" },
      { source: "/sites/:site/:path*", destination: "/sites/:site/:path*/index.html" },
    ];
  },
};

export default nextConfig;
