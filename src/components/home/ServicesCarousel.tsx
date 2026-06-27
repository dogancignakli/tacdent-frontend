"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const slideKeys = ["general", "cosmetic", "family"] as const;
const slideImages = {
  general:
    "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80",
  cosmetic:
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80",
  family:
    "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=80",
} as const;

export default function ServicesCarousel() {
  const t = useTranslations("home.servicesCarousel");
  const tButtons = useTranslations("common.buttons");

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
            {slideKeys.map((key) => (
              <CarouselItem key={key} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden py-0">
                  <Image
                    src={slideImages[key]}
                    alt={t(`slides.${key}.title`)}
                    width={800}
                    height={520}
                    className="h-52 w-full object-cover"
                  />
                  <CardContent>
                    <h3 className="font-heading text-lg font-semibold">{t(`slides.${key}.title`)}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {t(`slides.${key}.description`)}
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
