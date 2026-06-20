"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminAppointmentList from "@/components/admin/AdminAppointmentList";
import { Button } from "@/components/ui/button";
import { clearToken, getToken } from "@/lib/auth";

export default function AdminPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }

    setAuthenticated(true);
  }, [router]);

  const handleUnauthorized = useCallback(() => {
    clearToken();
    router.replace("/admin/login");
  }, [router]);

  function handleLogout() {
    clearToken();
    router.replace("/admin/login");
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Admin</p>
          <h1 className="font-heading text-4xl font-bold">Appointment requests</h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Review new booking requests and contact patients by phone to confirm their visit.
          </p>
        </div>

        <Button variant="outline" onClick={handleLogout} className="rounded-full">
          Log out
        </Button>
      </div>

      <div className="mt-10">
        <AdminAppointmentList onUnauthorized={handleUnauthorized} />
      </div>
    </div>
  );
}
