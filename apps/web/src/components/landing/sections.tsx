"use client";

import React from "react";
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
} from "@aether-ui/react";
import {
  AnimatedTitle,
  FloatingCard,
  MagneticWrap,
  SectionHeader,
  TiltCard,
  StaggerContainer,
  StaggerItem,
  ScrollProgress,
} from "@/components/animations/motion-elements";

// ─── Feature Cards Data ────────────────────────────────────
const features = [
  {
    icon: "⬡",
    title: "Zero Runtime",
    description:
      "Compile-time CSS via Tailwind v4. No JS bundle overhead. Every component tree-shakable down to 0kb.",
  },
  {
    icon: "◎",
    title: "WCAG 2.2 AA+",
    description:
      "Every component passes automated and manual accessibility audits. Screen reader tested, keyboard navigable.",
  },
  {
    icon: "⟡",
    title: "Radix Primitives",
    description:
      "Built on the most battle-tested headless primitives. Unstyled accessibility that just works.",
  },
  {
    icon: "◆",
    title: "Insane Variants",
    description:
      "8 variants per component, compound styles, theme-aware tokens. CVA-powered variant system.",
  },
  {
    icon: "⬢",
    title: "18 Wild Themes",
    description:
      "From Cyber Neon to Sakura Bloom. One data attribute switches your entire reality.",
  },
  {
    icon: "◇",
    title: "CLI Install",
    description:
      "npx aether add button — copies components directly into your project. Own your code, never import.",
  },
];

const stats = [
  { value: "17+", label: "Components" },
  { value: "18", label: "Themes" },
  { value: "8", label: "Variants each" },
  { value: "0kb", label: "Runtime overhead" },
];

// ─── Hero Section ──────────────────────────────────────────
export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Animated grid background */}
      <div
        className="pointer-events-none absolute inset-0 animate-hero-grid-glow"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--aether-glow) / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--aether-glow) / 0.05) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating gradient orbs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[hsl(var(--aether-glow)/0.08)] blur-[100px] animate-hero-orb-float" />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-[hsl(var(--aether-accent)/0.06)] blur-[100px] animate-hero-orb-float"
        style={{ animationDelay: "3s", animationDirection: "reverse" }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[hsl(var(--aether-primary)/0.05)] blur-[80px] animate-hero-orb-float"
        style={{ animationDelay: "5s" }}
      />

      {/* Radial vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(var(--aether-bg))_75%)]" />

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <AnimatedTitle />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Stats Section ─────────────────────────────────────────
export function StatsSection() {
  return (
    <section className="relative border-y border-white/5 bg-white/[0.02] py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <FloatingCard key={stat.label} delay={i * 0.1} className="text-center">
              <div className="text-4xl font-bold text-[hsl(var(--aether-fg))] md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-[hsl(var(--aether-muted-fg))]">
                {stat.label}
              </div>
            </FloatingCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ──────────────────────────────────────
export function FeaturesSection() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          badge="Architecture"
          title="Built Different"
          description="Not another component library. A complete design system engine built for 2026 and beyond."
        />

        <StaggerContainer className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <TiltCard className="perspective-1000">
                <Card variant="glass" className="h-full p-6">
                  <div className="mb-4 text-3xl">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="mt-2">{feature.description}</CardDescription>
                </Card>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ─── Component Showcase ────────────────────────────────────
export function ShowcaseSection() {
  return (
    <section className="relative overflow-hidden py-32">
      {/* Background glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[600px] w-[600px] rounded-full bg-[hsl(var(--aether-glow))] opacity-[0.03] blur-[128px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          badge="Components"
          title="Every State. Every Variant."
          description="See every component alive — interactive, themed, and ready to copy."
        />

        <div className="mt-20 grid gap-8 lg:grid-cols-2">
          {/* Button showcase */}
          <FloatingCard delay={0.1}>
            <Card variant="glass" className="overflow-hidden">
              <CardHeader>
                <Badge variant="glow" className="w-fit">Button</Badge>
                <CardTitle className="mt-2">8 Variants · 5 Sizes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="glow">Glow</Button>
                  <Button variant="glass">Glass</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                </div>
                <Separator variant="gradient" />
                <div className="flex items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </CardContent>
            </Card>
          </FloatingCard>

          {/* Interactive form showcase */}
          <FloatingCard delay={0.2}>
            <Card variant="glass" className="overflow-hidden">
              <CardHeader>
                <Badge variant="glow" className="w-fit">Form Controls</Badge>
                <CardTitle className="mt-2">Inputs · Switches · Sliders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Input variant="glow" placeholder="Type something extraordinary..." />
                  <Input variant="glass" placeholder="Glass variant..." />
                  <Input variant="underline" placeholder="Underline variant..." />
                </div>
                <Separator variant="gradient" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[hsl(var(--aether-muted-fg))]">Enable glow effects</span>
                  <Switch variant="glow" defaultChecked />
                </div>
                <div className="space-y-3">
                  <span className="text-sm text-[hsl(var(--aether-muted-fg))]">Intensity</span>
                  <Slider variant="glow" defaultValue={[65]} max={100} step={1} />
                </div>
                <div className="space-y-3">
                  <span className="text-sm text-[hsl(var(--aether-muted-fg))]">Progress</span>
                  <Progress variant="gradient" value={72} />
                </div>
              </CardContent>
            </Card>
          </FloatingCard>

          {/* Card variants */}
          <FloatingCard delay={0.3}>
            <Card variant="glass" className="overflow-hidden">
              <CardHeader>
                <Badge variant="glow" className="w-fit">Cards</Badge>
                <CardTitle className="mt-2">5 Variants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card variant="elevated" className="p-4">
                  <span className="text-sm font-medium">Elevated</span>
                  <p className="text-xs text-[hsl(var(--aether-muted-fg))]">Hover for lift effect</p>
                </Card>
                <Card variant="glow" className="p-4">
                  <span className="text-sm font-medium">Glow</span>
                  <p className="text-xs text-[hsl(var(--aether-muted-fg))]">Ambient light bleeding</p>
                </Card>
                <Card variant="interactive" className="p-4">
                  <span className="text-sm font-medium">Interactive</span>
                  <p className="text-xs text-[hsl(var(--aether-muted-fg))]">Built for click targets</p>
                </Card>
              </CardContent>
            </Card>
          </FloatingCard>

          {/* Badge variants */}
          <FloatingCard delay={0.4}>
            <Card variant="glass" className="overflow-hidden">
              <CardHeader>
                <Badge variant="glow" className="w-fit">Badges & More</Badge>
                <CardTitle className="mt-2">Labels · Tags · Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="glow">Glow</Badge>
                  <Badge variant="glass">Glass</Badge>
                </div>
                <Separator variant="gradient" />
                <div className="space-y-4">
                  <Progress variant="glow" value={88} />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[hsl(var(--aether-muted-fg))]">Bundle size</span>
                    <span className="font-mono text-[hsl(var(--aether-glow))]">2.1kb gzipped</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FloatingCard>
        </div>
      </div>
    </section>
  );
}

