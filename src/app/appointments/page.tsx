"use client";

import { useState } from "react";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import AppointmentList from "@/components/appointments/AppointmentList";

export default function AppointmentsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Appointments</p>
        <h1 className="font-heading text-4xl font-bold">Manage your bookings</h1>
        <p className="text-lg leading-8 text-muted-foreground">
          Request a new visit and review upcoming appointments. Status updates sync with the
          .NET API and PostgreSQL database.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <AppointmentForm onCreated={() => setRefreshKey((value) => value + 1)} />
        <div>
          <h2 className="mb-4 font-heading text-lg font-semibold">Upcoming requests</h2>
          <AppointmentList key={refreshKey} />
        </div>
      </div>
    </div>
  );
}
