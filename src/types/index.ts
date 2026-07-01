export type AppointmentStatus =
  | "Pending"
  | "Confirmed"
  | "Cancelled"
  | "Completed";

export type AppointmentSortField = "PreferredDate" | "CreatedAt" | "Status";

export type SortDirection = "Asc" | "Desc";

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface DentalService {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  priceFrom: number;
  durationMinutes: number;
}

export interface Appointment {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  serviceType: string;
  notes: string | null;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  assignedUserId: string | null;
  assignedUserEmail: string | null;
}

export interface CreateAppointmentPayload {
  patientName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  serviceType: string;
  notes?: string;
  recaptchaToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  recaptchaToken: string;
}

export interface LoginResponse {
  role: UserRole;
}

export type UserRole = "Admin" | "Staff";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface ResetPasswordPayload {
  password: string;
}
