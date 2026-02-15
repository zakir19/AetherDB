#!/usr/bin/env node

/**
 * ⬡ Aether CLI — Install components from the void
 *
 * Usage:
 *   npx aether add button
 *   npx aether add card dialog tabs
 *   npx aether add --all
 *   npx aether init
 *   npx aether diff button
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { resolve, join } from "path";

const COMPONENTS = [
  "accordion", "avatar", "badge", "button", "card", "checkbox",
  "dialog", "input", "label", "progress", "select", "separator",
  "slider", "switch", "tabs", "textarea", "tooltip",
];

const REGISTRY_URL = "https://aether-ui.dev/r/components";

// ─── Colors ────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
};

function log(msg: string) {
  console.log(`${c.cyan}⬡${c.reset} ${msg}`);
}
function success(msg: string) {
  console.log(`${c.green}✓${c.reset} ${msg}`);
}
function warn(msg: string) {
  console.log(`${c.yellow}⚠${c.reset} ${msg}`);
}
function error(msg: string) {
  console.error(`${c.red}✗${c.reset} ${msg}`);
}

// ─── Config ────────────────────────────────────────────────
interface AetherConfig {
  aliases: {
    components: string;
    utils: string;
    ui: string;
  };
  tsx: boolean;
  rsc: boolean;
}

function loadConfig(): AetherConfig | null {
  const configPath = resolve(process.cwd(), "components.json");
  if (!existsSync(configPath)) return null;
  return JSON.parse(readFileSync(configPath, "utf-8"));
}

function resolveAlias(alias: string): string {
  // Convert @/ alias to relative path
  return alias.replace(/^@\//, "src/");
}

// ─── Commands ──────────────────────────────────────────────
async function init() {
  log(`${c.bold}Initializing Aether UI...${c.reset}`);

  const config = {
    $schema: "https://aether-ui.dev/schema.json",
    style: "default",
    rsc: true,
    tsx: true,
    tailwind: {
      config: "tailwind.config.ts",
      css: "app/globals.css",
      baseColor: "midnight",
      cssVariables: true,
    },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    },
  };

  writeFileSync(
    resolve(process.cwd(), "components.json"),
    JSON.stringify(config, null, 2)
  );
  success("Created components.json");

  // Create utils
  const utilsDir = resolve(process.cwd(), "src/lib");
  mkdirSync(utilsDir, { recursive: true });
  writeFileSync(
    join(utilsDir, "utils.ts"),
    `import { clsx, type ClassValue } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}\n`
  );
  success("Created src/lib/utils.ts");

  log(`\n${c.bold}Aether UI initialized!${c.reset}`);
  log(`Run ${c.cyan}npx aether add button${c.reset} to add your first component.`);
}

async function add(components: string[]) {
  const config = loadConfig();
  if (!config) {
    error("No components.json found. Run `npx aether init` first.");
    process.exit(1);
  }

  const uiDir = resolve(process.cwd(), resolveAlias(config.aliases.ui));
  mkdirSync(uiDir, { recursive: true });

  for (const name of components) {
    if (!COMPONENTS.includes(name)) {
      warn(`Unknown component: ${name}. Skipping.`);
      continue;
    }

    log(`Installing ${c.bold}${name}${c.reset}...`);

    try {
      // In production, fetch from registry. For local dev, copy from package.
      const targetFile = join(uiDir, `${name}.tsx`);

      if (existsSync(targetFile)) {
        warn(`${name}.tsx already exists. Skipping.`);
        continue;
      }

      // Generate component file
      const content = generateComponent(name, config);
      writeFileSync(targetFile, content);
      success(`Added ${c.bold}${name}.tsx${c.reset} → ${resolveAlias(config.aliases.ui)}/`);
    } catch (err) {
      error(`Failed to install ${name}: ${err}`);
    }
  }

  log(`\n${c.dim}Don't forget to install peer dependencies:${c.reset}`);
  log(`${c.cyan}npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge${c.reset}`);
}

function generateComponent(name: string, config: AetherConfig): string {
  const utilsImport = config.aliases.utils.replace("@/", "@/");

  const templates: Record<string, string> = {
    button: `"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "${utilsImport}";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--aether-ring))] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-[hsl(var(--aether-primary))] text-[hsl(var(--aether-primary-fg))] shadow-lg hover:brightness-110",
        destructive: "bg-[hsl(var(--aether-destructive))] text-[hsl(var(--aether-destructive-fg))] shadow-lg",
        outline: "border border-[hsl(var(--aether-border))] bg-transparent hover:bg-[hsl(var(--aether-accent))]",
        secondary: "bg-[hsl(var(--aether-secondary))] text-[hsl(var(--aether-secondary-fg))]",
        ghost: "hover:bg-[hsl(var(--aether-accent))]",
        link: "text-[hsl(var(--aether-primary))] underline-offset-4 hover:underline",
        glow: "bg-[hsl(var(--aether-primary))] text-[hsl(var(--aether-primary-fg))] shadow-[0_0_20px_hsl(var(--aether-glow)/0.5)]",
        glass: "backdrop-blur-xl bg-white/10 border border-white/20",
      },
      size: {
        default: "h-10 px-5 py-2 rounded-[var(--aether-radius-md)]",
        sm: "h-8 px-3 text-xs rounded-[var(--aether-radius-sm)]",
        lg: "h-12 px-8 text-base rounded-[var(--aether-radius-lg)]",
        xl: "h-14 px-10 text-lg rounded-[var(--aether-radius-xl)]",
        icon: "h-10 w-10 rounded-[var(--aether-radius-md)]",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
`,
  };

  return templates[name] || `// TODO: Component "${name}" - fetch from registry\nexport {};`;
}

// ─── Main ──────────────────────────────────────────────────
const args = process.argv.slice(2);
const command = args[0];

console.log(`\n${c.magenta}${c.bold}  ⬡ Aether UI${c.reset} ${c.dim}v0.1.0${c.reset}\n`);

switch (command) {
  case "init":
    init();
    break;
  case "add":
    const components = args.slice(1).filter((a) => !a.startsWith("-"));
    if (args.includes("--all")) {
      add(COMPONENTS);
    } else if (components.length === 0) {
      error("Specify components to add: npx aether add button card");
    } else {
      add(components);
    }
    break;
  case "list":
    log(`${c.bold}Available components:${c.reset}\n`);
    COMPONENTS.forEach((c2) => console.log(`  • ${c2}`));
    console.log();
    break;
  default:
    log(`${c.bold}Commands:${c.reset}`);
    log(`  ${c.cyan}init${c.reset}         Initialize Aether UI in your project`);
    log(`  ${c.cyan}add${c.reset} <name>   Add a component to your project`);
    log(`  ${c.cyan}add --all${c.reset}    Add all components`);
    log(`  ${c.cyan}list${c.reset}         List available components`);
    console.log();
}
