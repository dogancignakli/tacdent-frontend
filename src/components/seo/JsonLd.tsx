import { getTranslations } from "next-intl/server";
import { localizedPath, siteUrl } from "@/lib/seo";

const CLINIC_GEO = {
  latitude: 36.7668752,
  longitude: 28.803814799999998,
} as const;

type JsonLdProps = {
  locale: string;
};

export default async function JsonLd({ locale }: JsonLdProps) {
  const tFooter = await getTranslations({ locale, namespace: "common.footer" });
  const tMeta = await getTranslations({ locale, namespace: "metadata" });

  const schema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: tFooter("clinic"),
    description: tMeta("description"),
    url: `${siteUrl}${localizedPath(locale)}`,
    image: `${siteUrl}/og-image.jpg`,
    telephone: tFooter("phone"),
    email: tFooter("email"),
    address: {
      "@type": "PostalAddress",
      streetAddress: tFooter("address"),
      addressLocality: "Dalaman",
      addressRegion: "Muğla",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CLINIC_GEO.latitude,
      longitude: CLINIC_GEO.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
