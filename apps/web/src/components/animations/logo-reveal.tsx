'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * LogoReveal (Preloader)
 * A minimalist, high-end landing animation that reveals the Aether DB brand.
 * 
 * @param onComplete Callback when the animation finishes
 * @param isDark Whether the current theme is dark (defaults to true)
 */
export function LogoReveal({ onComplete, isDark = true }: { onComplete: () => void; isDark?: boolean }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // Reset initial states
    gsap.set('.preloader-word', { yPercent: 100 });

    tl.to('.preloader-word', {
      yPercent: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'expo.out',
    })
      .to('.preloader-word', {
        yPercent: -105,
        duration: 1,
        stagger: 0.1,
        ease: 'expo.inOut',
        delay: 0.8
      })
      .to(container.current, {
        yPercent: -100,
        duration: 1.2,
        ease: 'expo.inOut',
      }, "-=0.2");
  }, { scope: container });

  return (
    <div
      ref={container}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#09090b]"
      style={{
        fontFamily: "var(--font-geist-sans), 'Inter', system-ui, sans-serif"
      }}
    >
      <div className="flex gap-4 text-white text-5xl md:text-8xl font-bold tracking-tighter">
        <div className="overflow-hidden py-1">
          <div className="preloader-word will-change-transform">Aether</div>
        </div>
        <div className="overflow-hidden py-1">
          <div className="preloader-word will-change-transform bg-gradient-to-br from-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            DB
          </div>
        </div>
      </div>

      {/* Subtle background noise/grain for premium feel */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />
    </div>
  );
}

export default LogoReveal;