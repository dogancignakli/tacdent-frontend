import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function LocaleNotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common.notFound" });

  return (
    <div className="mx-auto flex max-w-lg flex-col items-start gap-4 px-4 py-24 sm:px-6">
      <h1 className="font-heading text-3xl font-bold tracking-tight">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <div className="flex flex-wrap gap-3">
        <Button render={<Link href="/" />}>{t("home")}</Button>
        <Button render={<Link href="/services" />} variant="outline">
          {t("services")}
        </Button>
        <Button render={<Link href="/contact" />} variant="outline">
          {t("contact")}
        </Button>
      </div>
    </div>
  );
}
