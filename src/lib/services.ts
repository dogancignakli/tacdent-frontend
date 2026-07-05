import type { DentalService } from "@/types";

type TranslationValues = Record<string, string | number | Date>;

type ServiceTranslator = (
  key: string,
  values?: TranslationValues
) => string;

export function getServiceName(service: DentalService, locale: string): string {
  return locale === "tr" ? service.nameTr : service.nameEn;
}

export function getServiceDescription(service: DentalService, locale: string): string {
  return locale === "tr" ? service.descriptionTr : service.descriptionEn;
}

export function formatServicePrice(
  service: Pick<DentalService, "priceFromTry" | "priceFromEur" | "durationMinutes">,
  locale: string,
  t: ServiceTranslator
): string {
  const price =
    locale === "tr"
      ? `₺${service.priceFromTry.toLocaleString("tr-TR")}`
      : `€${service.priceFromEur.toLocaleString("en-US")}`;

  return t("priceFrom", { price, minutes: service.durationMinutes });
}