// ─── Theme Showcase ────────────────────────────────────────
const themePreviewData = [
  { name: "Cyber Neon", attr: "cyber-neon", gradient: "from-purple-500 via-pink-500 to-cyan-400" },
  { name: "Glass Void", attr: "glass-void", gradient: "from-blue-600 via-blue-400 to-blue-300" },
  { name: "Brutal Neon", attr: "brutal-neon", gradient: "from-yellow-400 via-yellow-300 to-pink-500" },
  { name: "Bioluminescent", attr: "organic-bioluminescent", gradient: "from-green-500 via-emerald-400 to-green-300" },
  { name: "Solar Flare", attr: "solar-flare", gradient: "from-orange-500 via-amber-400 to-yellow-300" },
  { name: "Aurora Frost", attr: "aurora-frost", gradient: "from-teal-400 via-cyan-300 to-purple-400" },
  { name: "Obsidian Rose", attr: "obsidian-rose", gradient: "from-rose-500 via-pink-400 to-rose-300" },
  { name: "Mercury Mist", attr: "mercury-mist", gradient: "from-gray-400 via-gray-300 to-gray-200" },
  { name: "Phantom Indigo", attr: "phantom-indigo", gradient: "from-indigo-600 via-violet-500 to-indigo-400" },
  { name: "Emerald Depth", attr: "emerald-depth", gradient: "from-emerald-600 via-green-500 to-teal-400" },
  { name: "Crimson Night", attr: "crimson-night", gradient: "from-red-600 via-rose-500 to-red-400" },
  { name: "Midnight", attr: "midnight", gradient: "from-slate-700 via-slate-600 to-slate-400" },
  { name: "Velvet Twilight", attr: "velvet-twilight", gradient: "from-violet-600 via-purple-400 to-amber-400" },
  { name: "Frozen Cobalt", attr: "frozen-cobalt", gradient: "from-blue-700 via-blue-500 to-sky-300" },
  { name: "Toxic Lime", attr: "toxic-lime", gradient: "from-lime-400 via-green-400 to-purple-500" },
  { name: "Sakura Bloom", attr: "sakura-bloom", gradient: "from-pink-400 via-rose-300 to-violet-400" },
  { name: "Copper Forge", attr: "copper-forge", gradient: "from-orange-600 via-amber-500 to-yellow-400" },
  { name: "Galactic Blue", attr: "galactic-blue", gradient: "from-blue-800 via-indigo-500 to-cyan-400" },
];

