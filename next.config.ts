import type { NextConfig } from "next";
import path from "node:path";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // Fully static site (out/) so it can be hosted on any static host.
  output: "export",
  // Emit routes as <route>/index.html so static hosts resolve them as folders.
  trailingSlash: true,
  // This project ships its own package-lock; pin the workspace root so Next
  // doesn't infer an ancestor directory that also contains a lockfile.
  turbopack: {
    root: path.join(__dirname),
  },
  // Static exports of client sites live in public/sites/<name>. Static hosts
  // serve their index.html for directory URLs; the dev server needs these
  // rewrites to do the same (rewrites aren't supported in the export build).
  ...(isDev && {
    async rewrites() {
      return [
        { source: "/sites/:site", destination: "/sites/:site/index.html" },
        { source: "/sites/:site/:path*", destination: "/sites/:site/:path*/index.html" },
      ];
    },
  }),
};

export default nextConfig;
