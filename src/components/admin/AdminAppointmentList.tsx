"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  assignAppointment,
  deleteAppointment,
  getAppointments,
  getUsers,
  updateAppointmentStatus,
} from "@/lib/api";
import { isSessionExpiredMessage } from "@/lib/api-error";
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

const STATUS_TABS: { value: StatusFilter; tabKey: string }[] = [
  { value: "Pending", tabKey: "pending" },
  { value: "Confirmed", tabKey: "confirmed" },
  { value: "Completed", tabKey: "completed" },
  { value: "Cancelled", tabKey: "cancelled" },
  { value: "All", tabKey: "all" },
];

const SORT_OPTIONS: { value: AppointmentSortField; key: string }[] = [
  { value: "PreferredDate", key: "preferredDate" },
  { value: "CreatedAt", key: "createdAt" },
  { value: "Status", key: "status" },
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

interface AdminAppointmentListProps {
  isAdmin: boolean;
  onUnauthorized?: () => void;
}

export default function AdminAppointmentList({ isAdmin, onUnauthorized }: AdminAppointmentListProps) {
  const t = useTranslations("admin.appointments");
  const tStatus = useTranslations("status");
  const tRoles = useTranslations("admin.roles");
  const tButtons = useTranslations("common.buttons");
  const tErrors = useTranslations("common.errors");

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
      const message = err instanceof Error ? err.message : t("toast.loadError");
      if (isSessionExpiredMessage(message)) {
        onUnauthorized?.();
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [onUnauthorized, page, sortBy, sortDirection, statusFilter, t]);

  const loadUsers = useCallback(async () => {
    if (!isAdmin) {
      return;
    }

    try {
      const data = await getUsers();
      setUsers(data.filter((user) => user.isActive));
    } catch (err) {
      const message = err instanceof Error ? err.message : t("toast.usersError");
      if (isSessionExpiredMessage(message)) {
        onUnauthorized?.();
      }
      toast.error(message);
    }
  }, [isAdmin, onUnauthorized, t]);

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

  function emptyStateMessage(): string {
    if (statusFilter === "All") {
      return t("empty.all");
    }
    return t("empty.filtered", { status: tStatus(statusFilter) });
  }

  async function handleStatusChange(id: string, status: AppointmentStatus) {
    try {
      await updateAppointmentStatus(id, status);
      toast.success(t("toast.statusUpdated", { status: tStatus(status) }));
      await loadAppointments();
    } catch (err) {
      const message = err instanceof Error ? err.message : t("toast.statusError");
      if (isSessionExpiredMessage(message)) {
        onUnauthorized?.();
      }
      toast.error(message);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAppointment(id);
      toast.success(t("toast.deleted"));
      await loadAppointments();
    } catch (err) {
      const message = err instanceof Error ? err.message : t("toast.deleteError");
      if (isSessionExpiredMessage(message)) {
        onUnauthorized?.();
      }
      toast.error(message);
    }
  }

  async function handleAssigneeChange(appointmentId: string, value: string) {
    const assignedUserId = value === UNASSIGNED_VALUE ? null : value;

    try {
      await assignAppointment(appointmentId, assignedUserId);
      toast.success(
        assignedUserId ? t("toast.assigneeUpdated") : t("toast.assigneeCleared")
      );
      await loadAppointments();
    } catch (err) {
      const message = err instanceof Error ? err.message : t("toast.assignError");
      if (isSessionExpiredMessage(message)) {
        onUnauthorized?.();
      }
      toast.error(message);
    }
  }

  const sortDirectionLabel =
    sortDirection === "Asc" ? t("sort.ascending") : t("sort.descending");

  const activeSortKey =
    SORT_OPTIONS.find((option) => option.value === sortBy)?.key ?? "preferredDate";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <Tabs value={statusFilter} onValueChange={handleStatusFilterChange}>
          <TabsList>
            {STATUS_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {t(`tabs.${tab.tabKey}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={sortBy} onValueChange={handleSortByChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("sort.sortBy")}>
                {t(`sort.${activeSortKey}`)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(`sort.${option.key}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleSortDirection}
            aria-label={t("sort.ariaSort", { direction: sortDirectionLabel })}
          >
            {sortDirection === "Asc" ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {sortDirectionLabel}
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
            {emptyStateMessage()}
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
                <Badge variant={statusVariant[appointment.status]}>
                  {tStatus(appointment.status)}
                </Badge>
              </CardHeader>

              <CardContent>
                <dl className="grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">{t("fields.date")}</dt>
                    <dd className="font-medium">{appointment.preferredDate}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{t("fields.time")}</dt>
                    <dd className="font-medium">{appointment.preferredTime}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{t("fields.email")}</dt>
                    <dd className="font-medium">{appointment.email}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{t("fields.phone")}</dt>
                    <dd className="font-medium">
                      <a href={`tel:${appointment.phone}`} className="text-primary hover:underline">
                        {appointment.phone}
                      </a>
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">{t("fields.assignee")}</dt>
                    <dd className="font-medium">
                      {appointment.assignedUserEmail ?? t("fields.unassigned")}
                    </dd>
                  </div>
                </dl>

                {appointment.notes && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{t("fields.notes")}:</span>{" "}
                    {appointment.notes}
                  </p>
                )}

                {isAdmin && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">{t("fields.assignTo")}</p>
                    <Select
                      value={appointment.assignedUserId ?? UNASSIGNED_VALUE}
                      onValueChange={(value) => {
                        if (value) {
                          handleAssigneeChange(appointment.id, value);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full max-w-sm">
                        <SelectValue placeholder={t("fields.selectAssignee")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UNASSIGNED_VALUE}>{t("fields.unassigned")}</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.email} ({user.role === "Admin" ? tRoles("admin") : tRoles("staff")})
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
                    {t("actions.mark", { status: tStatus(status) })}
                  </Button>
                ))}

                {isAdmin && (
                  <Dialog>
                    <DialogTrigger render={<Button variant="destructive" size="sm" />}>
                      {t("actions.delete")}
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t("actions.deleteTitle")}</DialogTitle>
                        <DialogDescription>
                          {t("actions.deleteDescription", { name: appointment.patientName })}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose render={<Button variant="outline" />}>
                          {tButtons("cancel")}
                        </DialogClose>
                        <Button variant="destructive" onClick={() => handleDelete(appointment.id)}>
                          {t("actions.delete")}
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
            {t("pagination.page", { page, total: totalPages })}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasPreviousPage}
              onClick={() => setPage((current) => current - 1)}
            >
              {tButtons("previous")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasNextPage}
              onClick={() => setPage((current) => current + 1)}
            >
              {tButtons("next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
