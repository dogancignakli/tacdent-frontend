import type {
  Appointment,
  CreateAppointmentPayload,
  DentalService,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5065";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? "Something went wrong. Please try again.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export function getServices(): Promise<DentalService[]> {
  return request<DentalService[]>("/api/services");
}

export function getAppointments(): Promise<Appointment[]> {
  return request<Appointment[]>("/api/appointments");
}

export function createAppointment(
  payload: CreateAppointmentPayload
): Promise<Appointment> {
  return request<Appointment>("/api/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAppointmentStatus(
  id: string,
  status: Appointment["status"]
): Promise<Appointment> {
  return request<Appointment>(`/api/appointments/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function deleteAppointment(id: string): Promise<void> {
  return request<void>(`/api/appointments/${id}`, {
    method: "DELETE",
  });
}
