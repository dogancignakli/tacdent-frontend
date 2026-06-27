"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Separator } from "@/components/ui/separator";

interface FooterProps {
  showStaffLogin?: boolean;
}

export default function Footer({ showStaffLogin = true }: FooterProps) {
  const t = useTranslations("common.footer");

  return (
    <footer className="mt-auto border-t bg-card text-card-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-heading text-lg font-semibold">{t("clinic")}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("description")}</p>
        </div>
        <div>
          <p className="font-semibold">{t("hours")}</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>{t("hoursWeekdays")}</li>
            <li>{t("hoursSaturday")}</li>
            <li>{t("hoursSunday")}</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">{t("contact")}</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>{t("address")}</li>
            <li>{t("phone")}</li>
            <li>{t("email")}</li>
          </ul>
          <Link
            href="/appointments"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            {t("scheduleLink")}
          </Link>
          {showStaffLogin && (
            <Link
              href="/admin/login"
              className="mt-2 block text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              {t("staffLogin")}
            </Link>
          )}
        </div>
      </div>
      <Separator />
      <div className="py-4 text-center text-xs text-muted-foreground">
        {t("copyright", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
