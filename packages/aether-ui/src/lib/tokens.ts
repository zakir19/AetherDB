// ============================================================
// Aether UI — Theme Token System
// Zero-runtime CSS custom property tokens for infinite theming
// ============================================================

export const aetherTokens = {
  colors: {
    // Semantic palette
    background: "var(--aether-bg)",
    foreground: "var(--aether-fg)",
    card: "var(--aether-card)",
    cardForeground: "var(--aether-card-fg)",
    popover: "var(--aether-popover)",
    popoverForeground: "var(--aether-popover-fg)",
    primary: "var(--aether-primary)",
    primaryForeground: "var(--aether-primary-fg)",
    secondary: "var(--aether-secondary)",
    secondaryForeground: "var(--aether-secondary-fg)",
    muted: "var(--aether-muted)",
    mutedForeground: "var(--aether-muted-fg)",
    accent: "var(--aether-accent)",
    accentForeground: "var(--aether-accent-fg)",
    destructive: "var(--aether-destructive)",
    destructiveForeground: "var(--aether-destructive-fg)",
    border: "var(--aether-border)",
    input: "var(--aether-input)",
    ring: "var(--aether-ring)",
    // Glow & effects
    glow: "var(--aether-glow)",
    glowIntense: "var(--aether-glow-intense)",
    // Chart colors
    chart1: "var(--aether-chart-1)",
    chart2: "var(--aether-chart-2)",
    chart3: "var(--aether-chart-3)",
    chart4: "var(--aether-chart-4)",
    chart5: "var(--aether-chart-5)",
  },
  radius: {
    sm: "var(--aether-radius-sm)",
    md: "var(--aether-radius-md)",
    lg: "var(--aether-radius-lg)",
    xl: "var(--aether-radius-xl)",
    full: "var(--aether-radius-full)",
  },
  spacing: {
    xs: "var(--aether-space-xs)",
    sm: "var(--aether-space-sm)",
    md: "var(--aether-space-md)",
    lg: "var(--aether-space-lg)",
    xl: "var(--aether-space-xl)",
    "2xl": "var(--aether-space-2xl)",
    "3xl": "var(--aether-space-3xl)",
  },
  animation: {
    duration: {
      instant: "var(--aether-duration-instant)",
      fast: "var(--aether-duration-fast)",
      normal: "var(--aether-duration-normal)",
      slow: "var(--aether-duration-slow)",
      glacial: "var(--aether-duration-glacial)",
    },
    easing: {
      default: "var(--aether-ease-default)",
      in: "var(--aether-ease-in)",
      out: "var(--aether-ease-out)",
      inOut: "var(--aether-ease-in-out)",
      spring: "var(--aether-ease-spring)",
      bounce: "var(--aether-ease-bounce)",
    },
  },
  blur: {
    sm: "var(--aether-blur-sm)",
    md: "var(--aether-blur-md)",
    lg: "var(--aether-blur-lg)",
    xl: "var(--aether-blur-xl)",
  },
} as const;

// ============================================================
// Named Themes
// ============================================================