export function ThemesSection() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          badge="Theming"
          title="18 Realities"
          description="Each theme is a complete design language. Switch between dimensions with a single attribute."
        />

        <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {themePreviewData.map((theme, i) => (
            <FloatingCard key={theme.name} delay={i * 0.05}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="group cursor-pointer"
              >
                <div
                  className={cn(
                    "aspect-square rounded-xl bg-gradient-to-br p-[1px]",
                    theme.gradient
                  )}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center rounded-[11px] bg-black/80 backdrop-blur">
                    <div className={cn("h-6 w-6 rounded-full bg-gradient-to-br", theme.gradient)} />
                  </div>
                </div>
                <p className="mt-2 text-center text-xs font-medium text-[hsl(var(--aether-muted-fg))] group-hover:text-[hsl(var(--aether-fg))]">
                  {theme.name}
                </p>
              </motion.div>
            </FloatingCard>
          ))}
        </div>

        {/* Theme code preview */}
        <FloatingCard delay={0.3} className="mt-16">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-black/50 backdrop-blur">
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-white/30">globals.css</span>
            </div>
            <pre className="overflow-x-auto p-6 text-sm leading-relaxed">
              <code className="text-white/70">
                <span className="text-purple-400">{"[data-theme=\"cyber-neon\"]"}</span>
                <span className="text-white/40">{"."}</span>
                <span className="text-blue-400">dark</span>
                {" {\n"}
                {"  "}
                <span className="text-white/40">--aether-primary:</span>
                {" "}
                <span className="text-green-400">280 100% 65%</span>
                {";\n"}
                {"  "}
                <span className="text-white/40">--aether-glow:</span>
                {" "}
                <span className="text-green-400">280 100% 65%</span>
                {";\n"}
                {"  "}
                <span className="text-white/40">--aether-accent:</span>
                {" "}
                <span className="text-green-400">180 100% 60%</span>
                {";\n"}
                {"}"}
              </code>
            </pre>
          </div>
        </FloatingCard>
      </div>
    </section>
  );
}

// ─── CLI Section ───────────────────────────────────────────
export function CLISection() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          badge="Developer Experience"
          title="Own Your Components"
          description="Copy components directly into your project. No dependency lock-in. Full control, always."
        />

        <div className="mt-20 grid gap-8 lg:grid-cols-2">
          {/* Terminal mockup */}
          <FloatingCard>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/60 backdrop-blur">
              <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-white/30">Terminal</span>
              </div>
              <div className="p-6 font-mono text-sm leading-8">
                <div>
                  <span className="text-[hsl(var(--aether-glow))]">$</span>
                  <span className="text-white/80"> npx aether init</span>
                </div>
                <div className="text-emerald-400">✓ Created components.json</div>
                <div className="text-emerald-400">✓ Created src/lib/utils.ts</div>
                <div className="mt-2 text-white/40">───────────────────────</div>
                <div className="mt-2">
                  <span className="text-[hsl(var(--aether-glow))]">$</span>
                  <span className="text-white/80"> npx aether add button card dialog</span>
                </div>
                <div className="text-cyan-400">⬡ Installing button...</div>
                <div className="text-emerald-400">✓ Added button.tsx → src/components/ui/</div>
                <div className="text-cyan-400">⬡ Installing card...</div>
                <div className="text-emerald-400">✓ Added card.tsx → src/components/ui/</div>
                <div className="text-cyan-400">⬡ Installing dialog...</div>
                <div className="text-emerald-400">✓ Added dialog.tsx → src/components/ui/</div>
              </div>
            </div>
          </FloatingCard>

          {/* Benefits */}
          <div className="flex flex-col justify-center space-y-8">
            {[
              {
                title: "No dependency lock-in",
                desc: "Components are copied into your project. Fork, modify, extend — it's your code now.",
              },
              {
                title: "Tree-shakable by design",
                desc: "Only the components you use end up in your bundle. Zero runtime overhead.",
              },
              {
                title: "TypeScript-first",
                desc: "Complete type safety with TypeScript 5.5. Every prop, every variant, fully typed.",
              },
              {
                title: "Tailwind v4 native",
                desc: "Built for the latest Tailwind with CSS custom properties. No config needed.",
              },
            ].map((benefit, i) => (
              <FloatingCard key={benefit.title} delay={i * 0.1}>
                <div className="flex gap-4">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--aether-glow))/0.1] text-[hsl(var(--aether-glow))]">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--aether-fg))]">{benefit.title}</h3>
                    <p className="mt-1 text-sm text-[hsl(var(--aether-muted-fg))]">{benefit.desc}</p>
                  </div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ─────────────────────────────────────────────
export function CTASection() {
  return (
    <section className="relative overflow-hidden py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--aether-glow))/0.03] to-transparent" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[500px] w-[500px] rounded-full bg-[hsl(var(--aether-glow))] opacity-[0.05] blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold tracking-tight text-[hsl(var(--aether-fg))] sm:text-5xl md:text-6xl">
            Ready to transcend?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[hsl(var(--aether-muted-fg))]">
            Join thousands of developers building the future with Aether UI.
            Free, open source, and built to last.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <MagneticWrap>
              <Button variant="glow" size="xl">
                Start Building
              </Button>
            </MagneticWrap>
            <MagneticWrap>
              <Button variant="outline" size="xl">
                Browse Components
              </Button>
            </MagneticWrap>
          </div>

          <p className="mt-8 text-sm text-[hsl(var(--aether-muted-fg))]">
            MIT Licensed · Free Forever · Built with Obsession
          </p>
        </motion.div>
      </div>
    </section>
  );
}
