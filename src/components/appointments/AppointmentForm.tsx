"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { createAppointment, getServices } from "@/lib/api";
import { useRecaptcha } from "@/hooks/use-recaptcha";
import {
  createAppointmentFormSchema,
  type AppointmentFormValues,
} from "@/lib/schemas/appointment";
import { localizeServiceName } from "@/lib/services";
import type { DentalService } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AppointmentFormProps {
  onCreated?: () => void;
}

export default function AppointmentForm({ onCreated }: AppointmentFormProps) {
  const t = useTranslations("appointments.form");
  const tValidation = useTranslations("validation");
  const tErrors = useTranslations("common.errors");
  const { executeRecaptcha } = useRecaptcha();
  const [services, setServices] = useState<DentalService[]>([]);

  const appointmentFormSchema = useMemo(
    () => createAppointmentFormSchema((key) => tValidation(key)),
    [tValidation]
  );

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientName: "",
      email: "",
      phone: "",
      preferredDate: "",
      preferredTime: "09:00",
      serviceType: "",
      notes: "",
    },
  });

  useEffect(() => {
    getServices()
      .then((data) => {
        setServices(data);
        if (data.length > 0) {
          form.setValue("serviceType", data[0].name);
        }
      })
      .catch(() => toast.error(t("loadServicesError")));
  }, [form, t]);

  async function onSubmit(values: AppointmentFormValues) {
    try {
      const recaptchaToken = await executeRecaptcha("booking");
      if (!recaptchaToken) {
        toast.error(tErrors("recaptchaFailed"));
        return;
      }

      await createAppointment({ ...values, recaptchaToken });
      toast.success(t("success"));
      form.reset({
        patientName: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "09:00",
        serviceType: services[0]?.name ?? "",
        notes: "",
      });
      onCreated?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("submitError"));
    }
  }

  const { errors, isSubmitting } = form.formState;
  const tServices = useTranslations("services");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="patientName">{t("patientName")}</Label>
              <Input id="patientName" {...form.register("patientName")} aria-invalid={!!errors.patientName} />
              {errors.patientName && (
                <p className="text-sm text-destructive">{errors.patientName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" {...form.register("email")} aria-invalid={!!errors.email} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input id="phone" {...form.register("phone")} aria-invalid={!!errors.phone} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceType">{t("service")}</Label>
              <Controller
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="serviceType" className="w-full" aria-invalid={!!errors.serviceType}>
                      <SelectValue placeholder={t("servicePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.name}>
                          {localizeServiceName(service, tServices)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.serviceType && (
                <p className="text-sm text-destructive">{errors.serviceType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredDate">{t("preferredDate")}</Label>
              <Input
                id="preferredDate"
                type="date"
                {...form.register("preferredDate")}
                aria-invalid={!!errors.preferredDate}
              />
              {errors.preferredDate && (
                <p className="text-sm text-destructive">{errors.preferredDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredTime">{t("preferredTime")}</Label>
              <Input
                id="preferredTime"
                type="time"
                {...form.register("preferredTime")}
                aria-invalid={!!errors.preferredTime}
              />
              {errors.preferredTime && (
                <p className="text-sm text-destructive">{errors.preferredTime.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t("notes")}</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder={t("notesPlaceholder")}
              {...form.register("notes")}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="rounded-full">
            {isSubmitting ? (
              <>
                <Loader2Icon className="animate-spin" />
                {t("submitting")}
              </>
            ) : (
              t("submit")
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
