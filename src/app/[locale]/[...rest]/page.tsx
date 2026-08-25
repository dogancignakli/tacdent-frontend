import { notFound } from "next/navigation";

/** Ensures unknown paths under /[locale]/… use the locale not-found UI. */
export default function CatchAllPage() {
  notFound();
}
