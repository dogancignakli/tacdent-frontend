"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  const t = useTranslations("home.cta");
  const tButtons = useTranslations("common.buttons");

  return (
    <section className="border-y bg-accent/50 py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
        <div>
          <h2 className="font-heading text-3xl font-bold">{t("title")}</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">{t("description")}</p>
        </div>
        <Button render={<Link href="/appointments" />} size="lg" className="rounded-full">
          {tButtons("scheduleNow")}
        </Button>
      </div>
    </section>
  );
}
