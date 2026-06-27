"use client";

import { useRouter } from "next/navigation";
import AdminAppointmentList from "@/components/admin/AdminAppointmentList";
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/api";

interface AdminPageClientProps {
  isAdmin: boolean;
}

export default function AdminPageClient({ isAdmin }: AdminPageClientProps) {
  const router = useRouter();

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
            {isAdmin ? "Admin" : "Staff"}
          </p>
          <h1 className="font-heading text-4xl font-bold">
            {isAdmin ? "Admin dashboard" : "Appointment requests"}
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            {isAdmin
              ? "Manage staff accounts and appointment requests."
              : "Review new booking requests and contact patients by phone to confirm their visit."}
          </p>
        </div>

        <Button variant="outline" onClick={handleLogout} className="rounded-full">
          Log out
        </Button>
      </div>

      {isAdmin && (
        <div className="mt-12">
          <AdminUserManagement onUnauthorized={handleUnauthorized} />
        </div>
      )}

      <div className={isAdmin ? "mt-10" : "mt-12"}>
        {isAdmin && (
          <>
            <h2 className="font-heading text-2xl font-bold">Appointment requests</h2>
            <p className="mt-2 mb-6 text-muted-foreground">
              Review new booking requests and contact patients by phone to confirm their visit.
            </p>
          </>
        )}
        <AdminAppointmentList isAdmin={isAdmin} onUnauthorized={handleUnauthorized} />
      </div>
    </div>
  );
}
