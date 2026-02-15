"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/three/hero-scene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0a0020] via-[#0d0030] to-[hsl(var(--aether-bg))]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.15)_0%,_transparent_70%)]" />
    </div>
  ),
});

export function ClientHeroScene() {
  return <HeroScene />;
}
