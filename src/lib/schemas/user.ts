import { z } from "zod";

export const createUserFormSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(200),
  password: z.string().min(8, "Password must be at least 8 characters.").max(200),
  role: z.enum(["Admin", "Staff"]),
});

export const resetPasswordFormSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters.").max(200),
});

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
