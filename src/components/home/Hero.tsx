"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  const t = useTranslations("home.hero");
  const tButtons = useTranslations("common.buttons");

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-accent/40 to-background">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div className="space-y-6">
          <Badge variant="secondary" className="rounded-full">
            {t("badge")}
          </Badge>
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">{t("description")}</p>
          <div className="flex flex-wrap gap-3">
            <Button render={<Link href="/appointments" />} size="lg" className="rounded-full">
              {t("bookAppointment")}
            </Button>
            <Button
              render={<Link href="/services" />}
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              {t("viewServices")}
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 -top-6 size-24 rounded-full bg-primary/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl shadow-xl ring-1 ring-border">
            <Image
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80"
              alt={t("imageAlt")}
              width={1200}
              height={900}
              className="h-[420px] w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
