import type { DentalService } from "@/types";

type TranslationValues = Record<string, string | number | Date>;

type ServiceTranslator = (
  key: string,
  values?: TranslationValues
) => string;

export function localizeServiceName(
  service: Pick<DentalService, "id" | "name">,
  t: ServiceTranslator
): string {
  const key = `items.${service.id}.name`;
  const translated = t(key);
  return translated === key ? service.name : translated;
}

export function localizeServiceDescription(
  service: Pick<DentalService, "id" | "description">,
  t: ServiceTranslator
): string {
  const key = `items.${service.id}.description`;
  const translated = t(key);
  return translated === key ? service.description : translated;
}

export function formatServicePrice(
  priceFrom: number,
  durationMinutes: number,
  locale: string,
  t: ServiceTranslator
): string {
  const price =
    locale === "tr"
      ? `₺${priceFrom.toLocaleString("tr-TR")}`
      : `$${priceFrom.toLocaleString("en-US")}`;

  return t("priceFrom", { price, minutes: durationMinutes });
}
