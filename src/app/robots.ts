import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  let host = "tugceaydincignakli.com";
  try {
    host = new URL(siteUrl).host;
  } catch {
    // keep default
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/tr/admin", "/en/admin", "/admin", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host,
  };
}
