import { z } from "zod";

type ValidationTranslator = (key: string) => string;

export function createAppointmentFormSchema(t: ValidationTranslator) {
  return z.object({
    patientName: z
      .string()
      .trim()
      .min(1, t("patientNameRequired"))
      .max(120),
    email: z.string().trim().email(t("emailInvalid")).max(200),
    phone: z.string().trim().min(1, t("phoneRequired")).max(30),
    preferredDate: z.string().min(1, t("preferredDateRequired")),
    preferredTime: z.string().min(1, t("preferredTimeRequired")),
    serviceType: z.string().min(1, t("serviceRequired")),
    notes: z.string().max(1000).optional(),
  });
}

export type AppointmentFormValues = z.infer<
  ReturnType<typeof createAppointmentFormSchema>
>;
