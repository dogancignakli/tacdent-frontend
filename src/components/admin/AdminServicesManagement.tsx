"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  createService,
  deleteService,
  getAllServicesAdmin,
  updateService,
} from "@/lib/api";
import { isSessionExpiredMessage } from "@/lib/api-error";
import {
  createServiceFormSchema as buildCreateServiceFormSchema,
  type ServiceFormValues,
} from "@/lib/schemas/service";
import type { AdminDentalService } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

interface AdminServicesManagementProps {
  onUnauthorized?: () => void;
}

const defaultServiceFormValues: ServiceFormValues = {
  nameTr: "",
  nameEn: "",
  descriptionTr: "",
  descriptionEn: "",
  icon: "",
  priceFromTry: 0,
  priceFromEur: 0,
  durationMinutes: 30,
  displayOrder: 0,
  isActive: true,
};

function serviceToFormValues(service: AdminDentalService): ServiceFormValues {
  return {
    nameTr: service.nameTr,
    nameEn: service.nameEn,
    descriptionTr: service.descriptionTr,
    descriptionEn: service.descriptionEn,
    icon: service.icon ?? "",
    priceFromTry: service.priceFromTry,
    priceFromEur: service.priceFromEur,
    durationMinutes: service.durationMinutes,
    displayOrder: service.displayOrder,
    isActive: service.isActive,
  };
}

function toServicePayload(values: ServiceFormValues) {
  return {
    ...values,
    icon: values.icon?.trim() ? values.icon.trim() : null,
  };
}

interface ServiceFormFieldsProps {
  form: UseFormReturn<ServiceFormValues>;
  idPrefix: string;
  t: ReturnType<typeof useTranslations<"admin.services">>;
}

