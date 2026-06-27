import { cookies } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import AdminPageClient from "@/components/admin/AdminPageClient";
import { ROLE_COOKIE, SESSION_COOKIE } from "@/lib/server/backend";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  const role = cookieStore.get(ROLE_COOKIE)?.value;

  if (!session) {
    redirect(`/${locale}/admin/login`);
  }

  const isAdmin = role === "Admin";

  return <AdminPageClient isAdmin={isAdmin} />;
}
