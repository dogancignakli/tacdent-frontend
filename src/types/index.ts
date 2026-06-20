export type AppointmentStatus =
  | "Pending"
  | "Confirmed"
  | "Cancelled"
  | "Completed";

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
}

export interface CreateAppointmentPayload {
  patientName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  serviceType: string;
  notes?: string;
}
