import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { fetchActiveServices } from "@/lib/server/services";
import { localizedPath, siteUrl } from "@/lib/seo";

/** Public indexable paths (without locale prefix). Keep in sync with page metadata. */
const staticPaths = [
  "",
  "/services",
  "/health-tourism",
  "/about",
  "/contact",
  "/appointments",
  "/kvkk/information",
  "/kvkk/consent",
] as const;

function sitemapLastModified(): Date {
  const stamped = process.env.NEXT_PUBLIC_SITE_LAST_UPDATED;
  if (stamped) {
    const parsed = new Date(stamped);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return new Date("2026-07-17");
}

function languageAlternates(path: string): Record<string, string> {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      `${siteUrl}${localizedPath(locale, path)}`,
    ]),
  ) as Record<string, string>;
  languages["x-default"] = `${siteUrl}${localizedPath(routing.defaultLocale, path)}`;
  return languages;
}

function buildEntries(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  lastModified: Date,
): MetadataRoute.Sitemap {
  const languages = languageAlternates(path);
  return routing.locales.map((locale) => ({
    url: `${siteUrl}${localizedPath(locale, path)}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await fetchActiveServices();
  const lastModified = sitemapLastModified();

  const staticEntries = staticPaths.flatMap((path) =>
    buildEntries(
      path,
      path === "" ? 1 : path.startsWith("/kvkk") ? 0.3 : 0.8,
      path.startsWith("/kvkk") ? "yearly" : "monthly",
      lastModified,
    ),
  );

  const serviceEntries = services.flatMap((service) =>
    buildEntries(`/services/${service.id}`, 0.7, "monthly", lastModified),
  );

  return [...staticEntries, ...serviceEntries];
}
