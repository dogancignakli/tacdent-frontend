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

function buildEntry(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) {
  return {
    url: `${siteUrl}${localizedPath(routing.defaultLocale, path)}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, `${siteUrl}${localizedPath(locale, path)}`]),
      ),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await fetchActiveServices();

  const staticEntries = staticPaths.map((path) =>
    buildEntry(
      path,
      path === "" ? 1 : path.startsWith("/kvkk") ? 0.3 : 0.8,
      path.startsWith("/kvkk") ? "yearly" : "monthly",
    ),
  );

  const serviceEntries = services.map((service) =>
    buildEntry(`/services/${service.id}`, 0.7, "monthly"),
  );

  return [...staticEntries, ...serviceEntries];
}
