import { z } from "zod";

type ValidationTranslator = (key: string) => string;

export function createAppointmentFormSchema(t: ValidationTranslator) {
  return z
    .object({
      patientName: z.string().trim().min(1, t("patientNameRequired")).max(120),
      email: z.string().trim().email(t("emailInvalid")).max(200),
      phone: z.string().trim().min(1, t("phoneRequired")).max(30),
      preferredDate: z.string().min(1, t("preferredDateRequired")),
      preferredTime: z.string().min(1, t("preferredTimeRequired")),
      serviceId: z.number().int().positive(t("serviceRequired")),
      notes: z.string().max(1000).optional(),
      kvkkInformationAccepted: z.boolean(),
      kvkkExplicitConsentAccepted: z.boolean(),
    })
    .refine((data) => data.kvkkInformationAccepted, {
      message: t("kvkkInformationRequired"),
      path: ["kvkkInformationAccepted"],
    })
    .refine((data) => data.kvkkExplicitConsentAccepted, {
      message: t("kvkkExplicitConsentRequired"),
      path: ["kvkkExplicitConsentAccepted"],
    });
}

export type AppointmentFormValues = z.infer<ReturnType<typeof createAppointmentFormSchema>>;
