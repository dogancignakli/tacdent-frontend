"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Autoplay from "embla-carousel-autoplay";
import { getServices } from "@/lib/api";
import { getServiceDescription, getServiceName } from "@/lib/services";
import type { DentalService } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const slideImages = [
  "/images/service-general.jpg",
  "/images/service-cosmetic.jpg",
  "/images/service-family.jpg",
] as const;

export default function ServicesCarousel() {
  const locale = useLocale();
  const t = useTranslations("home.servicesCarousel");
  const tButtons = useTranslations("common.buttons");
  const [services, setServices] = useState<DentalService[]>([]);

  useEffect(() => {
    getServices()
      .then((data) => setServices(data.slice(0, 3)))
      .catch(() => setServices([]));
  }, []);

  const slides = useMemo(
    () =>
      services.map((service, index) => ({
        service,
        image: slideImages[index] ?? slideImages[0],
      })),
    [services]
  );

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t("label")}</p>
            <h2 className="mt-2 font-heading text-3xl font-bold">{t("title")}</h2>
          </div>
          <Button render={<Link href="/services" />} variant="ghost" className="hidden sm:inline-flex">
            {tButtons("seeAllServices")}
          </Button>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 4500, stopOnInteraction: true })]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {slides.map(({ service, image }) => (
              <CarouselItem key={service.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden py-0">
                  <Image
                    src={image}
                    alt={getServiceName(service, locale)}
                    width={800}
                    height={520}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-52 w-full object-cover"
                  />
                  <CardContent>
                    <h3 className="font-heading text-lg font-semibold">
                      {getServiceName(service, locale)}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {getServiceDescription(service, locale)}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 md:-left-12" />
          <CarouselNext className="right-2 md:-right-12" />
        </Carousel>
      </div>
    </section>
  );
}
