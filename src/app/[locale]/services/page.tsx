import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { buildBreadcrumbList, buildOfferCatalogSchema } from "@/lib/schema";
import { fetchActiveServices } from "@/lib/server/services";
import { createPageMetadata } from "@/lib/seo";
import { formatServicePrice, getServiceDescription, getServiceName } from "@/lib/services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(locale, "services");
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("services");
  const tButtons = await getTranslations("common.buttons");
  const services = await fetchActiveServices();

  const breadcrumbSchema = buildBreadcrumbList(locale, [
    { name: t("breadcrumbHome"), path: "" },
    { name: t("title"), path: "/services" },
  ]);
  const catalogSchema = buildOfferCatalogSchema(locale, services, t("title"));

  return (
    <>
      <JsonLdScript data={[breadcrumbSchema, catalogSchema]} />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t("label")}</p>
          <h1 className="font-heading text-4xl font-bold">{t("title")}</h1>
          <p className="text-lg leading-8 text-muted-foreground">{t("description")}</p>
          <Button render={<Link href="/appointments" />} className="rounded-full">
            {tButtons("bookConsultation")}
          </Button>
        </div>
        <Card className="overflow-hidden py-0">
          <Image
            src="/images/service-general.jpg"
            alt={t("imageAlt")}
            width={1200}
            height={800}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="h-80 w-full object-cover"
          />
        </Card>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {services.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="pt-6 text-muted-foreground">{t("empty")}</CardContent>
          </Card>
        ) : (
          services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <CardTitle>
                  <Link
                    href={`/services/${service.id}`}
                    className="transition-colors hover:text-primary"
                  >
                    {getServiceName(service, locale)}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {getServiceDescription(service, locale)}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-primary">
                  {formatServicePrice(service, locale, t)}
                </p>
                <Link
                  href={`/services/${service.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {t("viewDetails")}
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      </div>
    </>
  );
}
