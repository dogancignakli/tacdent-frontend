"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CalendarIcon, Loader2Icon } from "lucide-react";
import { format, startOfDay } from "date-fns";
import { tr as trLocale, enUS } from "date-fns/locale";
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
import {
  getTimeSlotsForDate,
  isClosedDate,
  parseDateString,
} from "@/lib/working-hours";
import { trackAppointmentSubmit } from "@/lib/analytics";
import { getServiceName } from "@/lib/services";
import { cn } from "@/lib/utils";
import type { DentalService } from "@/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  const { executeRecaptcha, isConfigured: isRecaptchaConfigured } = useRecaptcha();
  const [services, setServices] = useState<DentalService[]>([]);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const locale = useLocale();
  const dateLocale = locale === "tr" ? trLocale : enUS;

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
      preferredTime: "",
      serviceId: 0,
      notes: "",
      kvkkInformationAccepted: false,
      kvkkExplicitConsentAccepted: false,
    },
  });

  const preferredDate = form.watch("preferredDate");
  const timeSlots = useMemo(
    () => getTimeSlotsForDate(preferredDate),
    [preferredDate]
  );

  useEffect(() => {
    getServices()
      .then((data) => setServices(data))
      .catch(() => toast.error(t("loadServicesError")));
  }, [t]);

  async function onSubmit(values: AppointmentFormValues) {
    try {
      const recaptchaToken = await executeRecaptcha("booking");
      if (isRecaptchaConfigured && !recaptchaToken) {
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
      trackAppointmentSubmit(values.serviceId);
      toast.success(t("success"));
      form.reset({
        patientName: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        serviceId: 0,
        notes: "",
        kvkkInformationAccepted: false,
        kvkkExplicitConsentAccepted: false,
      });
      form.clearErrors();
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
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0555 555 55 55"
                {...form.register("phone")}
                onKeyDown={(e) => {
                  if (
                    e.key.length === 1 &&
                    !e.ctrlKey &&
                    !e.metaKey &&
                    !/[0-9+()\s-]/.test(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceId">{t("service")}</Label>
              <Controller
                control={form.control}
                name="serviceId"
                render={({ field }) => {
                  const selectedService = services.find((s) => s.id === field.value);
                  return (
                    <Select
                      value={field.value ? String(field.value) : null}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger id="serviceId" className="w-full" aria-invalid={!!errors.serviceId}>
                        <SelectValue placeholder={t("servicePlaceholder")}>
                          {selectedService
                            ? getServiceName(selectedService, locale)
                            : t("servicePlaceholder")}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={String(service.id)}>
                            {getServiceName(service, locale)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.serviceId && (
                <p className="text-sm text-destructive">{errors.serviceId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredDate">{t("preferredDate")}</Label>
              <Controller
                control={form.control}
                name="preferredDate"
                render={({ field }) => {
                  const selectedDate = field.value
                    ? parseDateString(field.value) ?? undefined
                    : undefined;
                  return (
                    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                      <PopoverTrigger
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            id="preferredDate"
                            aria-invalid={!!errors.preferredDate}
                            className={cn(
                              "h-8 w-full justify-start font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="text-muted-foreground" />
                            {selectedDate
                              ? format(selectedDate, "dd.MM.yyyy", { locale: dateLocale })
                              : t("preferredDatePlaceholder")}
                          </Button>
                        }
                      />
                      <PopoverContent align="start" className="p-0">
                        <Calendar
                          mode="single"
                          locale={dateLocale}
                          selected={selectedDate}
                          onSelect={(date) => {
                            field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                            form.setValue("preferredTime", "");
                            setDatePickerOpen(false);
                          }}
                          disabled={[
                            { before: startOfDay(new Date()) },
                            (date) => isClosedDate(date),
                          ]}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                  );
                }}
              />
              {errors.preferredDate && (
                <p className="text-sm text-destructive">{errors.preferredDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredTime">{t("preferredTime")}</Label>
              <Controller
                control={form.control}
                name="preferredTime"
                render={({ field }) => (
                  <Select
                    // Base UI uses null for "no selection"; keep RHF/Zod on strings.
                    value={field.value ? field.value : null}
                    onValueChange={(value) => field.onChange(value ?? "")}
                    disabled={!preferredDate || timeSlots.length === 0}
                  >
                    <SelectTrigger id="preferredTime" className="w-full" aria-invalid={!!errors.preferredTime}>
                      <SelectValue
                        placeholder={
                          preferredDate ? t("preferredTimePlaceholder") : t("selectDateFirst")
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
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
                    className="mt-1"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    aria-invalid={!!errors.kvkkInformationAccepted}
                  />
                )}
              />
              {/* Label defaults to flex — block keeps the link inline with wrapping text */}
              <Label
                htmlFor="kvkkInformationAccepted"
                className="block text-sm leading-6 font-normal"
              >
                {t("kvkkInformationLabel")}{" "}
                <Link
                  href="/kvkk/information"
                  target="_blank"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
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
                    className="mt-1"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    aria-invalid={!!errors.kvkkExplicitConsentAccepted}
                  />
                )}
              />
              <Label
                htmlFor="kvkkExplicitConsentAccepted"
                className="block text-sm leading-6 font-normal"
              >
                {t("kvkkExplicitConsentLabel")}{" "}
                <Link
                  href="/kvkk/consent"
                  target="_blank"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
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
