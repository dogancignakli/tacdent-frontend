import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Contact</p>
        <h1 className="font-heading text-4xl font-bold">We are here to help</h1>
        <p className="text-lg leading-8 text-muted-foreground">
          Questions about a treatment or your upcoming visit? Reach out anytime.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Clinic</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>123 Smile Avenue, Dental City</li>
              <li>+1 (555) 123-4567</li>
              <li>hello@tacdent.com</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Emergency line</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              For urgent pain or trauma outside regular hours, call our emergency line at
              <span className="font-medium text-foreground"> +1 (555) 987-6543</span>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
