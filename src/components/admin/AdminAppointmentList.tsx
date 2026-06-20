"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteAppointment, getAppointments, updateAppointmentStatus } from "@/lib/api";
import type { Appointment, AppointmentStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const statusVariant: Record<
  AppointmentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Pending: "secondary",
  Confirmed: "default",
  Cancelled: "destructive",
  Completed: "outline",
};

interface AdminAppointmentListProps {
  onUnauthorized?: () => void;
}

export default function AdminAppointmentList({ onUnauthorized }: AdminAppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not load appointments.";
      if (message.includes("session has expired")) {
        onUnauthorized?.();
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  async function handleStatusChange(id: string, status: AppointmentStatus) {
    try {
      await updateAppointmentStatus(id, status);
      toast.success(`Appointment marked as ${status}.`);
      await loadAppointments();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not update appointment status.";
      if (message.includes("session has expired")) {
        onUnauthorized?.();
      }
      toast.error(message);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAppointment(id);
      toast.success("Appointment deleted.");
      await loadAppointments();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not delete appointment.";
      if (message.includes("session has expired")) {
        onUnauthorized?.();
      }
      toast.error(message);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((item) => (
          <Card key={item}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (appointments.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-sm text-muted-foreground">
          No appointment requests yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id}>
          <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <CardTitle>{appointment.patientName}</CardTitle>
              <p className="text-sm text-muted-foreground">{appointment.serviceType}</p>
            </div>
            <Badge variant={statusVariant[appointment.status]}>{appointment.status}</Badge>
          </CardHeader>

          <CardContent>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Date</dt>
                <dd className="font-medium">{appointment.preferredDate}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Time</dt>
                <dd className="font-medium">{appointment.preferredTime}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{appointment.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-medium">
                  <a href={`tel:${appointment.phone}`} className="text-primary hover:underline">
                    {appointment.phone}
                  </a>
                </dd>
              </div>
            </dl>

            {appointment.notes && (
              <p className="mt-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Notes:</span> {appointment.notes}
              </p>
            )}
          </CardContent>

          <CardFooter className="flex flex-wrap gap-2 border-t-0 bg-transparent pt-0">
            {(["Confirmed", "Completed", "Cancelled"] as AppointmentStatus[]).map((status) => (
              <Button
                key={status}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(appointment.id, status)}
              >
                Mark {status}
              </Button>
            ))}

            <Dialog>
              <DialogTrigger render={<Button variant="destructive" size="sm" />}>
                Delete
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete appointment?</DialogTitle>
                  <DialogDescription>
                    This will permanently remove the booking for {appointment.patientName}.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                  <Button variant="destructive" onClick={() => handleDelete(appointment.id)}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
