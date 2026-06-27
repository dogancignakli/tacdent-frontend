import { z } from "zod";

type ValidationTranslator = (key: string) => string;

export function createUserFormSchema(t: ValidationTranslator) {
  return z.object({
    email: z.string().trim().email(t("emailInvalid")).max(200),
    password: z.string().min(8, t("passwordMin")).max(200),
    role: z.enum(["Admin", "Staff"]),
  });
}

export function createResetPasswordFormSchema(t: ValidationTranslator) {
  return z.object({
    password: z.string().min(8, t("passwordMin")).max(200),
  });
}

export type CreateUserFormValues = z.infer<ReturnType<typeof createUserFormSchema>>;
export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof createResetPasswordFormSchema>
>;
