import type { DentalService } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5065";

export async function fetchActiveServices(): Promise<DentalService[]> {
  try {
    const response = await fetch(`${API_URL}/api/services`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export async function fetchServiceById(id: number): Promise<DentalService | null> {
  const services = await fetchActiveServices();
  return services.find((service) => service.id === id) ?? null;
}
