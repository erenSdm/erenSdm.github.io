import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // This project ships its own package-lock; pin the workspace root so Next
  // doesn't infer an ancestor directory that also contains a lockfile.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