function ServiceFormFields({ form, idPrefix, t }: ServiceFormFieldsProps) {
  const { errors } = form.formState;

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-nameTr`}>{t("nameTr")}</Label>
        <Input
          id={`${idPrefix}-nameTr`}
          {...form.register("nameTr")}
          aria-invalid={!!errors.nameTr}
        />
        {errors.nameTr && <p className="text-sm text-destructive">{errors.nameTr.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-nameEn`}>{t("nameEn")}</Label>
        <Input
          id={`${idPrefix}-nameEn`}
          {...form.register("nameEn")}
          aria-invalid={!!errors.nameEn}
        />
        {errors.nameEn && <p className="text-sm text-destructive">{errors.nameEn.message}</p>}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-descriptionTr`}>{t("descriptionTr")}</Label>
        <Textarea
          id={`${idPrefix}-descriptionTr`}
          rows={3}
          {...form.register("descriptionTr")}
          aria-invalid={!!errors.descriptionTr}
        />
        {errors.descriptionTr && (
          <p className="text-sm text-destructive">{errors.descriptionTr.message}</p>
        )}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-descriptionEn`}>{t("descriptionEn")}</Label>
        <Textarea
          id={`${idPrefix}-descriptionEn`}
          rows={3}
          {...form.register("descriptionEn")}
          aria-invalid={!!errors.descriptionEn}
        />
        {errors.descriptionEn && (
          <p className="text-sm text-destructive">{errors.descriptionEn.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-icon`}>{t("icon")}</Label>
        <Input
          id={`${idPrefix}-icon`}
          placeholder={t("iconPlaceholder")}
          {...form.register("icon")}
          aria-invalid={!!errors.icon}
        />
        {errors.icon && <p className="text-sm text-destructive">{errors.icon.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-durationMinutes`}>{t("durationMinutes")}</Label>
        <Input
          id={`${idPrefix}-durationMinutes`}
          type="number"
          min={1}
          {...form.register("durationMinutes")}
          aria-invalid={!!errors.durationMinutes}
        />
        {errors.durationMinutes && (
          <p className="text-sm text-destructive">{errors.durationMinutes.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-priceFromTry`}>{t("priceFromTry")}</Label>
        <Input
          id={`${idPrefix}-priceFromTry`}
          type="number"
          min={0}
          step="0.01"
          {...form.register("priceFromTry")}
          aria-invalid={!!errors.priceFromTry}
        />
        {errors.priceFromTry && (
          <p className="text-sm text-destructive">{errors.priceFromTry.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-priceFromEur`}>{t("priceFromEur")}</Label>
        <Input
          id={`${idPrefix}-priceFromEur`}
          type="number"
          min={0}
          step="0.01"
          {...form.register("priceFromEur")}
          aria-invalid={!!errors.priceFromEur}
        />
        {errors.priceFromEur && (
          <p className="text-sm text-destructive">{errors.priceFromEur.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-displayOrder`}>{t("displayOrder")}</Label>
        <Input
          id={`${idPrefix}-displayOrder`}
          type="number"
          min={0}
          {...form.register("displayOrder")}
          aria-invalid={!!errors.displayOrder}
        />
        {errors.displayOrder && (
          <p className="text-sm text-destructive">{errors.displayOrder.message}</p>
        )}
      </div>

      <div className="flex items-center gap-3 sm:col-span-2">
        <Controller
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <Checkbox
              id={`${idPrefix}-isActive`}
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              aria-invalid={!!errors.isActive}
            />
          )}
        />
        <Label htmlFor={`${idPrefix}-isActive`} className="font-normal">
          {t("isActive")}
        </Label>
      </div>
    </>
  );
}

export default function AdminServicesManagement({ onUnauthorized }: AdminServicesManagementProps) {
  const t = useTranslations("admin.services");
  const tValidation = useTranslations("validation");
  const tButtons = useTranslations("common.buttons");

  const serviceFormSchema = useMemo(
    () => buildCreateServiceFormSchema((key) => tValidation(key)),
    [tValidation]
  );

  const [services, setServices] = useState<AdminDentalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);

  const createForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema) as Resolver<ServiceFormValues>,
    defaultValues: defaultServiceFormValues,
  });

  const editForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema) as Resolver<ServiceFormValues>,
    defaultValues: defaultServiceFormValues,
  });

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllServicesAdmin();
      setServices(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : t("toast.loadError");
      if (isSessionExpiredMessage(message)) {
        onUnauthorized?.();
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [onUnauthorized, t]);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  async function onCreateService(values: ServiceFormValues) {
    try {
      await createService(toServicePayload(values));
      toast.success(t("toast.created"));
      createForm.reset(defaultServiceFormValues);
      await loadServices();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("toast.createError"));
    }
  }

  async function onUpdateService(values: ServiceFormValues) {
    if (editingServiceId === null) {
      return;
    }

    try {
      await updateService(editingServiceId, toServicePayload(values));
      toast.success(t("toast.updated"));
      editForm.reset(defaultServiceFormValues);
      setEditingServiceId(null);
      await loadServices();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("toast.updateError"));
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteService(id);
      toast.success(t("toast.deleted"));
      await loadServices();
    } catch (error) {
      const message = error instanceof Error ? error.message : t("toast.deleteError");
      if (isSessionExpiredMessage(message)) {
        onUnauthorized?.();
      }
      toast.error(message);
    }
  }

  const { isSubmitting: isCreating } = createForm.formState;
  const { isSubmitting: isUpdating } = editForm.formState;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold">{t("title")}</h2>
        <p className="mt-2 text-muted-foreground">{t("description")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("createTitle")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={createForm.handleSubmit(onCreateService)}
            className="grid gap-4 sm:grid-cols-2"
          >
            <ServiceFormFields form={createForm} idPrefix="create-service" t={t} />

            <div className="sm:col-span-2">
              <Button type="submit" disabled={isCreating} className="rounded-full">
                {isCreating ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                    {t("creating")}
                  </>
                ) : (
                  t("create")
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <Card key={item}>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : services.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-sm text-muted-foreground">{t("empty")}</CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
                <div>
                  <CardTitle className="text-base">{service.nameTr}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{service.nameEn}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant={service.isActive ? "default" : "secondary"}>
                      {service.isActive ? t("active") : t("inactive")}
                    </Badge>
                    <Badge variant="outline">
                      {t("durationBadge", { minutes: service.durationMinutes })}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Dialog
                  open={editingServiceId === service.id}
                  onOpenChange={(open) => {
                    if (!open) {
                      setEditingServiceId(null);
                      editForm.reset(defaultServiceFormValues);
                    }
                  }}
                >
                  <DialogTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingServiceId(service.id);
                          editForm.reset(serviceToFormValues(service));
                        }}
                      />
                    }
                  >
                    {t("edit")}
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{t("editTitle")}</DialogTitle>
                      <DialogDescription>
                        {t("editDescription", { name: service.nameTr })}
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={editForm.handleSubmit(onUpdateService)}
                      className="grid gap-4 sm:grid-cols-2"
                    >
                      <ServiceFormFields form={editForm} idPrefix={`edit-service-${service.id}`} t={t} />
                      <DialogFooter className="sm:col-span-2">
                        <DialogClose render={<Button variant="outline" type="button" />}>
                          {tButtons("cancel")}
                        </DialogClose>
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating ? (
                            <>
                              <Loader2Icon className="animate-spin" />
                              {t("saving")}
                            </>
                          ) : (
                            tButtons("save")
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger render={<Button variant="destructive" size="sm" />}>
                    {t("delete")}
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("deleteTitle")}</DialogTitle>
                      <DialogDescription>
                        {t("deleteDescription", { name: service.nameTr })}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose render={<Button variant="outline" />}>
                        {tButtons("cancel")}
                      </DialogClose>
                      <Button variant="destructive" onClick={() => handleDelete(service.id)}>
                        {t("delete")}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
