"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { createAppointment, getServices } from "@/lib/api";
import { useRecaptcha } from "@/hooks/use-recaptcha";
import {
  KVKK_EXPLICIT_CONSENT_VERSION,
  KVKK_INFORMATION_VERSION,
} from "@/lib/kvkk";
import {
  createAppointmentFormSchema,
  type AppointmentFormValues,
} from "@/lib/schemas/appointment";
import { getServiceName } from "@/lib/services";
import type { DentalService } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  const locale = useLocale();

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
      serviceId: 0,
      notes: "",
      kvkkInformationAccepted: false,
      kvkkExplicitConsentAccepted: false,
    },
  });

  useEffect(() => {
    getServices()
      .then((data) => {
        setServices(data);
        if (data.length > 0) {
          form.setValue("serviceId", data[0].id);
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

      await createAppointment({
        patientName: values.patientName,
        email: values.email,
        phone: values.phone,
        preferredDate: values.preferredDate,
        preferredTime: values.preferredTime,
        serviceId: values.serviceId,
        notes: values.notes,
        kvkkInformationAccepted: values.kvkkInformationAccepted,
        kvkkInformationVersion: KVKK_INFORMATION_VERSION,
        kvkkExplicitConsentAccepted: values.kvkkExplicitConsentAccepted,
        kvkkExplicitConsentVersion: KVKK_EXPLICIT_CONSENT_VERSION,
        recaptchaToken,
      });
      toast.success(t("success"));
      form.reset({
        patientName: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "09:00",
        serviceId: services[0]?.id ?? 0,
        notes: "",
        kvkkInformationAccepted: false,
        kvkkExplicitConsentAccepted: false,
      });
      onCreated?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("submitError"));
    }
  }

  const { errors, isSubmitting } = form.formState;

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
              <Label htmlFor="serviceId">{t("service")}</Label>
              <Controller
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger id="serviceId" className="w-full" aria-invalid={!!errors.serviceId}>
                      <SelectValue placeholder={t("servicePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={String(service.id)}>
                          {getServiceName(service, locale)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.serviceId && (
                <p className="text-sm text-destructive">{errors.serviceId.message}</p>
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

          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <Controller
                control={form.control}
                name="kvkkInformationAccepted"
                render={({ field }) => (
                  <Checkbox
                    id="kvkkInformationAccepted"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    aria-invalid={!!errors.kvkkInformationAccepted}
                  />
                )}
              />
              <Label htmlFor="kvkkInformationAccepted" className="text-sm leading-6 font-normal">
                {t("kvkkInformationLabel")}{" "}
                <Link href="/kvkk/information" className="text-primary underline" target="_blank">
                  {t("kvkkInformationLink")}
                </Link>
              </Label>
            </div>
            {errors.kvkkInformationAccepted && (
              <p className="text-sm text-destructive">{errors.kvkkInformationAccepted.message}</p>
            )}

            <div className="flex items-start gap-3">
              <Controller
                control={form.control}
                name="kvkkExplicitConsentAccepted"
                render={({ field }) => (
                  <Checkbox
                    id="kvkkExplicitConsentAccepted"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    aria-invalid={!!errors.kvkkExplicitConsentAccepted}
                  />
                )}
              />
              <Label htmlFor="kvkkExplicitConsentAccepted" className="text-sm leading-6 font-normal">
                {t("kvkkExplicitConsentLabel")}{" "}
                <Link href="/kvkk/consent" className="text-primary underline" target="_blank">
                  {t("kvkkExplicitConsentLink")}
                </Link>
              </Label>
            </div>
            {errors.kvkkExplicitConsentAccepted && (
              <p className="text-sm text-destructive">{errors.kvkkExplicitConsentAccepted.message}</p>
            )}
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
