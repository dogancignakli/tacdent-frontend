import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MailIcon, PhoneIcon } from "lucide-react";
import { TrackablePhoneLink } from "@/components/analytics/trackable-phone-link";
import { Link } from "@/i18n/navigation";
import MapEmbed from "@/components/contact/MapEmbed";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3196.1539038021497!2d28.803814799999998!3d36.7668752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c0713c63fe9959%3A0xe4c9c21b0e11829b!2zRGnFnyBIZWtpbWkgVHXEn8OnZSBBeWTEsW4gw4dpxJ9uYWtsxLE!5e0!3m2!1str!2str!4v1783157357606!5m2!1str!2str";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(locale, "contact");
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tFooter = await getTranslations("common.footer");
  const tButtons = await getTranslations("common.buttons");

  const phone = tFooter("phone");
  const email = tFooter("email");
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t("label")}</p>
        <h1 className="font-heading text-4xl font-bold">{t("title")}</h1>
        <p className="text-lg leading-8 text-muted-foreground">{t("description")}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/appointments"
            className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
          >
            {tButtons("bookAppointment")}
          </Link>
          <TrackablePhoneLink
            href={telHref}
            location="contact_hero"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full inline-flex items-center gap-2")}
          >
            <PhoneIcon />
            {phone}
          </TrackablePhoneLink>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("clinic")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>{tFooter("address")}</li>
              <li>
                <TrackablePhoneLink
                  href={telHref}
                  location="contact_card"
                  className="inline-flex items-center gap-2 text-primary transition-colors hover:underline"
                >
                  <PhoneIcon className="size-4" />
                  {phone}
                </TrackablePhoneLink>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 text-primary transition-colors hover:underline"
                >
                  <MailIcon className="size-4" />
                  {email}
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("emergency")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              {t("emergencyText")}{" "}
              <a
                href={`tel:${t("emergencyPhone").replace(/[^\d+]/g, "")}`}
                className="font-medium text-primary hover:underline"
              >
                {t("emergencyPhone")}
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border">
        <MapEmbed
          src={MAP_EMBED_SRC}
          title={t("mapTitle")}
          loadLabel={t("loadMap")}
          hint={t("mapHint")}
        />
      </div>
    </div>
  );
}
