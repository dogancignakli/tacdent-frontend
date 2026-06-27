import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatServicePrice,
  localizeServiceDescription,
  localizeServiceName,
} from "@/lib/services";
import type { DentalService } from "@/types";

async function getServices(): Promise<DentalService[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5065";

  try {
    const response = await fetch(`${apiUrl}/api/services`, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
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
  const services = await getServices();

  return (
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
            src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80"
            alt={t("imageAlt")}
            width={1200}
            height={800}
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
                <CardTitle>{localizeServiceName(service, t)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {localizeServiceDescription(service, t)}
                </p>
              </CardContent>
              <CardFooter>
                <p className="text-sm font-medium text-primary">
                  {formatServicePrice(service.priceFrom, service.durationMinutes, locale, t)}
                </p>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
