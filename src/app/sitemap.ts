import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedPath, siteUrl } from "@/lib/seo";

/** Public indexable paths (without locale prefix). Keep in sync with page metadata. */
const paths = [
  "",
  "/services",
  "/health-tourism",
  "/about",
  "/contact",
  "/appointments",
  "/kvkk/information",
  "/kvkk/consent",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `${siteUrl}${localizedPath(routing.defaultLocale, path)}`,
    lastModified: new Date(),
    changeFrequency: path.startsWith("/kvkk") ? "yearly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/kvkk") ? 0.3 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, `${siteUrl}${localizedPath(locale, path)}`]),
      ),
    },
  }));
}
