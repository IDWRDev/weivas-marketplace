import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://weivas.com";
  const pages = ["", "/about", "/help", "/buyer-protection", "/support", "/legal/privacy", "/legal/terms", "/legal/cookies", "/accessibility", "/sell"];
  return pages.map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency: path === "" ? "daily" : "monthly", priority: path === "" ? 1 : 0.6 }));
}
