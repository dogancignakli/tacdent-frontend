import { getTranslations, setRequestLocale } from "next-intl/server";
import { KVKK_EXPLICIT_CONSENT_VERSION } from "@/lib/kvkk";

export default async function KvkkConsentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("kvkk.consent");
  const tKvkk = await getTranslations("kvkk");
  const paragraphs = t.raw("paragraphs") as string[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-3xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("version", { version: KVKK_EXPLICIT_CONSENT_VERSION })}
      </p>
      {locale === "en" ? (
        <p className="mt-3 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm leading-6 text-muted-foreground">
          {tKvkk("disclaimer")}
        </p>
      ) : null}
      <div className="mt-8 space-y-6 text-muted-foreground">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="leading-8">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
