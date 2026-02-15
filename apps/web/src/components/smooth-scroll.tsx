"use client";

import { useEffect, useRef } from "react";

/**
 * Lenis-powered smooth scroll wrapper.
 * Wraps the page in a Lenis instance for buttery-smooth inertia scrolling.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    let raf: number;
    let lenis: any;

    async function init() {
      try {
        const Lenis = (await import("lenis")).default;
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          touchMultiplier: 2,
          infinite: false,
        });

        lenisRef.current = lenis;

        function loop(time: number) {
          lenis.raf(time);
          raf = requestAnimationFrame(loop);
        }
        raf = requestAnimationFrame(loop);
      } catch {
        // Lenis not available — graceful degradation
      }
    }

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReduced) {
      init();
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
