import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function HealthTourismPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("healthTourism");
  const tButtons = await getTranslations("common.buttons");

  const services = [
    t("services.consultation"),
    t("services.treatment"),
    t("services.coordination"),
    t("services.followUp"),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-3xl space-y-6">
        <h1 className="font-heading text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-lg text-muted-foreground">{t("description")}</p>
        <p className="leading-8 text-muted-foreground">{t("intro")}</p>
      </div>

      <section className="mt-12">
        <h2 className="font-heading text-2xl font-bold">{t("servicesTitle")}</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
          {services.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Button render={<Link href="/appointments" />} className="mt-8 rounded-full">
          {tButtons("bookConsultation")}
        </Button>
      </section>

      <section className="mt-16">
        <h2 className="font-heading text-2xl font-bold">{t("certificateTitle")}</h2>
        <div className="mt-6 overflow-hidden rounded-2xl border bg-muted/30 p-4 sm:p-6">
          <Image
            src="/images/health-tourism-certificate.png"
            alt={t("certificateAlt")}
            width={1200}
            height={1697}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
            className="mx-auto h-auto w-full max-w-3xl rounded-lg"
          />
        </div>
      </section>
    </div>
  );
}
