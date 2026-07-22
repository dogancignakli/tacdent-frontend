import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CLINIC } from "@/lib/clinic";

export default async function LocalAreaSection() {
  const t = await getTranslations("home.localArea");

  return (
    <section className="border-t bg-muted/30 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t("label")}</p>
          <h2 className="font-heading text-3xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-lg leading-8 text-muted-foreground">{t("intro")}</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("locationTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>{CLINIC.streetAddress}</p>
              <p>
                {CLINIC.addressLocality}, {CLINIC.addressRegion} {CLINIC.postalCode}
              </p>
              <p>{t("locationNote")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("areasTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                {CLINIC.areaServed.map((area) => (
                  <li key={area}>{t("areaItem", { area })}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{t("areasNote")}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button render={<Link href="/appointments" />} className="rounded-full">
            {t("bookCta")}
          </Button>
          <Button render={<Link href="/contact" />} variant="outline" className="rounded-full">
            {t("contactCta")}
          </Button>
        </div>
      </div>
    </section>
  );
}
