import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://weivas.com";
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/account/", "/admin/", "/seller/", "/api/", "/auth/", "/checkout", "/cart"] }], sitemap: `${baseUrl}/sitemap.xml`, host: baseUrl };
}
