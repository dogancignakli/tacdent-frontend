"use client";

import { useLocale, useTranslations } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Full document navigation (real <a href>) so a browser-translated DOM is never
 * reconciled by React across locales — that path caused NotFoundError on removeChild.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations("common.language");

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "inline-flex h-8 items-center rounded-lg border bg-muted p-[3px] text-sm font-medium",
        className
      )}
    >
      {routing.locales.map((code) => {
        const isActive = locale === code;
        const classNameForOption = cn(
          "inline-flex h-[calc(100%-1px)] min-w-9 items-center justify-center rounded-md px-2 transition-all",
          isActive
            ? "bg-background font-semibold text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        );

        if (isActive) {
          return (
            <span key={code} aria-current="true" className={classNameForOption}>
              {t(code)}
            </span>
          );
        }

        const href = getPathname({ href: pathname, locale: code });

        return (
          <a key={code} href={href} hrefLang={code} className={classNameForOption}>
            {t(code)}
          </a>
        );
      })}
    </div>
  );
}
