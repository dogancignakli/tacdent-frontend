"use client";

import { format, parseISO } from "date-fns";
import { tr as trLocale, enUS } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { TrackablePhoneLink } from "@/components/analytics/trackable-phone-link";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const DEVELOPER_EMAIL = "dogancignakli@gmail.com";

function formatLastUpdated(locale: string): string {
  const iso = process.env.NEXT_PUBLIC_SITE_LAST_UPDATED ?? "2026-07-17";
  const date = parseISO(iso);
  return format(date, "dd.MM.yyyy", {
    locale: locale === "tr" ? trLocale : enUS,
  });
}

interface FooterProps {
  showStaffLogin?: boolean;
}

export default function Footer({ showStaffLogin = true }: FooterProps) {
  const t = useTranslations("common.footer");
  const locale = useLocale();
  const phone = t("phone");
  const email = t("email");
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const lastUpdated = formatLastUpdated(locale);

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
            <li>
              <TrackablePhoneLink
                href={telHref}
                location="footer"
                className="transition-colors hover:text-primary"
              >
                {phone}
              </TrackablePhoneLink>
            </li>
            <li>
              <a href={`mailto:${email}`} className="transition-colors hover:text-primary">
                {email}
              </a>
            </li>
          </ul>
          <Link
            href="/appointments"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            {t("scheduleLink")}
          </Link>
          {showStaffLogin && (
            <div className="mt-4">
              <Link
                href="/admin/login"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                {t("staffLogin")}
              </Link>
            </div>
          )}
        </div>
      </div>
      <Separator />
      <div className="py-4 text-center text-xs text-muted-foreground">
        {t("lastUpdated", { date: lastUpdated })}
        {", "}
        {t.rich("developedBy", {
          developer: (chunks) => (
            <a
              href={`mailto:${DEVELOPER_EMAIL}`}
              className="underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              {chunks}
            </a>
          ),
        })}
      </div>
    </footer>
  );
}
