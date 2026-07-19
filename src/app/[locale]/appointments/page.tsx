import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import AppointmentsPageClient from "@/components/appointments/AppointmentsPageClient";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(locale, "appointments");
}

export default async function AppointmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AppointmentsPageClient />;
}
