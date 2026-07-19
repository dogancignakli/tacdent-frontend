import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export type SeoPageKey =
  | "home"
  | "services"
  | "about"
  | "contact"
  | "appointments"
  | "healthTourism"
  | "kvkkInformation"
  | "kvkkConsent";

/** Locale-prefixed pathname. Empty/`/` path yields `/{locale}`. */
export function localizedPath(locale: string, path: string = ""): string {
  const normalized =
    path === "/" || path === ""
      ? ""
      : path.startsWith("/")
        ? path
        : `/${path}`;
  return `/${locale}${normalized}`;
}

export function buildLanguageAlternates(path: string = ""): Record<string, string> {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, localizedPath(locale, path)]),
  ) as Record<string, string>;

  // Root `/` is the language-negotiating redirector (307). Deep pages use the
  // default locale URL so x-default never points at a 404.
  languages["x-default"] =
    path === "/" || path === "" ? "/" : localizedPath(routing.defaultLocale, path);

  return languages;
}

type BuildPageMetadataInput = {
  locale: string;
  path?: string;
  title: string;
  description: string;
  keywords?: string;
  siteName: string;
  index?: boolean;
};

export function buildPageMetadata({
  locale,
  path = "",
  title,
  description,
  keywords,
  siteName,
  index = true,
}: BuildPageMetadataInput): Metadata {
  const canonicalPath = localizedPath(locale, path);
  const ogLocale = locale === "tr" ? "tr_TR" : "en_US";
  const alternateLocale = locale === "tr" ? "en_US" : "tr_TR";

  return {
    title,
    description,
    keywords,
    robots: {
      index,
      follow: index,
    },
    alternates: {
      canonical: canonicalPath,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      alternateLocale: [alternateLocale],
      url: canonicalPath,
      siteName,
      title,
      description,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
    },
  };
}

const pagePathByKey: Record<SeoPageKey, string> = {
  home: "",
  services: "/services",
  about: "/about",
  contact: "/contact",
  appointments: "/appointments",
  healthTourism: "/health-tourism",
  kvkkInformation: "/kvkk/information",
  kvkkConsent: "/kvkk/consent",
};

export async function createPageMetadata(
  locale: string,
  page: SeoPageKey,
  options?: { index?: boolean },
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const path = pagePathByKey[page];
  const title = page === "home" ? t("title") : t(`pages.${page}.title`);
  const description =
    page === "home" ? t("description") : t(`pages.${page}.description`);

  return buildPageMetadata({
    locale,
    path,
    title,
    description,
    keywords: t("keywords"),
    siteName: t("siteName"),
    index: options?.index,
  });
}

export function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}
