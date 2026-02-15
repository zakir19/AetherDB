"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Konami code easter egg — ↑↑↓↓←→←→BA
 * Triggers a celebration when the correct sequence is entered.
 */
const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

export function KonamiEasterEgg() {
  const [progress, setProgress] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === KONAMI[progress]) {
        const next = progress + 1;
        setProgress(next);
        if (next === KONAMI.length) {
          setUnlocked(true);
          setProgress(0);
          setTimeout(() => setUnlocked(false), 4000);
        }
      } else {
        setProgress(0);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [progress]);

  return (
    <AnimatePresence>
      {unlocked && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative rounded-3xl border border-white/20 bg-black/80 px-12 py-10 text-center shadow-2xl shadow-purple-500/30 backdrop-blur-2xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
          >
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Achievement Unlocked!
            </h2>
            <p className="text-white/60">
              You found the Konami code. You&apos;re a true gamer.
            </p>
            <div className="mt-4 flex justify-center gap-1">
              {["↑", "↑", "↓", "↓", "←", "→", "←", "→", "B", "A"].map(
                (k, i) => (
                  <motion.kbd
                    key={i}
                    className="inline-flex h-8 w-8 items-center justify-center rounded border border-white/20 bg-white/10 text-xs text-white/80"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {k}
                  </motion.kbd>
                )
              )}
            </div>
            {/* confetti burst */}
            <Confetti />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Confetti() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 400 - 200,
    y: Math.random() * -300 - 50,
    r: Math.random() * 360,
    color: ["#8b5cf6", "#06b6d4", "#ec4899", "#10b981", "#f59e0b", "#ef4444"][
      Math.floor(Math.random() * 6)
    ],
    size: Math.random() * 8 + 4,
    delay: Math.random() * 0.3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-sm"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            rotate: p.r,
            opacity: 0,
          }}
          transition={{
            duration: 1.5,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/**
 * Secret click counter — click the Aether logo 7 times to
 * trigger a special animation.
 */
export function SecretClickCounter({
  children,
}: {
  children: React.ReactNode;
}) {
  const [clicks, setClicks] = useState(0);
  const [activated, setActivated] = useState(false);

  const handleClick = () => {
    const next = clicks + 1;
    setClicks(next);
    if (next >= 7) {
      setActivated(true);
      setClicks(0);
      // Cycle through all themes rapidly
      const themes = [
        "midnight", "cyber-neon", "glass-void", "brutal-neon",
        "organic-bioluminescent", "solar-flare", "aurora-frost",
        "obsidian-rose", "mercury-mist", "phantom-indigo",
        "emerald-depth", "crimson-night",
      ];
      let i = 0;
      const interval = setInterval(() => {
        document.documentElement.setAttribute("data-theme", themes[i % themes.length]);
        document.documentElement.style.filter = `hue-rotate(${i * 30}deg)`;
        i++;
        if (i > themes.length * 2) {
          clearInterval(interval);
          document.documentElement.style.filter = "";
          setActivated(false);
        }
      }, 150);
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
      <AnimatePresence>
        {activated && (
          <motion.div
            className="fixed bottom-8 right-8 z-[99999] rounded-xl border border-purple-500/30 bg-black/80 px-4 py-3 text-sm text-purple-300 backdrop-blur-xl"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            🌈 Theme Roulette activated!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
