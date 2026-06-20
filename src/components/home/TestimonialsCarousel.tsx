"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "The team made me feel calm from the moment I walked in. Best dental experience I've had.",
    name: "Sarah M.",
    role: "Patient since 2022",
  },
  {
    quote:
      "Booking online was easy, and the appointment reminder saved me from forgetting my visit.",
    name: "James L.",
    role: "New patient",
  },
  {
    quote:
      "Professional, gentle, and transparent about every step. Highly recommend TacDent.",
    name: "Ayşe K.",
    role: "Family plan member",
  },
];

export default function TestimonialsCarousel() {
  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide opacity-80">Patient Stories</p>
        <h2 className="mt-2 font-heading text-3xl font-bold">What our patients say</h2>

        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
          className="mt-10 w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((item) => (
              <CarouselItem key={item.name} className="pl-4 md:basis-1/2">
                <Card className="border-0 bg-primary-foreground/10 text-primary-foreground ring-primary-foreground/20">
                  <CardContent>
                    <blockquote className="text-lg leading-8">&ldquo;{item.quote}&rdquo;</blockquote>
                    <footer className="mt-4">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm opacity-80">{item.role}</p>
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
