import { z } from "zod";

type ValidationTranslator = (key: string) => string;

export function createServiceFormSchema(t: ValidationTranslator) {
  return z.object({
    nameTr: z.string().trim().min(1, t("nameTrRequired")).max(120),
    nameEn: z.string().trim().min(1, t("nameEnRequired")).max(120),
    descriptionTr: z.string().trim().min(1, t("descriptionTrRequired")).max(500),
    descriptionEn: z.string().trim().min(1, t("descriptionEnRequired")).max(500),
    icon: z.string().max(50).optional(),
    priceFromTry: z.coerce.number().min(0, t("priceInvalid")),
    priceFromEur: z.coerce.number().min(0, t("priceInvalid")),
    durationMinutes: z.coerce.number().int().positive(t("durationInvalid")),
    displayOrder: z.coerce.number().int().min(0),
    isActive: z.boolean(),
  });
}

export type ServiceFormValues = z.infer<ReturnType<typeof createServiceFormSchema>>;
