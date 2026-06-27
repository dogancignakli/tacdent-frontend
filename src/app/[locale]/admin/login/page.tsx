"use client";

import { useMemo } from "react";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { login } from "@/lib/api";
import { createLoginFormSchema, type LoginFormValues } from "@/lib/schemas/login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const t = useTranslations("admin.login");
  const tButtons = useTranslations("common.buttons");
  const tValidation = useTranslations("validation");
  const tErrors = useTranslations("common.errors");

  const loginFormSchema = useMemo(
    () => createLoginFormSchema((key) => tValidation(key)),
    [tValidation]
  );

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      await login(values);
      toast.success(t("welcomeBack"));
      router.push("/admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : tErrors("loginFailed"));
    }
  }

  const { errors, isSubmitting } = form.formState;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-16 sm:px-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                {...form.register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...form.register("password")}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full rounded-full">
              {isSubmitting ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  {tButtons("signingIn")}
                </>
              ) : (
                tButtons("signIn")
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
