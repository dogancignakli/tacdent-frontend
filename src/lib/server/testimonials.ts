import type { Testimonial } from "@/types";
import { getBackendUrl } from "@/lib/server/backend";

const FETCH_TIMEOUT_MS = 10_000;

export async function fetchActiveTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await fetch(`${getBackendUrl()}/api/testimonials`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}
