import { z } from "zod";

type ValidationTranslator = (key: string) => string;

export function createLoginFormSchema(t: ValidationTranslator) {
  return z.object({
    email: z.string().trim().email(t("emailInvalid")).max(200),
    password: z.string().min(1, t("passwordRequired")),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginFormSchema>>;
