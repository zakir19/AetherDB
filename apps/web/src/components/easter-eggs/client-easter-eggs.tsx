"use client";

import dynamic from "next/dynamic";

const CommandPalette = dynamic(
  () => import("@/components/easter-eggs/command-palette").then((m) => m.CommandPalette),
  { ssr: false }
);
const KonamiEasterEgg = dynamic(
  () => import("@/components/easter-eggs/secrets").then((m) => m.KonamiEasterEgg),
  { ssr: false }
);

export function ClientEasterEggs() {
  return (
    <>
      <CommandPalette />
      <KonamiEasterEgg />
    </>
  );
}
