"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  createTestimonial,
  deleteTestimonial,
  getAllTestimonialsAdmin,
  updateTestimonial,
} from "@/lib/api";
import { isSessionExpiredMessage } from "@/lib/api-error";
import {
  createTestimonialFormSchema as buildCreateTestimonialFormSchema,
  type TestimonialFormValues,
} from "@/lib/schemas/testimonial";
import type { AdminTestimonial } from "@/types";
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

interface AdminTestimonialsManagementProps {
  onUnauthorized?: () => void;
}

const defaultTestimonialFormValues: TestimonialFormValues = {
  authorName: "",
  quoteTr: "",
  quoteEn: "",
  rating: undefined,
  displayOrder: 0,
  isActive: true,
};

function testimonialToFormValues(testimonial: AdminTestimonial): TestimonialFormValues {
  return {
    authorName: testimonial.authorName,
    quoteTr: testimonial.quoteTr,
    quoteEn: testimonial.quoteEn ?? "",
    rating: testimonial.rating ?? undefined,
    displayOrder: testimonial.displayOrder,
    isActive: testimonial.isActive,
  };
}

function toTestimonialPayload(values: TestimonialFormValues) {
  return {
    authorName: values.authorName,
    quoteTr: values.quoteTr,
    quoteEn: values.quoteEn?.trim() ? values.quoteEn.trim() : null,
    rating: values.rating ?? null,
    displayOrder: values.displayOrder,
    isActive: values.isActive,
  };
}

interface TestimonialFormFieldsProps {
  form: UseFormReturn<TestimonialFormValues>;
  idPrefix: string;
  t: ReturnType<typeof useTranslations<"admin.testimonials">>;
}

function TestimonialFormFields({ form, idPrefix, t }: TestimonialFormFieldsProps) {
  const { errors } = form.formState;

  return (
    <>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-authorName`}>{t("authorName")}</Label>
        <Input
          id={`${idPrefix}-authorName`}
          {...form.register("authorName")}
          aria-invalid={!!errors.authorName}
        />
        {errors.authorName && (
          <p className="text-sm text-destructive">{errors.authorName.message}</p>
        )}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-quoteTr`}>{t("quoteTr")}</Label>
        <Textarea
          id={`${idPrefix}-quoteTr`}
          rows={4}
          {...form.register("quoteTr")}
          aria-invalid={!!errors.quoteTr}
        />
        {errors.quoteTr && <p className="text-sm text-destructive">{errors.quoteTr.message}</p>}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-quoteEn`}>{t("quoteEn")}</Label>
        <Textarea
          id={`${idPrefix}-quoteEn`}
          rows={4}
          {...form.register("quoteEn")}
          aria-invalid={!!errors.quoteEn}
        />
        {errors.quoteEn && <p className="text-sm text-destructive">{errors.quoteEn.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-rating`}>{t("rating")}</Label>
        <Controller
          control={form.control}
          name="rating"
          render={({ field }) => (
            <Input
              id={`${idPrefix}-rating`}
              type="number"
              min={1}
              max={5}
              value={field.value ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value === "" ? undefined : Number(value));
              }}
              aria-invalid={!!errors.rating}
            />
          )}
        />
        {errors.rating && <p className="text-sm text-destructive">{errors.rating.message}</p>}
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

export default function AdminTestimonialsManagement({
  onUnauthorized,
}: AdminTestimonialsManagementProps) {
  const t = useTranslations("admin.testimonials");
  const tValidation = useTranslations("validation");
  const tButtons = useTranslations("common.buttons");

  const testimonialFormSchema = useMemo(
    () => buildCreateTestimonialFormSchema((key) => tValidation(key)),
    [tValidation]
  );

  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonialId, setEditingTestimonialId] = useState<number | null>(null);

  const createForm = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema) as Resolver<TestimonialFormValues>,
    defaultValues: defaultTestimonialFormValues,
  });

  const editForm = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema) as Resolver<TestimonialFormValues>,
    defaultValues: defaultTestimonialFormValues,
  });

  const loadTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllTestimonialsAdmin();
      setTestimonials(data);
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
    void loadTestimonials();
  }, [loadTestimonials]);

  async function onCreateTestimonial(values: TestimonialFormValues) {
    try {
      await createTestimonial(toTestimonialPayload(values));
      toast.success(t("toast.created"));
      createForm.reset(defaultTestimonialFormValues);
      await loadTestimonials();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("toast.createError"));
    }
  }

  async function onUpdateTestimonial(values: TestimonialFormValues) {
    if (editingTestimonialId === null) {
      return;
    }

    try {
      await updateTestimonial(editingTestimonialId, toTestimonialPayload(values));
      toast.success(t("toast.updated"));
      editForm.reset(defaultTestimonialFormValues);
      setEditingTestimonialId(null);
      await loadTestimonials();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("toast.updateError"));
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteTestimonial(id);
      toast.success(t("toast.deleted"));
      await loadTestimonials();
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
            onSubmit={createForm.handleSubmit(onCreateTestimonial)}
            className="grid gap-4 sm:grid-cols-2"
          >
            <TestimonialFormFields form={createForm} idPrefix="create-testimonial" t={t} />

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
      ) : testimonials.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-sm text-muted-foreground">{t("empty")}</CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
                <div>
                  <CardTitle className="text-base">{testimonial.authorName}</CardTitle>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {testimonial.quoteTr}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant={testimonial.isActive ? "default" : "secondary"}>
                      {testimonial.isActive ? t("active") : t("inactive")}
                    </Badge>
                    {testimonial.rating !== null && (
                      <Badge variant="outline">
                        {t("ratingBadge", { rating: testimonial.rating })}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Dialog
                  open={editingTestimonialId === testimonial.id}
                  onOpenChange={(open) => {
                    if (!open) {
                      setEditingTestimonialId(null);
                      editForm.reset(defaultTestimonialFormValues);
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
                          setEditingTestimonialId(testimonial.id);
                          editForm.reset(testimonialToFormValues(testimonial));
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
                        {t("editDescription", { name: testimonial.authorName })}
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={editForm.handleSubmit(onUpdateTestimonial)}
                      className="grid gap-4 sm:grid-cols-2"
                    >
                      <TestimonialFormFields
                        form={editForm}
                        idPrefix={`edit-testimonial-${testimonial.id}`}
                        t={t}
                      />
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
                        {t("deleteDescription", { name: testimonial.authorName })}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose render={<Button variant="outline" />}>
                        {tButtons("cancel")}
                      </DialogClose>
                      <Button variant="destructive" onClick={() => handleDelete(testimonial.id)}>
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
