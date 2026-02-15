<p align="center">
  <img src="https://raw.githubusercontent.com/aether-ui/react/main/.github/logo.svg" alt="Aether UI" width="120" />
</p>

<h1 align="center">Aether UI</h1>

<p align="center">
  <strong>Components forged beyond reality.</strong><br/>
  The ultimate React component library for 2026 and beyond.
</p>

<p align="center">
  <a href="https://aether-ui.dev">Website</a> ·
  <a href="https://aether-ui.dev/docs">Docs</a> ·
  <a href="https://aether-ui.dev/showroom">Showroom</a> ·
  <a href="https://aether-ui.dev/themes">Themes</a>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/@aether-ui/react?style=flat-square&color=8b5cf6" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/@aether-ui/react?style=flat-square&color=06b6d4" alt="downloads" />
  <img src="https://img.shields.io/bundlephobia/minzip/@aether-ui/react?style=flat-square&color=10b981" alt="bundle size" />
  <img src="https://img.shields.io/github/license/aether-ui/react?style=flat-square&color=ec4899" alt="license" />
  <img src="https://img.shields.io/badge/WCAG-2.2%20AA%2B-success?style=flat-square" alt="accessibility" />
</p>

---

## ✨ Why Aether?

| Feature | Details |
|---------|---------|
| 🎯 **React 19 + TypeScript 5.5** | Built on the bleeding edge — RSC-ready, fully typed |
| 🎨 **Tailwind CSS v4** | Zero-config, CSS-first theming with custom properties |
| 🧩 **Radix Primitives** | WCAG 2.2 AA+ accessibility baked into every component |
| 🎬 **Framer Motion** | Silky animations, spring physics, layout transitions |
| 🌐 **Three.js / R3F** | WebGL-powered showcase with custom GLSL shaders |
| 🌳 **Tree-shakable** | Import only what you need — zero dead code |
| 🔌 **Zero-runtime CSS** | CSS custom properties, no JS overhead for theming |
| 🎭 **12 Wild Themes** | From Cyber Neon to Obsidian Rose — all dark-first |
| ⚡ **CLI Tool** | `npx aether add button` — instant component scaffolding |
| 📦 **ESM + CJS** | Dual-format output with tsup, works everywhere |

## 🚀 Quick Start

```bash
# Install the library
npm install @aether-ui/react

# Or use the CLI to scaffold individual components
npx aether init
npx aether add button card dialog
```

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from "@aether-ui/react";

export function MyApp() {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Welcome to the future</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="glow" size="lg">
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
}
```

## 📦 Components

### Inputs
- **Button** — 8 variants (default, destructive, outline, secondary, ghost, link, glow, glass), 5 sizes, Slot composition
- **Input** — 4 variants (default, glass, glow, underline) with full form support
- **Textarea** — 3 variants with auto-resize support
- **Select** — Full Radix Select with custom trigger, content, items, labels, separators
- **Checkbox** — 2 variants (default, glow) with indeterminate state
- **Switch** — 2 variants with smooth thumb animation
- **Slider** — 2 variants with range support

### Display
- **Card** — 5 variants (default, elevated, glass, glow, interactive) + compound components
- **Badge** — 6 variants (default, secondary, destructive, outline, glow, glass)
- **Avatar** — 4 sizes + 3 variants (default, ring, glow) with fallback
- **Progress** — 3 variants (default, glow, gradient) with animated fill
- **Separator** — 3 variants for visual dividers
- **Label** — Accessible form labels

### Overlay
- **Dialog** — 3 variants (default, glass, glow) with portal, overlay, animations
- **Tooltip** — Accessible hover tooltips with configurable placement

### Navigation
- **Tabs** — 4 list variants (default, glass, pills, underline) with content panels
- **Accordion** — Collapsible sections with smooth chevron animation

## 🎨 Theming

Aether ships with **12 meticulously crafted themes** — all dark-first, all stunning:

| Theme | Vibe |
|-------|------|
| 🌙 Midnight | Deep blue-violet cosmos |
| ⚡ Cyber Neon | Cyberpunk electric green |
| 🔮 Glass Void | Frosted translucent elegance |
| 💥 Brutal Neon | In-your-face hot pink |
| 🌿 Organic Bioluminescent | Living emerald glow |
| ☀️ Solar Flare | Volcanic amber heat |
| ❄️ Aurora Frost | Arctic ice blue |
| 🌹 Obsidian Rose | Dark romantic crimson |
| 🌫️ Mercury Mist | Cool silver metallic |
| 👻 Phantom Indigo | Ethereal deep purple |
| 💎 Emerald Depth | Ocean jade green |
| 🩸 Crimson Night | Blood moon dramatic red |

### Apply a theme

```tsx
// In your root layout or provider
<html data-theme="cyber-neon" className="dark">
```

Or switch dynamically:

```tsx
document.documentElement.setAttribute("data-theme", "obsidian-rose");
```

### Custom theme

All tokens are CSS custom properties — override anything:

```css
[data-theme="my-theme"].dark {
  --aether-bg: 240 10% 4%;
  --aether-fg: 0 0% 98%;
  --aether-primary: 280 100% 70%;
  --aether-primary-fg: 0 0% 100%;
  /* ... 20+ tokens available */
}
```

## ⚡ CLI

The Aether CLI lets you scaffold components directly into your project:

```bash
# Initialize Aether in your project
npx aether init

