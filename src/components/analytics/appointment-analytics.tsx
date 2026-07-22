"use client";

import { useEffect } from "react";
import { trackAppointmentStart } from "@/lib/analytics";

export function AppointmentAnalytics() {
  useEffect(() => {
    trackAppointmentStart();
  }, []);

  return null;
}
