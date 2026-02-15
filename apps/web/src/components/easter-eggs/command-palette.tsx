"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

/* ─────────────────────────── 3D background orbs ──────────── */
function PaletteOrb({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
    ref.current.rotation.x = state.clock.elapsedTime * 0.3;
    ref.current.rotation.z = state.clock.elapsedTime * 0.2;
  });
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={ref} position={position}>
        <icosahedronGeometry args={[0.4, 2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} wireframe transparent opacity={0.7} />
      </mesh>
    </Float>
  );
}

function PaletteScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#8b5cf6" />
      <pointLight position={[-5, -3, 3]} intensity={0.5} color="#06b6d4" />
      <Stars radius={50} depth={30} count={800} factor={3} fade speed={1} />
      <PaletteOrb position={[-2.5, 1, -2]} color="#8b5cf6" speed={1.2} />
      <PaletteOrb position={[2.5, -0.5, -3]} color="#06b6d4" speed={0.8} />
      <PaletteOrb position={[0, 2, -4]} color="#ec4899" speed={1.5} />
      <PaletteOrb position={[-1.5, -1.5, -2.5]} color="#10b981" speed={1} />
    </>
  );
}

/* ─────────────────────────── command items ──────────────── */
interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon: string;
  action: () => void;
  keywords?: string[];
}

