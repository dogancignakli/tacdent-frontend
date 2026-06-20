import CTASection from "@/components/home/CTASection";
import Hero from "@/components/home/Hero";
import ServicesCarousel from "@/components/home/ServicesCarousel";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  {
    title: "Experienced Team",
    text: "Dentists and hygienists focused on comfort and clear communication.",
  },
  {
    title: "Modern Equipment",
    text: "Digital imaging and precise tools for faster, safer treatments.",
  },
  {
    title: "Easy Booking",
    text: "Request appointments online and manage them from one place.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesCarousel />
      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-3">
          {highlights.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <TestimonialsCarousel />
      <CTASection />
    </>
  );
}
