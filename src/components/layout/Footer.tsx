import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-card text-card-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-heading text-lg font-semibold">TacDent Clinic</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Gentle, modern dentistry for families. Your smile is our priority.
          </p>
        </div>
        <div>
          <p className="font-semibold">Hours</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>Mon – Fri: 8:00 – 18:00</li>
            <li>Saturday: 9:00 – 14:00</li>
            <li>Sunday: Emergency only</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Contact</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>123 Smile Avenue, Dental City</li>
            <li>+1 (555) 123-4567</li>
            <li>hello@tacdent.com</li>
          </ul>
          <Link
            href="/appointments"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            Schedule an appointment →
          </Link>
        </div>
      </div>
      <Separator />
      <div className="py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TacDent. Built with Next.js + shadcn/ui.
      </div>
    </footer>
  );
}
