import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buildBreadcrumbList,
  buildServiceDetailSchema,
} from "@/lib/schema";
import {
  formatServicePrice,
  getServiceDescription,
  getServiceName,
} from "@/lib/services";
import { fetchServiceById } from "@/lib/server/services";
import { buildPageMetadata } from "@/lib/seo";

type ServiceDetailPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const serviceId = Number(id);
  if (!Number.isInteger(serviceId) || serviceId <= 0) {
    return {};
  }

  const service = await fetchServiceById(serviceId);
  if (!service) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "services.detail" });
  const name = getServiceName(service, locale);
  const description = getServiceDescription(service, locale);

  return buildPageMetadata({
    locale,
    path: `/services/${service.id}`,
    title: t("metaTitle", { service: name }),
    description: description.slice(0, 160),
    siteName: name,
  });
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const serviceId = Number(id);
  if (!Number.isInteger(serviceId) || serviceId <= 0) {
    notFound();
  }

  const service = await fetchServiceById(serviceId);
  if (!service) {
    notFound();
  }

  const t = await getTranslations("services.detail");
  const tServices = await getTranslations("services");
  const tButtons = await getTranslations("common.buttons");
  const name = getServiceName(service, locale);
  const description = getServiceDescription(service, locale);
  const faqKeys = ["1", "2", "3"] as const;

  const breadcrumbSchema = buildBreadcrumbList(locale, [
    { name: t("breadcrumbHome"), path: "" },
    { name: t("breadcrumbServices"), path: "/services" },
    { name, path: `/services/${service.id}` },
  ]);

  const serviceSchema = buildServiceDetailSchema(locale, service, description);

  return (
    <>
      <JsonLdScript data={[breadcrumbSchema, serviceSchema]} />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <nav className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            {t("breadcrumbHome")}
          </Link>
          <span className="mx-2">/</span>
          <Link href="/services" className="hover:text-primary">
            {t("breadcrumbServices")}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{name}</span>
        </nav>

        <div className="mt-6 space-y-4">
          <h1 className="font-heading text-4xl font-bold tracking-tight">{name}</h1>
          <p className="text-lg leading-8 text-muted-foreground">{description}</p>
          <p className="text-sm font-medium text-primary">
            {formatServicePrice(service, locale, tServices)}
          </p>
          <Button render={<Link href="/appointments" />} className="rounded-full">
            {tButtons("bookConsultation")}
          </Button>
        </div>

        <div className="mt-12 grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("processTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7 text-muted-foreground">{t("processText")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("faqTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {faqKeys.map((key) => (
                <div key={key}>
                  <h2 className="font-medium text-foreground">{t(`faq.${key}.question`)}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {t(`faq.${key}.answer`)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
