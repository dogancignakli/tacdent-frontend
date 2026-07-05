import { getTranslations, setRequestLocale } from "next-intl/server";
import { KVKK_INFORMATION_VERSION } from "@/lib/kvkk";

type KvkkSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

export default async function KvkkInformationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("kvkk.information");
  const tKvkk = await getTranslations("kvkk");
  const sections = t.raw("sections") as KvkkSection[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-3xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("version", { version: KVKK_INFORMATION_VERSION })}
      </p>
      {locale === "en" ? (
        <p className="mt-3 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm leading-6 text-muted-foreground">
          {tKvkk("disclaimer")}
        </p>
      ) : null}
      <div className="mt-8 space-y-8 text-muted-foreground">
        <p className="leading-8">{t("intro")}</p>
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-heading text-xl font-semibold text-foreground">{section.title}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-3 leading-8">
                {paragraph}
              </p>
            ))}
            {section.items && section.items.length > 0 ? (
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-8">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
