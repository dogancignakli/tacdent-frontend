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
  nameTr: string;
  nameEn: string;
  descriptionTr: string;
  descriptionEn: string;
  icon: string | null;
  priceFromTry: number;
  priceFromEur: number;
  durationMinutes: number;
  displayOrder: number;
}

export interface AdminDentalService extends DentalService {
  isActive: boolean;
}

export interface Testimonial {
  id: number;
  authorName: string;
  quoteTr: string;
  quoteEn: string | null;
  rating: number | null;
  displayOrder: number;
}

export interface AdminTestimonial extends Testimonial {
  isActive: boolean;
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
  serviceId: number;
  notes?: string;
  kvkkInformationAccepted: boolean;
  kvkkInformationVersion: string;
  kvkkExplicitConsentAccepted: boolean;
  kvkkExplicitConsentVersion: string;
  recaptchaToken: string;
}

export interface CreateServicePayload {
  nameTr: string;
  nameEn: string;
  descriptionTr: string;
  descriptionEn: string;
  icon?: string | null;
  priceFromTry: number;
  priceFromEur: number;
  durationMinutes: number;
  displayOrder: number;
  isActive: boolean;
}

export interface UpdateServicePayload extends CreateServicePayload {}

export interface CreateTestimonialPayload {
  authorName: string;
  quoteTr: string;
  quoteEn?: string | null;
  rating?: number | null;
  isActive: boolean;
  displayOrder: number;
}

export interface UpdateTestimonialPayload extends CreateTestimonialPayload {}

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