/* ─────────────────────────── main component ─────────────── */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: "home",
        label: "Go to Home",
        category: "Navigation",
        icon: "🏠",
        action: () => (window.location.href = "/"),
        keywords: ["home", "landing", "main"],
      },
      {
        id: "components",
        label: "Browse Components",
        category: "Navigation",
        icon: "🧩",
        action: () => (window.location.href = "/components"),
        keywords: ["components", "library", "ui"],
      },
      {
        id: "showroom",
        label: "Open Showroom",
        category: "Navigation",
        icon: "🎪",
        action: () => (window.location.href = "/showroom"),
        keywords: ["showroom", "demo", "playground"],
      },
      {
        id: "themes",
        label: "Explore Themes",
        category: "Navigation",
        icon: "🎨",
        action: () => (window.location.href = "/themes"),
        keywords: ["themes", "colors", "style"],
      },
      {
        id: "docs",
        label: "Read Documentation",
        category: "Navigation",
        icon: "📖",
        action: () => (window.location.href = "/docs"),
        keywords: ["docs", "documentation", "guide"],
      },
      {
        id: "theme-midnight",
        label: "Switch to Midnight",
        category: "Themes",
        icon: "🌙",
        action: () => document.documentElement.setAttribute("data-theme", "midnight"),
        keywords: ["midnight", "dark", "blue"],
      },
      {
        id: "theme-cyber",
        label: "Switch to Cyber Neon",
        category: "Themes",
        icon: "⚡",
        action: () => document.documentElement.setAttribute("data-theme", "cyber-neon"),
        keywords: ["cyber", "neon", "cyberpunk"],
      },
      {
        id: "theme-solar",
        label: "Switch to Solar Flare",
        category: "Themes",
        icon: "☀️",
        action: () => document.documentElement.setAttribute("data-theme", "solar-flare"),
        keywords: ["solar", "fire", "warm"],
      },
      {
        id: "theme-aurora",
        label: "Switch to Aurora Frost",
        category: "Themes",
        icon: "❄️",
        action: () => document.documentElement.setAttribute("data-theme", "aurora-frost"),
        keywords: ["aurora", "frost", "ice"],
      },
      {
        id: "theme-glass",
        label: "Switch to Glass Void",
        category: "Themes",
        icon: "🔮",
        action: () => document.documentElement.setAttribute("data-theme", "glass-void"),
        keywords: ["glass", "void", "transparent"],
      },
      {
        id: "theme-brutal",
        label: "Switch to Brutal Neon",
        category: "Themes",
        icon: "💥",
        action: () => document.documentElement.setAttribute("data-theme", "brutal-neon"),
        keywords: ["brutal", "neon", "loud"],
      },
      {
        id: "theme-organic",
        label: "Switch to Organic Bioluminescent",
        category: "Themes",
        icon: "🌿",
        action: () => document.documentElement.setAttribute("data-theme", "organic-bioluminescent"),
        keywords: ["organic", "bio", "green"],
      },
      {
        id: "theme-obsidian",
        label: "Switch to Obsidian Rose",
        category: "Themes",
        icon: "🌹",
        action: () => document.documentElement.setAttribute("data-theme", "obsidian-rose"),
        keywords: ["obsidian", "rose", "pink"],
      },
      {
        id: "theme-mercury",
        label: "Switch to Mercury Mist",
        category: "Themes",
        icon: "🌫️",
        action: () => document.documentElement.setAttribute("data-theme", "mercury-mist"),
        keywords: ["mercury", "mist", "silver"],
      },
      {
        id: "theme-phantom",
        label: "Switch to Phantom Indigo",
        category: "Themes",
        icon: "👻",
        action: () => document.documentElement.setAttribute("data-theme", "phantom-indigo"),
        keywords: ["phantom", "indigo", "purple"],
      },
      {
        id: "theme-emerald",
        label: "Switch to Emerald Depth",
        category: "Themes",
        icon: "💎",
        action: () => document.documentElement.setAttribute("data-theme", "emerald-depth"),
        keywords: ["emerald", "depth", "green"],
      },
      {
        id: "theme-crimson",
        label: "Switch to Crimson Night",
        category: "Themes",
        icon: "🩸",
        action: () => document.documentElement.setAttribute("data-theme", "crimson-night"),
        keywords: ["crimson", "night", "red"],
      },
      {
        id: "install",
        label: "Copy Install Command",
        category: "Actions",
        icon: "📋",
        action: () => {
          navigator.clipboard.writeText("npm install @aether-ui/react");
        },
        keywords: ["install", "npm", "copy", "clipboard"],
      },
      {
        id: "github",
        label: "Open GitHub Repo",
        category: "Actions",
        icon: "🐙",
        action: () => window.open("https://github.com/aether-ui/react", "_blank"),
        keywords: ["github", "repo", "source", "code"],
      },
      {
        id: "secret-rave",
        label: "🕺 Secret Rave Mode",
        category: "Easter Eggs",
        icon: "🪩",
        action: () => {
          const themes = [
            "cyber-neon", "brutal-neon", "solar-flare", "obsidian-rose",
            "phantom-indigo", "emerald-depth", "crimson-night", "aurora-frost",
          ];
          let i = 0;
          const interval = setInterval(() => {
            document.documentElement.setAttribute("data-theme", themes[i % themes.length]);
            i++;
            if (i > 24) clearInterval(interval);
          }, 200);
        },
        keywords: ["rave", "party", "disco", "secret", "easter"],
      },
      {
        id: "secret-matrix",
        label: "Enter The Matrix",
        category: "Easter Eggs",
        icon: "💊",
        action: () => {
          document.documentElement.setAttribute("data-theme", "cyber-neon");
          document.body.style.fontFamily = "'Courier New', monospace";
          setTimeout(() => (document.body.style.fontFamily = ""), 5000);
        },
        keywords: ["matrix", "neo", "pill", "secret"],
      },
      {
        id: "secret-flip",
        label: "Flip The World",
        category: "Easter Eggs",
        icon: "🙃",
        action: () => {
          document.documentElement.style.transform = "rotate(180deg)";
          document.documentElement.style.transition = "transform 1s ease";
          setTimeout(() => {
            document.documentElement.style.transform = "";
          }, 3000);
        },
        keywords: ["flip", "upside", "rotate", "secret"],
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    if (!query) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.keywords?.some((k) => k.includes(q))
    );
  }, [query, commands]);

  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const item of filtered) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [filtered]);

  const flatItems = useMemo(() => filtered, [filtered]);

  /* keyboard handler */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((p) => !p);
        setQuery("");
        setSelectedIndex(0);
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    },
    []
  );

  const handleInputKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, flatItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && flatItems[selectedIndex]) {
        e.preventDefault();
        flatItems[selectedIndex].action();
        setOpen(false);
      }
    },
    [flatItems, selectedIndex]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  /* scroll selected into view */
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* 3D background */}
          <div className="absolute inset-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 1.5]}>
              <PaletteScene />
            </Canvas>
          </div>

          {/* backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* palette card */}
          <motion.div
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-2xl shadow-purple-500/10 backdrop-blur-2xl"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* glow border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20 pointer-events-none" />

            {/* search input */}
            <div className="relative flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/40"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKey}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/40">
                ESC
              </kbd>
            </div>

            {/* list */}
            <div ref={listRef} className="max-h-80 overflow-y-auto p-2 scrollbar-hide">
              {flatItems.length === 0 && (
                <div className="py-8 text-center text-sm text-white/30">
                  No commands found for &quot;{query}&quot;
                </div>
              )}
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-2">
                  <div className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-white/30">
                    {category}
                  </div>
                  {items.map((item) => {
                    const globalIndex = flatItems.findIndex((f) => f.id === item.id);
                    const isSelected = globalIndex === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        data-index={globalIndex}
                        onClick={() => {
                          item.action();
                          setOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          isSelected
                            ? "bg-white/10 text-white"
                            : "text-white/60 hover:bg-white/5 hover:text-white/80"
                        }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span className="flex-1">{item.label}</span>
                        {item.category === "Easter Eggs" && (
                          <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] text-purple-300">
                            secret
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* footer */}
            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-[11px] text-white/25">
              <span>Aether Command Palette</span>
              <div className="flex items-center gap-2">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
