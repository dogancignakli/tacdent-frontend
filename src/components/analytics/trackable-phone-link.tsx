"use client";

import type { ReactNode } from "react";
import { trackPhoneClick } from "@/lib/analytics";

type TrackablePhoneLinkProps = {
  href: string;
  location: string;
  className?: string;
  children: ReactNode;
};

export function TrackablePhoneLink({
  href,
  location,
  className,
  children,
}: TrackablePhoneLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackPhoneClick(location)}
    >
      {children}
    </a>
  );
}
