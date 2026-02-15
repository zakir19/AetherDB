"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Input,
  Switch,
  Slider,
  Progress,
  Separator,
  Avatar,
  AvatarFallback,
} from "@aether-ui/react";

const themeList = [
  { name: "midnight", label: "Midnight Void", gradient: "from-slate-700 via-slate-600 to-slate-400" },
  { name: "cyber-neon", label: "Cyber Neon", gradient: "from-purple-500 via-pink-500 to-cyan-400" },
  { name: "glass-void", label: "Glass Void", gradient: "from-blue-600 via-blue-400 to-blue-300" },
  { name: "brutal-neon", label: "Brutal Neon", gradient: "from-yellow-400 via-yellow-300 to-pink-500" },
  { name: "organic-bioluminescent", label: "Bioluminescent", gradient: "from-green-500 via-emerald-400 to-green-300" },
  { name: "solar-flare", label: "Solar Flare", gradient: "from-orange-500 via-amber-400 to-yellow-300" },
  { name: "aurora-frost", label: "Aurora Frost", gradient: "from-teal-400 via-cyan-300 to-purple-400" },
  { name: "obsidian-rose", label: "Obsidian Rose", gradient: "from-rose-500 via-pink-400 to-rose-300" },
  { name: "mercury-mist", label: "Mercury Mist", gradient: "from-gray-400 via-gray-300 to-gray-200" },
  { name: "phantom-indigo", label: "Phantom Indigo", gradient: "from-indigo-600 via-violet-500 to-indigo-400" },
  { name: "emerald-depth", label: "Emerald Depth", gradient: "from-emerald-600 via-green-500 to-teal-400" },
  { name: "crimson-night", label: "Crimson Night", gradient: "from-red-600 via-rose-500 to-red-400" },
  { name: "velvet-twilight", label: "Velvet Twilight", gradient: "from-violet-600 via-purple-400 to-amber-400" },
  { name: "frozen-cobalt", label: "Frozen Cobalt", gradient: "from-blue-700 via-blue-500 to-sky-300" },
  { name: "toxic-lime", label: "Toxic Lime", gradient: "from-lime-400 via-green-400 to-purple-500" },
  { name: "sakura-bloom", label: "Sakura Bloom", gradient: "from-pink-400 via-rose-300 to-violet-400" },
  { name: "copper-forge", label: "Copper Forge", gradient: "from-orange-600 via-amber-500 to-yellow-400" },
  { name: "galactic-blue", label: "Galactic Blue", gradient: "from-blue-800 via-indigo-500 to-cyan-400" },
];

export function ThemeSwitcher() {
  const [activeTheme, setActiveTheme] = useState("midnight");

  const applyTheme = (theme: string) => {
    setActiveTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
  };

  return (
    <div className="space-y-12">
      {/* Theme Selector Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {themeList.map((theme) => (
          <motion.button
            key={theme.name}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => applyTheme(theme.name)}
            className={cn(
              "group relative overflow-hidden rounded-xl p-[1px] transition-all",
              activeTheme === theme.name
                ? "ring-2 ring-[hsl(var(--aether-primary))] ring-offset-2 ring-offset-[hsl(var(--aether-bg))]"
                : ""
            )}
          >
            <div className={cn("aspect-square rounded-xl bg-gradient-to-br p-[1px]", theme.gradient)}>
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[11px] bg-black/80">
                <div className={cn("h-8 w-8 rounded-full bg-gradient-to-br shadow-lg", theme.gradient)} />
                {activeTheme === theme.name && (
                  <motion.div
                    layoutId="active-theme-indicator"
                    className="absolute bottom-2 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-white"
                  />
                )}
              </div>
            </div>
            <p className="mt-2 text-center text-xs font-medium text-[hsl(var(--aether-muted-fg))] group-hover:text-[hsl(var(--aether-fg))]">
              {theme.label}
            </p>
          </motion.button>
        ))}
      </div>

      <Separator variant="gradient" />

      {/* Theme Preview */}
      <motion.div
        key={activeTheme}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="mb-8 text-2xl font-bold text-[hsl(var(--aether-fg))]">
          Preview: {themeList.find((t) => t.name === activeTheme)?.label}
        </h2>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Buttons */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="glow">Glow</Button>
                <Button variant="glass">Glass</Button>
                <Button variant="outline">Outline</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </CardContent>
          </Card>

          {/* Form Elements */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Form Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input variant="glow" placeholder="Glow input..." />
              <div className="flex items-center justify-between">
                <span className="text-sm text-[hsl(var(--aether-muted-fg))]">Glow toggle</span>
                <Switch variant="glow" defaultChecked />
              </div>
              <Slider variant="glow" defaultValue={[60]} />
              <Progress variant="gradient" value={75} />
            </CardContent>
          </Card>

          {/* Badges & Avatars */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Badges & Avatars</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="glow">Glow</Badge>
                <Badge variant="glass">Glass</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              <div className="flex items-center gap-3">
                <Avatar variant="glow"><AvatarFallback>AU</AvatarFallback></Avatar>
                <Avatar variant="ring"><AvatarFallback>RB</AvatarFallback></Avatar>
                <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
              </div>
            </CardContent>
          </Card>

          {/* Cards */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Card Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Card variant="elevated" className="p-3">
                <span className="text-sm font-medium">Elevated Card</span>
              </Card>
              <Card variant="glow" className="p-3">
                <span className="text-sm font-medium">Glow Card</span>
              </Card>
              <Card variant="interactive" className="p-3">
                <span className="text-sm font-medium">Interactive Card</span>
              </Card>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
