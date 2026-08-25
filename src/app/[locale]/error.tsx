"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common.errors");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-start gap-4 px-4 py-24 sm:px-6">
      <h1 className="font-heading text-3xl font-bold tracking-tight">{t("pageTitle")}</h1>
      <p className="text-muted-foreground">{t("pageDescription")}</p>
      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={reset}>
          {t("retry")}
        </Button>
        <Button render={<Link href="/" />} variant="outline">
          {t("goHome")}
        </Button>
      </div>
    </div>
  );
}
