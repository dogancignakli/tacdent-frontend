"use client";

import { useState } from "react";
import { MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type MapEmbedProps = {
  src: string;
  title: string;
  loadLabel: string;
  hint?: string;
};

export default function MapEmbed({ src, title, loadLabel, hint }: MapEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-muted/50 px-6 text-center">
        <MapPinIcon className="size-10 text-primary" aria-hidden />
        <p className="max-w-sm text-sm text-muted-foreground">{hint ?? title}</p>
        <Button type="button" onClick={() => setIsLoaded(true)} className="rounded-full">
          {loadLabel}
        </Button>
      </div>
    );
  }

  return (
    <iframe
      src={src}
      title={title}
      className="aspect-video w-full"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}