# Add specific components
npx aether add button
npx aether add card dialog tabs

# Add all components at once
npx aether add --all

# List available components
npx aether list
```

## 🏗️ Architecture

```
aether-ui/
├── packages/
│   ├── aether-ui/          # Core component library
│   │   ├── src/
│   │   │   ├── components/  # 17 composable components
│   │   │   ├── lib/         # Utilities, tokens, themes
│   │   │   └── index.ts     # Tree-shakable barrel export
│   │   ├── tsup.config.ts   # ESM + CJS build
│   │   └── package.json
│   └── cli/                 # npx aether CLI tool
│       ├── src/index.ts
│       └── package.json
├── apps/
│   └── web/                 # Next.js 15 showcase site
│       ├── src/
│       │   ├── app/         # App Router pages
│       │   └── components/  # WebGL, animations, showroom
│       └── package.json
├── components.json          # CLI configuration
└── tsconfig.base.json       # Shared TypeScript config
```

## 🌐 Showcase Site

The showcase site at [aether-ui.dev](https://aether-ui.dev) is built to be an **Awwwards contender**:

- **WebGL Hero** — Custom GLSL shaders with simplex noise nebula + 2000 floating particles
- **3D Command Palette** — Press `Cmd+K` / `Ctrl+K` anywhere for a sci-fi command interface
- **Scroll Animations** — Framer Motion + scroll-triggered reveals throughout
- **Lenis Smooth Scroll** — Buttery inertia scrolling with reduced-motion respect
- **12 Live Themes** — Switch themes in real-time across the entire site
- **Interactive Showroom** — Every component, every variant, live and interactive
- **Easter Eggs** — Konami code, secret rave mode, and more hidden surprises

## 🔧 Development

```bash
# Clone the repo
git clone https://github.com/aether-ui/react.git
cd react

# Install dependencies
npm install

# Build the component library
npm run build --workspace=packages/aether-ui

# Start the showcase site
npm run dev --workspace=apps/web
```

## 🤝 Contributing

We welcome contributions! Whether it's:
- 🐛 Bug reports
- 💡 Feature suggestions
- 🎨 New themes
- 🧩 New components
- 📖 Documentation improvements

Please open an issue or submit a PR.

## 📄 License

MIT © [Aether UI](https://aether-ui.dev)

---

<p align="center">
  <strong>Built with obsession. Designed for the future.</strong><br/>
  <sub>If this saved you time, a ⭐ means the world.</sub>
</p>
