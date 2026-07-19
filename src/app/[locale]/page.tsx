import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CTASection from "@/components/home/CTASection";
import Hero from "@/components/home/Hero";
import ServicesCarousel from "@/components/home/ServicesCarousel";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPageMetadata } from "@/lib/seo";

const highlightKeys = ["team", "equipment", "booking"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(locale, "home");
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home.highlights");

  return (
    <>
      <Hero />
      <ServicesCarousel />
      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-3">
          {highlightKeys.map((key) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{t(`${key}.title`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{t(`${key}.text`)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <TestimonialsCarousel />
      <CTASection />
    </>
  );
}
