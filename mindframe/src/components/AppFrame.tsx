// src/components/AppFrame.tsx
//
// Native: a passthrough, so wrapping things in it costs nothing.
// The web version (AppFrame.web.tsx) constrains content to a phone-width column.
import React from "react";

interface AppFrameProps {
  children: React.ReactNode;
  /** Web only: leave the page and column unpainted, for content in a transparent Modal. */
  transparent?: boolean;
}

export function AppFrame({ children }: AppFrameProps) {
  return <>{children}</>;
}
