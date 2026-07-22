import { getTranslations } from "next-intl/server";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { buildSiteGraph } from "@/lib/schema";

type JsonLdProps = {
  locale: string;
};

export default async function JsonLd({ locale }: JsonLdProps) {
  const tMeta = await getTranslations({ locale, namespace: "metadata" });

  return <JsonLdScript data={buildSiteGraph(locale, tMeta("description"))} />;
}
