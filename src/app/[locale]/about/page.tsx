import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { buildBreadcrumbList } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(locale, "about");
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const bio = t.raw("dentist.bio") as string[];

  const breadcrumbSchema = buildBreadcrumbList(locale, [
    { name: t("breadcrumbHome"), path: "" },
    { name: t("breadcrumbAbout"), path: "/about" },
  ]);

  return (
    <>
      <JsonLdScript data={breadcrumbSchema} />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,46%)_1fr] lg:items-start lg:gap-10 xl:gap-12">
        <div className="mx-auto w-full max-w-sm lg:sticky lg:top-24 lg:mx-0 lg:max-w-none">
          <Image
            src="/team/tugce-aydin-cignakli.webp"
            alt={t("dentist.imageAlt")}
            width={854}
            height={1024}
            sizes="(max-width: 1024px) 100vw, 46vw"
            className="w-full rounded-lg"
            priority
          />
        </div>

        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            {t("dentist.name")}
          </h1>
          <p className="mt-1 text-sm font-medium text-primary">{t("dentist.role")}</p>

          <div className="mt-6 text-[15px] leading-7 text-muted-foreground sm:text-base sm:leading-7 lg:columns-2 lg:gap-x-10 xl:gap-x-12 [&>p]:mb-4 [&>p]:break-inside-avoid [&>p:last-child]:mb-0">
            {bio.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
