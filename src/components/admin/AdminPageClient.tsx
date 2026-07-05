"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import AdminAppointmentList from "@/components/admin/AdminAppointmentList";
import AdminServicesManagement from "@/components/admin/AdminServicesManagement";
import AdminTestimonialsManagement from "@/components/admin/AdminTestimonialsManagement";
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/api";

interface AdminPageClientProps {
  isAdmin: boolean;
}

export default function AdminPageClient({ isAdmin }: AdminPageClientProps) {
  const router = useRouter();
  const t = useTranslations("admin.dashboard");
  const tButtons = useTranslations("common.buttons");

  async function handleLogout() {
    try {
      await logout();
    } finally {
      router.replace("/admin/login");
    }
  }

  function handleUnauthorized() {
    router.replace("/admin/login");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {isAdmin ? t("adminLabel") : t("staffLabel")}
          </p>
          <h1 className="font-heading text-4xl font-bold">
            {isAdmin ? t("adminTitle") : t("staffTitle")}
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            {isAdmin ? t("adminDescription") : t("staffDescription")}
          </p>
        </div>

        <Button variant="outline" onClick={handleLogout} className="rounded-full">
          {tButtons("logOut")}
        </Button>
      </div>

      {isAdmin && (
        <>
          <div className="mt-12">
            <AdminServicesManagement onUnauthorized={handleUnauthorized} />
          </div>
          <div className="mt-10">
            <AdminTestimonialsManagement onUnauthorized={handleUnauthorized} />
          </div>
          <div className="mt-10">
            <AdminUserManagement onUnauthorized={handleUnauthorized} />
          </div>
        </>
      )}

      <div className={isAdmin ? "mt-10" : "mt-12"}>
        {isAdmin && (
          <>
            <h2 className="font-heading text-2xl font-bold">{t("appointmentsSectionTitle")}</h2>
            <p className="mt-2 mb-6 text-muted-foreground">{t("appointmentsSectionDescription")}</p>
          </>
        )}
        <AdminAppointmentList isAdmin={isAdmin} onUnauthorized={handleUnauthorized} />
      </div>
    </div>
  );
}
