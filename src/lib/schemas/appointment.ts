import { z } from "zod";

import { getTimeSlotsForDate, isValidSlotForDate } from "@/lib/working-hours";

type ValidationTranslator = (key: string) => string;

// Yalnizca rakam, bosluk ve + ( ) - karakterlerine izin ver.
const PHONE_ALLOWED = /^[0-9+()\s-]+$/;

export function createAppointmentFormSchema(t: ValidationTranslator) {
  return z
    .object({
      patientName: z.string().trim().min(1, t("patientNameRequired")).max(120),
      email: z.string().trim().email(t("emailInvalid")).max(200),
      phone: z
        .string()
        .trim()
        .min(1, t("phoneRequired"))
        .max(30)
        .regex(PHONE_ALLOWED, t("phoneInvalid"))
        .refine((v) => v.replace(/\D/g, "").length >= 10, t("phoneInvalid")),
      preferredDate: z.string().min(1, t("preferredDateRequired")),
      // Null from Base UI Select is coerced to "" in AppointmentForm before validation.
      preferredTime: z.string().min(1, t("preferredTimeRequired")),
      serviceId: z.number().int().positive(t("serviceRequired")),
      notes: z.string().max(1000).optional(),
      kvkkInformationAccepted: z.boolean(),
      kvkkExplicitConsentAccepted: z.boolean(),
    })
    .refine(
      (data) =>
        !data.preferredDate || getTimeSlotsForDate(data.preferredDate).length > 0,
      {
        message: t("closedDay"),
        path: ["preferredDate"],
      }
    )
    .refine(
      (data) =>
        !data.preferredDate ||
        !data.preferredTime ||
        isValidSlotForDate(data.preferredDate, data.preferredTime),
      {
        message: t("invalidTimeSlot"),
        path: ["preferredTime"],
      }
    )
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
