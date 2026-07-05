import { z } from "zod";

type ValidationTranslator = (key: string) => string;

export function createTestimonialFormSchema(t: ValidationTranslator) {
  return z.object({
    authorName: z.string().trim().min(1, t("authorRequired")).max(120),
    quoteTr: z.string().trim().min(1, t("quoteTrRequired")).max(1000),
    quoteEn: z.string().max(1000).optional(),
    rating: z.coerce.number().int().min(1).max(5).optional().nullable(),
    displayOrder: z.coerce.number().int().min(0),
    isActive: z.boolean(),
  });
}

export type TestimonialFormValues = z.infer<ReturnType<typeof createTestimonialFormSchema>>;
