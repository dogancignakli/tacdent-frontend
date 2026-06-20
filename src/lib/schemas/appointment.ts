import { z } from "zod";

export const appointmentFormSchema = z.object({
  patientName: z.string().trim().min(1, "Full name is required.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(200),
  phone: z.string().trim().min(1, "Phone number is required.").max(30),
  preferredDate: z.string().min(1, "Preferred date is required."),
  preferredTime: z.string().min(1, "Preferred time is required."),
  serviceType: z.string().min(1, "Please select a service."),
  notes: z.string().max(1000).optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
