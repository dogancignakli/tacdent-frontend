"use client";

import { useState } from "react";
import { MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type MapEmbedProps = {
  src: string;
  title: string;
  loadLabel: string;
};

export default function MapEmbed({ src, title, loadLabel }: MapEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 bg-muted/50">
        <MapPinIcon className="size-10 text-primary" aria-hidden />
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
