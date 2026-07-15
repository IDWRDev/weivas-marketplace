import type { NextConfig } from "next";
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? "/weivas-marketplace" : "",
  assetPrefix: isGitHubPages ? "/weivas-marketplace/" : undefined,
  images: { unoptimized: true },
};
export default nextConfig;