export interface AetherTheme {
  name: string;
  label: string;
  cssVars: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

const midnight: AetherTheme = {
  name: "midnight",
  label: "Midnight Void",
  cssVars: {
    light: {
      "--aether-bg": "0 0% 100%",
      "--aether-fg": "240 10% 3.9%",
      "--aether-card": "0 0% 100%",
      "--aether-card-fg": "240 10% 3.9%",
      "--aether-popover": "0 0% 100%",
      "--aether-popover-fg": "240 10% 3.9%",
      "--aether-primary": "240 5.9% 10%",
      "--aether-primary-fg": "0 0% 98%",
      "--aether-secondary": "240 4.8% 95.9%",
      "--aether-secondary-fg": "240 5.9% 10%",
      "--aether-muted": "240 4.8% 95.9%",
      "--aether-muted-fg": "240 3.8% 46.1%",
      "--aether-accent": "240 4.8% 95.9%",
      "--aether-accent-fg": "240 5.9% 10%",
      "--aether-destructive": "0 84.2% 60.2%",
      "--aether-destructive-fg": "0 0% 98%",
      "--aether-border": "240 5.9% 90%",
      "--aether-input": "240 5.9% 90%",
      "--aether-ring": "240 5.9% 10%",
      "--aether-glow": "250 80% 60%",
      "--aether-glow-intense": "250 90% 70%",
      "--aether-radius-sm": "0.25rem",
      "--aether-radius-md": "0.5rem",
      "--aether-radius-lg": "0.75rem",
      "--aether-radius-xl": "1rem",
      "--aether-radius-full": "9999px",
    },
    dark: {
      "--aether-bg": "240 10% 3.9%",
      "--aether-fg": "0 0% 98%",
      "--aether-card": "240 10% 3.9%",
      "--aether-card-fg": "0 0% 98%",
      "--aether-popover": "240 10% 3.9%",
      "--aether-popover-fg": "0 0% 98%",
      "--aether-primary": "0 0% 98%",
      "--aether-primary-fg": "240 5.9% 10%",
      "--aether-secondary": "240 3.7% 15.9%",
      "--aether-secondary-fg": "0 0% 98%",
      "--aether-muted": "240 3.7% 15.9%",
      "--aether-muted-fg": "240 5% 64.9%",
      "--aether-accent": "240 3.7% 15.9%",
      "--aether-accent-fg": "0 0% 98%",
      "--aether-destructive": "0 62.8% 30.6%",
      "--aether-destructive-fg": "0 0% 98%",
      "--aether-border": "240 3.7% 15.9%",
      "--aether-input": "240 3.7% 15.9%",
      "--aether-ring": "240 4.9% 83.9%",
      "--aether-glow": "250 80% 60%",
      "--aether-glow-intense": "250 90% 75%",
      "--aether-radius-sm": "0.25rem",
      "--aether-radius-md": "0.5rem",
      "--aether-radius-lg": "0.75rem",
      "--aether-radius-xl": "1rem",
      "--aether-radius-full": "9999px",
    },
  },
};

const cyberNeon: AetherTheme = {
  name: "cyber-neon",
  label: "Cyber Neon",
  cssVars: {
    light: {
      ...midnight.cssVars.light,
      "--aether-primary": "280 100% 50%",
      "--aether-accent": "180 100% 50%",
      "--aether-glow": "280 100% 65%",
      "--aether-glow-intense": "300 100% 70%",
    },
    dark: {
      ...midnight.cssVars.dark,
      "--aether-bg": "260 20% 5%",
      "--aether-primary": "280 100% 65%",
      "--aether-accent": "180 100% 60%",
      "--aether-glow": "280 100% 65%",
      "--aether-glow-intense": "300 100% 80%",
      "--aether-border": "280 30% 20%",
    },
  },
};

const glassVoid: AetherTheme = {
  name: "glass-void",
  label: "Glass Void",
  cssVars: {
    light: {
      ...midnight.cssVars.light,
      "--aether-primary": "220 90% 55%",
      "--aether-accent": "200 80% 60%",
      "--aether-glow": "210 100% 65%",
    },
    dark: {
      ...midnight.cssVars.dark,
      "--aether-bg": "220 30% 4%",
      "--aether-card": "220 20% 8%",
      "--aether-primary": "210 100% 65%",
      "--aether-accent": "200 80% 55%",
      "--aether-glow": "210 100% 70%",
      "--aether-glow-intense": "200 100% 80%",
      "--aether-border": "220 15% 15%",
    },
  },
};

const brutalNeon: AetherTheme = {
  name: "brutal-neon",
  label: "Brutal Neon",
  cssVars: {
    light: {
      ...midnight.cssVars.light,
      "--aether-primary": "60 100% 50%",
      "--aether-primary-fg": "0 0% 0%",
      "--aether-accent": "330 100% 50%",
      "--aether-glow": "60 100% 60%",
      "--aether-radius-sm": "0",
      "--aether-radius-md": "0",
      "--aether-radius-lg": "0",
      "--aether-radius-xl": "0",
    },
    dark: {
      ...midnight.cssVars.dark,
      "--aether-bg": "0 0% 2%",
      "--aether-primary": "60 100% 50%",
      "--aether-primary-fg": "0 0% 0%",
      "--aether-accent": "330 100% 60%",
      "--aether-glow": "60 100% 60%",
      "--aether-glow-intense": "330 100% 70%",
      "--aether-border": "0 0% 15%",
      "--aether-radius-sm": "0",
      "--aether-radius-md": "0",
      "--aether-radius-lg": "0",
      "--aether-radius-xl": "0",
    },
  },
};

const organicBio: AetherTheme = {
  name: "organic-bioluminescent",
  label: "Bioluminescent",
  cssVars: {
    light: {
      ...midnight.cssVars.light,
      "--aether-primary": "150 80% 40%",
      "--aether-accent": "170 90% 45%",
      "--aether-glow": "150 100% 55%",
    },
    dark: {
      ...midnight.cssVars.dark,
      "--aether-bg": "160 30% 3%",
      "--aether-primary": "150 90% 50%",
      "--aether-accent": "120 80% 55%",
      "--aether-glow": "150 100% 55%",
      "--aether-glow-intense": "120 100% 65%",
      "--aether-border": "160 20% 13%",
    },
  },
};

const solarFlare: AetherTheme = {
  name: "solar-flare",
  label: "Solar Flare",
  cssVars: {
    light: {
      ...midnight.cssVars.light,
      "--aether-primary": "30 100% 50%",
      "--aether-accent": "15 100% 55%",
      "--aether-glow": "35 100% 60%",
    },
    dark: {
      ...midnight.cssVars.dark,
      "--aether-bg": "20 30% 4%",
      "--aether-primary": "30 100% 55%",
      "--aether-accent": "15 100% 60%",
      "--aether-glow": "35 100% 60%",
      "--aether-glow-intense": "25 100% 70%",
      "--aether-border": "20 20% 14%",
    },
  },
};

const auroraFrost: AetherTheme = {
  name: "aurora-frost",
  label: "Aurora Frost",
  cssVars: {
    light: {
      ...midnight.cssVars.light,
      "--aether-primary": "170 80% 45%",
      "--aether-accent": "290 70% 55%",
      "--aether-glow": "170 90% 60%",
    },
    dark: {
      ...midnight.cssVars.dark,
      "--aether-bg": "200 25% 4%",
      "--aether-primary": "170 80% 55%",
      "--aether-accent": "290 70% 65%",
      "--aether-glow": "170 90% 60%",
      "--aether-glow-intense": "290 80% 70%",
      "--aether-border": "200 15% 14%",
    },
  },
};

const obsidianRose: AetherTheme = {
  name: "obsidian-rose",
  label: "Obsidian Rose",
  cssVars: {
    light: {
      ...midnight.cssVars.light,
      "--aether-primary": "340 80% 52%",
      "--aether-accent": "320 70% 50%",
      "--aether-glow": "340 90% 62%",
    },
    dark: {
      ...midnight.cssVars.dark,
      "--aether-bg": "340 15% 4%",
      "--aether-primary": "340 80% 58%",
      "--aether-accent": "320 70% 55%",
      "--aether-glow": "340 90% 62%",
      "--aether-glow-intense": "330 100% 72%",
      "--aether-border": "340 12% 15%",
    },
  },
};

const mercuryMist: AetherTheme = {
  name: "mercury-mist",
  label: "Mercury Mist",
  cssVars: {
    light: {
      ...midnight.cssVars.light,
      "--aether-primary": "0 0% 30%",
      "--aether-accent": "0 0% 50%",
      "--aether-glow": "220 10% 65%",
    },
    dark: {
      ...midnight.cssVars.dark,
      "--aether-bg": "0 0% 5%",
      "--aether-primary": "0 0% 75%",
      "--aether-accent": "0 0% 60%",
      "--aether-glow": "220 10% 65%",
      "--aether-glow-intense": "0 0% 85%",
      "--aether-border": "0 0% 14%",
    },
  },
};

const phantomIndigo: AetherTheme = {
  name: "phantom-indigo",
  label: "Phantom Indigo",
  cssVars: {
    light: {
      ...midnight.cssVars.light,
      "--aether-primary": "250 80% 55%",
      "--aether-accent": "230 70% 50%",
      "--aether-glow": "250 90% 65%",
    },
    dark: {
      ...midnight.cssVars.dark,
      "--aether-bg": "250 25% 4%",
      "--aether-primary": "250 80% 65%",
      "--aether-accent": "230 70% 60%",
      "--aether-glow": "250 90% 65%",
      "--aether-glow-intense": "240 100% 75%",
      "--aether-border": "250 18% 15%",
    },
  },
};

const emeraldDepth: AetherTheme = {
  name: "emerald-depth",
  label: "Emerald Depth",
  cssVars: {
    light: {
      ...midnight.cssVars.light,
      "--aether-primary": "160 90% 38%",
      "--aether-accent": "140 80% 42%",
      "--aether-glow": "160 100% 48%",
    },
    dark: {
      ...midnight.cssVars.dark,
      "--aether-bg": "160 25% 3%",
      "--aether-primary": "160 90% 48%",
      "--aether-accent": "140 80% 50%",
      "--aether-glow": "160 100% 52%",
      "--aether-glow-intense": "150 100% 62%",
      "--aether-border": "160 18% 13%",
    },
  },
};

const crimsonNight: AetherTheme = {
  name: "crimson-night",
  label: "Crimson Night",
  cssVars: {
    light: {
      ...midnight.cssVars.light,
      "--aether-primary": "0 85% 50%",
      "--aether-accent": "350 80% 48%",
      "--aether-glow": "0 100% 60%",
    },
    dark: {
      ...midnight.cssVars.dark,
      "--aether-bg": "0 20% 4%",
      "--aether-primary": "0 85% 55%",
      "--aether-accent": "350 80% 55%",
      "--aether-glow": "0 100% 60%",
      "--aether-glow-intense": "355 100% 70%",
      "--aether-border": "0 15% 15%",
    },
  },
};

export const themes: AetherTheme[] = [
  midnight,
  cyberNeon,
  glassVoid,
  brutalNeon,
  organicBio,
  solarFlare,
  auroraFrost,
  obsidianRose,
  mercuryMist,
  phantomIndigo,
  emeraldDepth,
  crimsonNight,
];

export function getTheme(name: string): AetherTheme | undefined {
  return themes.find((t) => t.name === name);
}

export type ThemeName = (typeof themes)[number]["name"];
