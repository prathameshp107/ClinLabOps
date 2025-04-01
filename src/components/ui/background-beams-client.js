"use client";

import dynamic from "next/dynamic";

const BackgroundBeams = dynamic(
  () => import("@/components/ui/aceternity/background-beams").then(mod => mod.BackgroundBeams),
  { ssr: false }
);

export function BackgroundBeamsClient({ className }) {
  return <BackgroundBeams className={className} />;
}