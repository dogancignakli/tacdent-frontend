"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === "development") {
      console.info(`[Web Vitals] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
      });
    }
  });

  return null;
}
