"use client";

import { useTranslations } from "next-intl";
import AppointmentForm from "@/components/appointments/AppointmentForm";

export default function AppointmentsPageClient() {
  const t = useTranslations("appointments");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t("label")}</p>
        <h1 className="font-heading text-4xl font-bold">{t("title")}</h1>
        <p className="text-lg leading-8 text-muted-foreground">{t("description")}</p>
      </div>

      <div className="mt-10 max-w-2xl">
        <AppointmentForm />
      </div>
    </div>
  );
}
