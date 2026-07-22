import type { DentalService } from "@/types";
import {
  CLINIC,
  clinicEntityId,
  personEntityId,
  websiteEntityId,
} from "@/lib/clinic";
import { getServiceDescription, getServiceName } from "@/lib/services";
import { localizedPath, siteUrl } from "@/lib/seo";

type OpeningHoursSpec = {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string[];
  opens: string;
  closes: string;
};

function openingHoursSpecification(): OpeningHoursSpec[] {
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  return [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: weekdays,
      opens: CLINIC.openingHours.weekdays.opens,
      closes: CLINIC.openingHours.weekdays.closes,
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: CLINIC.openingHours.saturday.opens,
      closes: CLINIC.openingHours.saturday.closes,
    },
  ];
}

function areaServedGraph() {
  return CLINIC.areaServed.map((name) => ({
    "@type": "City" as const,
    name,
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: CLINIC.addressRegion,
    },
  }));
}

export function buildSiteGraph(locale: string, description: string) {
  const dentistId = clinicEntityId(siteUrl);
  const personId = personEntityId(siteUrl);
  const websiteId = websiteEntityId(siteUrl);
  const homeUrl = `${siteUrl}${localizedPath(locale)}`;
  const appointmentUrl = `${siteUrl}${localizedPath(locale, "/appointments")}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: CLINIC.alternateName,
        inLanguage: locale,
        publisher: { "@id": dentistId },
      },
      {
        "@type": "Dentist",
        "@id": dentistId,
        name: CLINIC.name,
        alternateName: CLINIC.alternateName,
        description,
        url: homeUrl,
        image: [`${siteUrl}${CLINIC.ogImagePath}`, `${siteUrl}${CLINIC.logoPath}`],
        logo: `${siteUrl}${CLINIC.logoPath}`,
        telephone: CLINIC.phoneE164,
        email: CLINIC.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: CLINIC.streetAddress,
          addressLocality: CLINIC.addressLocality,
          addressRegion: CLINIC.addressRegion,
          postalCode: CLINIC.postalCode,
          addressCountry: CLINIC.addressCountry,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: CLINIC.latitude,
          longitude: CLINIC.longitude,
        },
        hasMap: CLINIC.mapsUrl,
        sameAs: [CLINIC.gbpUrl, CLINIC.mapsUrl],
        knowsLanguage: [...CLINIC.languages],
        areaServed: areaServedGraph(),
        openingHoursSpecification: openingHoursSpecification(),
        medicalSpecialty: "Dentistry",
        potentialAction: {
          "@type": "ReserveAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: appointmentUrl,
            inLanguage: locale,
            actionPlatform: [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/MobileWebPlatform",
            ],
          },
          name: locale === "tr" ? "Online randevu talep et" : "Request an appointment online",
        },
        employee: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: "Tuğçe Aydın Çiğnaklı",
        jobTitle: locale === "tr" ? "Diş Hekimi" : "Dentist",
        worksFor: { "@id": dentistId },
        url: `${siteUrl}${localizedPath(locale, "/about")}`,
        image: `${siteUrl}/team/tugce-aydin-cignakli.webp`,
        knowsLanguage: [...CLINIC.languages],
      },
    ],
  };
}

export function buildBreadcrumbList(
  locale: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${localizedPath(locale, item.path)}`,
    })),
  };
}

export function buildOfferCatalogSchema(
  locale: string,
  services: DentalService[],
  catalogName: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: catalogName,
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: getServiceName(service, locale),
        description: getServiceDescription(service, locale),
        url: `${siteUrl}${localizedPath(locale, `/services/${service.id}`)}`,
        provider: { "@id": clinicEntityId(siteUrl) },
      },
    })),
  };
}

export function buildServiceDetailSchema(
  locale: string,
  service: DentalService,
  pageDescription: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: getServiceName(service, locale),
    description: pageDescription,
    url: `${siteUrl}${localizedPath(locale, `/services/${service.id}`)}`,
    provider: { "@id": clinicEntityId(siteUrl) },
    areaServed: areaServedGraph(),
  };
}
