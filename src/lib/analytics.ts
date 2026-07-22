declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

/** Fire a GA4 event when gtag is available (after Cookiebot statistics consent). */
export function trackEvent(eventName: string, params?: AnalyticsEventParams): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, params);
}

export function trackPhoneClick(location: string): void {
  trackEvent("phone_click", { event_category: "engagement", location });
}

export function trackAppointmentStart(): void {
  trackEvent("appointment_start", { event_category: "conversion" });
}

export function trackAppointmentSubmit(serviceId?: number): void {
  trackEvent("appointment_submit", {
    event_category: "conversion",
    service_id: serviceId,
  });
}
