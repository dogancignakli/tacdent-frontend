"use client";

import Image from "next/image";
import Link from "next/link";
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

const slides = [
  {
    title: "General Dentistry",
    description: "Preventive exams, cleanings, and personalized care plans.",
    image:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Cosmetic Treatments",
    description: "Whitening, veneers, and smile makeovers that look natural.",
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Family Friendly",
    description: "Comfortable visits for kids, teens, and adults alike.",
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function ServicesCarousel() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Our Services</p>
            <h2 className="mt-2 font-heading text-3xl font-bold">Care tailored to every smile</h2>
          </div>
          <Button render={<Link href="/services" />} variant="ghost" className="hidden sm:inline-flex">
            See all services →
          </Button>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 4500, stopOnInteraction: true })]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {slides.map((slide) => (
              <CarouselItem key={slide.title} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden py-0">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    width={800}
                    height={520}
                    className="h-52 w-full object-cover"
                  />
                  <CardContent>
                    <h3 className="font-heading text-lg font-semibold">{slide.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{slide.description}</p>
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
