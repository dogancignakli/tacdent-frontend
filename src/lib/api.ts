import type {
  Appointment,
  CreateAppointmentPayload,
  DentalService,
  LoginPayload,
  LoginResponse,
} from "@/types";
import { clearToken, getToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5065";

interface RequestOptions extends RequestInit {
  skipAuthHandling?: boolean;
}

async function request<T>(path: string, options?: RequestOptions): Promise<T> {
  const { skipAuthHandling, ...fetchOptions } = options ?? {};
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401 && !skipAuthHandling) {
    clearToken();
    throw new Error("Your session has expired. Please log in again.");
  }

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

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return request<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuthHandling: true,
  });
}
