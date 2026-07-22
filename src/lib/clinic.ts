/** Canonical NAP + geo data. Keep in sync with Google Business Profile. */
export const CLINIC = {
  /** GBP legal / display name — do not keyword-stuff. */
  name: "Diş Hekimi Tuğçe Aydın Çiğnaklı",
  alternateName: "Dt. Tuğçe Aydın Çiğnaklı",
  streetAddress: "Merkez Mahallesi, Atatürk Caddesi, 3. Sokak No:5/1",
  addressLocality: "Dalaman",
  addressRegion: "Muğla",
  postalCode: "48770",
  addressCountry: "TR",
  phoneDisplay: "+90 544 405 48 41",
  phoneE164: "+905444054841",
  email: "info@tugceaydincignakli.com",
  latitude: 36.7668752,
  longitude: 28.803814799999998,
  /** Verified Google Business Profile share link. */
  gbpUrl: "https://share.google/o2rR0f1hwLDMCLwCQ",
  mapsUrl:
    "https://www.google.com/maps/place/Di%C5%9F+Hekimi+Tu%C4%9F%C3%A7e+Ayd%C4%B1n+%C3%87i%C4%9Fnakl%C4%B1/@36.7668752,28.8038148,17z",
  logoPath: "/logo/logo-light.png",
  ogImagePath: "/og-image.jpg",
  languages: ["tr", "en"] as const,
  areaServed: ["Dalaman", "Ortaca", "Göcek", "Fethiye", "Muğla"] as const,
  openingHours: {
    weekdays: { opens: "09:00", closes: "18:00" },
    saturday: { opens: "09:00", closes: "18:00" },
  },
} as const;

export function clinicEntityId(siteUrl: string): string {
  return `${siteUrl}/#dentist`;
}

export function personEntityId(siteUrl: string): string {
  return `${siteUrl}/#dentist-person`;
}

export function websiteEntityId(siteUrl: string): string {
  return `${siteUrl}/#website`;
}
