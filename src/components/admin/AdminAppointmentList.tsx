"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { toast } from "sonner";
import {
  assignAppointment,
  deleteAppointment,
  getAppointments,
  getUsers,
  updateAppointmentStatus,
} from "@/lib/api";
import type {
  Appointment,
  AppointmentSortField,
  AppointmentStatus,
  SortDirection,
  User,
} from "@/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UNASSIGNED_VALUE = "__none__";
const PAGE_SIZE = 20;

type StatusFilter = AppointmentStatus | "All";

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "Pending", label: "Pending" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "All", label: "All" },
];

const SORT_OPTIONS: { value: AppointmentSortField; label: string }[] = [
  { value: "PreferredDate", label: "Preferred date" },
  { value: "CreatedAt", label: "Created" },
  { value: "Status", label: "Status" },
];

const statusVariant: Record<
  AppointmentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Pending: "secondary",
  Confirmed: "default",
  Cancelled: "destructive",
  Completed: "outline",
};

function emptyStateMessage(statusFilter: StatusFilter): string {
  if (statusFilter === "All") {
    return "No appointment requests yet.";
  }

  return `No ${statusFilter.toLowerCase()} appointment requests.`;
}

interface AdminAppointmentListProps {
  isAdmin: boolean;
  onUnauthorized?: () => void;
}

export default function AdminAppointmentList({ isAdmin, onUnauthorized }: AdminAppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Pending");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<AppointmentSortField>("PreferredDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("Desc");
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAppointments({
        status: statusFilter === "All" ? undefined : statusFilter,
        page,
        pageSize: PAGE_SIZE,
        sortBy,
        sortDirection,
      });
      setAppointments(data.items);
      setTotalPages(data.totalPages);
      setHasNextPage(data.hasNextPage);
      setHasPreviousPage(data.hasPreviousPage);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not load appointments.";
      if (message.includes("session has expired")) {
        onUnauthorized?.();
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [onUnauthorized, page, sortBy, sortDirection, statusFilter]);

  const loadUsers = useCallback(async () => {
    if (!isAdmin) {
      return;
    }

    try {
      const data = await getUsers();
      setUsers(data.filter((user) => user.isActive));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not load users.";
      if (message.includes("session has expired")) {
        onUnauthorized?.();
      }
      toast.error(message);
    }
  }, [isAdmin, onUnauthorized]);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  function handleStatusFilterChange(value: string) {
    setStatusFilter(value as StatusFilter);
    setPage(1);
  }

  function handleSortByChange(value: string | null) {
    if (!value) {
      return;
    }
    setSortBy(value as AppointmentSortField);
    setPage(1);
  }

  function toggleSortDirection() {
    setSortDirection((current) => (current === "Asc" ? "Desc" : "Asc"));
    setPage(1);
  }

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

  async function handleAssigneeChange(appointmentId: string, value: string) {
    const assignedUserId = value === UNASSIGNED_VALUE ? null : value;

    try {
      await assignAppointment(appointmentId, assignedUserId);
      toast.success(assignedUserId ? "Assignee updated." : "Assignee cleared.");
      await loadAppointments();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not assign appointment.";
      if (message.includes("session has expired")) {
        onUnauthorized?.();
      }
      toast.error(message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <Tabs value={statusFilter} onValueChange={handleStatusFilterChange}>
          <TabsList>
            {STATUS_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={sortBy} onValueChange={handleSortByChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleSortDirection}
            aria-label={`Sort ${sortDirection === "Asc" ? "ascending" : "descending"}`}
          >
            {sortDirection === "Asc" ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {sortDirection === "Asc" ? "Ascending" : "Descending"}
          </Button>
        </div>
      </div>

      {loading ? (
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
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : appointments.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            {emptyStateMessage(statusFilter)}
          </CardContent>
        </Card>
      ) : (
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
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Assignee</dt>
                    <dd className="font-medium">
                      {appointment.assignedUserEmail ?? "Unassigned"}
                    </dd>
                  </div>
                </dl>

                {appointment.notes && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Notes:</span> {appointment.notes}
                  </p>
                )}

                {isAdmin && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">Assign to</p>
                    <Select
                      value={appointment.assignedUserId ?? UNASSIGNED_VALUE}
                      onValueChange={(value) => {
                        if (value) {
                          handleAssigneeChange(appointment.id, value);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full max-w-sm">
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UNASSIGNED_VALUE}>Unassigned</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.email} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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

                {isAdmin && (
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
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && totalPages > 0 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasPreviousPage}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasNextPage}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
