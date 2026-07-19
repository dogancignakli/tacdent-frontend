import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localePrefix: "always",
  // HTML <link rel="alternate"> from page metadata is the single hreflang source.
  // Middleware Link headers emit broken unprefixed x-default URLs for deep pages.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
