import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const teamKeys = ["elena", "marco", "nina"] as const;
const teamImages = {
  elena: "photo-1559839734-2b71ea197ec2",
  marco: "photo-1612349317150-e413f6a5b16d",
  nina: "photo-1594824476967-48c8b964273f",
} as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t("label")}</p>
        <h1 className="font-heading text-4xl font-bold">{t("title")}</h1>
        <p className="text-lg leading-8 text-muted-foreground">{t("description")}</p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {teamKeys.map((key) => (
          <Card key={key} className="overflow-hidden py-0">
            <Image
              src={`https://images.unsplash.com/${teamImages[key]}?auto=format&fit=crop&w=800&q=80`}
              alt={t(`team.${key}.name`)}
              width={800}
              height={600}
              className="h-56 w-full object-cover"
            />
            <CardHeader>
              <CardTitle>{t(`team.${key}.name`)}</CardTitle>
              <p className="text-sm text-primary">{t(`team.${key}.role`)}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
