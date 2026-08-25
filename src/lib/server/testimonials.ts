import type { Testimonial } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5065";
const FETCH_TIMEOUT_MS = 10_000;

export async function fetchActiveTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await fetch(`${API_URL}/api/testimonials`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}
