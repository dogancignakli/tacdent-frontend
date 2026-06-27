"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common.language");

  function switchLocale(nextLocale: Locale) {
    if (nextLocale === locale) {
      return;
    }
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "inline-flex h-8 items-center rounded-lg border bg-muted p-[3px] text-sm font-medium",
        className
      )}
    >
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={locale === code}
          onClick={() => switchLocale(code)}
          className={cn(
            "inline-flex h-[calc(100%-1px)] min-w-9 items-center justify-center rounded-md px-2 transition-all",
            locale === code
              ? "bg-background font-semibold text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t(code)}
        </button>
      ))}
    </div>
  );
}
