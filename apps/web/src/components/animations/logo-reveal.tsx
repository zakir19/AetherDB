'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function LogoReveal({ onComplete, isDark = true }: { onComplete: () => void; isDark?: boolean }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    gsap.set('.preloader-word', { yPercent: 100 });
    gsap.set('.preloader-tagline', { opacity: 0, y: 12 });

    tl.to('.preloader-word', {
      yPercent: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'expo.out',
    })

    .to('.preloader-tagline', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.6')

    .to('.preloader-word', {
      yPercent: -105,
      duration: 1,
      stagger: 0.1,
      ease: 'expo.inOut',
      delay: 0.8,
    })
    .to('.preloader-tagline', {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: 'power2.in',
    }, '-=0.8')
    .to(container.current, {
      yPercent: -100,
      duration: 1.2,
      ease: 'expo.inOut',
    }, '-=0.3');
  }, { scope: container });

  return (
    <div
      ref={container}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#09090b]"
      style={{
        fontFamily: "var(--font-geist-sans), 'Inter', system-ui, sans-serif"
      }}
    >

      <div className="flex flex-col items-center">
        <div className="flex gap-4 text-white text-5xl md:text-8xl font-bold tracking-tighter">
          <div className="overflow-hidden py-1">
            <div className="preloader-word will-change-transform">Aether</div>
          </div>
          <div className="overflow-hidden py-1">
            <div className="preloader-word will-change-transform bg-linear-to-br from-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              DB
            </div>
          </div>
        </div>

        <p className="preloader-tagline mt-6 text-xs md:text-sm tracking-[0.35em] uppercase text-white/40">
          AI-Powered Database Architecture
        </p>
      </div>


      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

export default LogoReveal;