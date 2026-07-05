import type {
  AdminDentalService,
  AdminTestimonial,
  Appointment,
  AppointmentSortField,
  AppointmentStatus,
  CreateAppointmentPayload,
  CreateServicePayload,
  CreateTestimonialPayload,
  CreateUserPayload,
  DentalService,
  LoginPayload,
  LoginResponse,
  PagedResult,
  ResetPasswordPayload,
  SortDirection,
  Testimonial,
  UpdateServicePayload,
  UpdateTestimonialPayload,
  User,
  UserRole,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5065";

interface RequestOptions extends RequestInit {
  skipAuthHandling?: boolean;
}

async function request<T>(path: string, options?: RequestOptions): Promise<T> {
  const { skipAuthHandling, ...fetchOptions } = options ?? {};
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string> | undefined),
  };

  const response = await fetch(path, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && !skipAuthHandling) {
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

async function publicRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> | undefined),
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
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
  return publicRequest<DentalService[]>("/api/services");
}

export function getTestimonials(): Promise<Testimonial[]> {
  return publicRequest<Testimonial[]>("/api/testimonials");
}

export function getAllServicesAdmin(): Promise<AdminDentalService[]> {
  return request<AdminDentalService[]>("/api/services/all");
}

export function createService(payload: CreateServicePayload): Promise<AdminDentalService> {
  return request<AdminDentalService>("/api/services", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateService(
  id: number,
  payload: UpdateServicePayload
): Promise<AdminDentalService> {
  return request<AdminDentalService>(`/api/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteService(id: number): Promise<void> {
  return request<void>(`/api/services/${id}`, { method: "DELETE" });
}

export function getAllTestimonialsAdmin(): Promise<AdminTestimonial[]> {
  return request<AdminTestimonial[]>("/api/testimonials/all");
}

export function createTestimonial(
  payload: CreateTestimonialPayload
): Promise<AdminTestimonial> {
  return request<AdminTestimonial>("/api/testimonials", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTestimonial(
  id: number,
  payload: UpdateTestimonialPayload
): Promise<AdminTestimonial> {
  return request<AdminTestimonial>(`/api/testimonials/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteTestimonial(id: number): Promise<void> {
  return request<void>(`/api/testimonials/${id}`, { method: "DELETE" });
}

export interface GetAppointmentsParams {
  status?: AppointmentStatus;
  page?: number;
  pageSize?: number;
  sortBy?: AppointmentSortField;
  sortDirection?: SortDirection;
}

export function getAppointments(
  params: GetAppointmentsParams = {}
): Promise<PagedResult<Appointment>> {
  const searchParams = new URLSearchParams();

  if (params.status) searchParams.set("status", params.status);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.pageSize !== undefined) searchParams.set("pageSize", String(params.pageSize));
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortDirection) searchParams.set("sortDirection", params.sortDirection);

  const query = searchParams.toString();
  return request<PagedResult<Appointment>>(`/api/appointments${query ? `?${query}` : ""}`);
}

export function createAppointment(payload: CreateAppointmentPayload): Promise<Appointment> {
  return request<Appointment>("/api/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuthHandling: true,
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
  return request<void>(`/api/appointments/${id}`, { method: "DELETE" });
}

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return request<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuthHandling: true,
  });
}

export function logout(): Promise<void> {
  return request<void>("/api/auth/logout", {
    method: "POST",
    skipAuthHandling: true,
  });
}

export function getUsers(): Promise<User[]> {
  return request<User[]>("/api/users");
}

export function createUser(payload: CreateUserPayload): Promise<User> {
  return request<User>("/api/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateUserRole(id: string, role: UserRole): Promise<User> {
  return request<User>(`/api/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export function updateUserStatus(id: string, isActive: boolean): Promise<User> {
  return request<User>(`/api/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}

export function resetUserPassword(id: string, payload: ResetPasswordPayload): Promise<void> {
  return request<void>(`/api/users/${id}/password`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function assignAppointment(
  id: string,
  assignedUserId: string | null
): Promise<Appointment> {
  return request<Appointment>(`/api/appointments/${id}/assignee`, {
    method: "PATCH",
    body: JSON.stringify({ assignedUserId }),
  });
}

export type { UserRole };
