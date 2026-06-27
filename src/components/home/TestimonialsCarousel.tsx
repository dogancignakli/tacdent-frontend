"use client";

import Autoplay from "embla-carousel-autoplay";
import { useTranslations } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const testimonialKeys = ["1", "2", "3"] as const;

export default function TestimonialsCarousel() {
  const t = useTranslations("home.testimonials");

  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide opacity-80">{t("label")}</p>
        <h2 className="mt-2 font-heading text-3xl font-bold">{t("title")}</h2>

        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
          className="mt-10 w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonialKeys.map((key) => (
              <CarouselItem key={key} className="pl-4 md:basis-1/2">
                <Card className="border-0 bg-primary-foreground/10 text-primary-foreground ring-primary-foreground/20">
                  <CardContent>
                    <blockquote className="text-lg leading-8">
                      &ldquo;{t(`items.${key}.quote`)}&rdquo;
                    </blockquote>
                    <footer className="mt-4">
                      <p className="font-semibold">{t(`items.${key}.name`)}</p>
                      <p className="text-sm opacity-80">{t(`items.${key}.role`)}</p>
                    </footer>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 md:-left-12" />
          <CarouselNext className="right-2 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 md:-right-12" />
        </Carousel>
      </div>
    </section>
  );
}
