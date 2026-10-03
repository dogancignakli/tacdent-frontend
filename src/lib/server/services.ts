import type { DentalService } from "@/types";
import { getBackendUrl } from "@/lib/server/backend";

const FETCH_TIMEOUT_MS = 10_000;

async function fetchActiveServicesOrThrow(): Promise<DentalService[]> {
  const response = await fetch(`${getBackendUrl()}/api/services`, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    next: { revalidate: 300 },
  });
  if (!response.ok) {
    throw new Error(`Services API failed with status ${response.status}`);
  }
  return response.json();
}

/** Soft-fail for list UIs (home, sitemap): empty list on outage. */
export async function fetchActiveServices(): Promise<DentalService[]> {
  try {
    return await fetchActiveServicesOrThrow();
  } catch {
    return [];
  }
}

/**
 * Returns the service, or `null` when the API succeeded and the id is absent.
 * Throws on network/HTTP failure so callers can surface an error boundary
 * instead of a false 404.
 */
export async function fetchServiceById(id: number): Promise<DentalService | null> {
  const services = await fetchActiveServicesOrThrow();
  return services.find((service) => service.id === id) ?? null;
}
