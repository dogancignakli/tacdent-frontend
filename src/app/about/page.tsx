import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const team = [
  { name: "Dr. Elena Brooks", role: "Lead Dentist", image: "photo-1559839734-2b71ea197ec2" },
  { name: "Dr. Marco Silva", role: "Implant Specialist", image: "photo-1612349317150-e413f6a5b16d" },
  { name: "Nina Carter", role: "Dental Hygienist", image: "photo-1594824476967-48c8b964273f" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">About TacDent</p>
        <h1 className="font-heading text-4xl font-bold">Care that feels human, not clinical</h1>
        <p className="text-lg leading-8 text-muted-foreground">
          TacDent was founded on a simple idea: dental visits should be calm, transparent, and
          tailored to you. We combine modern technology with a warm team that listens first.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {team.map((member) => (
          <Card key={member.name} className="overflow-hidden py-0">
            <Image
              src={`https://images.unsplash.com/${member.image}?auto=format&fit=crop&w=800&q=80`}
              alt={member.name}
              width={800}
              height={600}
              className="h-56 w-full object-cover"
            />
            <CardHeader>
              <CardTitle>{member.name}</CardTitle>
              <p className="text-sm text-primary">{member.role}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
