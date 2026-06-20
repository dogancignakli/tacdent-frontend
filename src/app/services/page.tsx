import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

async function getServices() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5065";

  try {
    const response = await fetch(`${apiUrl}/api/services`, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Services</p>
          <h1 className="font-heading text-4xl font-bold">Treatments for every stage of care</h1>
          <p className="text-lg leading-8 text-muted-foreground">
            From preventive visits to advanced procedures, we explain every option in plain
            language so you can choose with confidence.
          </p>
          <Button render={<Link href="/appointments" />} className="rounded-full">
            Book a consultation
          </Button>
        </div>
        <Card className="overflow-hidden py-0">
          <Image
            src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80"
            alt="Dental treatment room"
            width={1200}
            height={800}
            className="h-80 w-full object-cover"
          />
        </Card>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {services.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="pt-6 text-muted-foreground">
              Start the backend API to load live services, or check back soon.
            </CardContent>
          </Card>
        ) : (
          services.map((service: {
            id: number;
            name: string;
            description: string;
            priceFrom: number;
            durationMinutes: number;
          }) => (
            <Card key={service.id}>
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{service.description}</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm font-medium text-primary">
                  From ${service.priceFrom} · {service.durationMinutes} min
                </p>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
