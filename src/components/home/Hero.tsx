import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-accent/40 to-background">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div className="space-y-6">
          <Badge variant="secondary" className="rounded-full">
            Welcome to TacDent
          </Badge>
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Healthy smiles start with trusted care
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            From routine checkups to advanced treatments, our team combines modern technology
            with a calm, friendly experience.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button render={<Link href="/appointments" />} size="lg" className="rounded-full">
              Book Appointment
            </Button>
            <Button
              render={<Link href="/services" />}
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              View Services
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 -top-6 size-24 rounded-full bg-primary/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl shadow-xl ring-1 ring-border">
            <Image
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80"
              alt="Modern dental clinic with friendly staff"
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
