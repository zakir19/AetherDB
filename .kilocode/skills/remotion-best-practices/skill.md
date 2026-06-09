# Cinematic Motion Engineering with Remotion

A production-grade framework for creating studio-quality motion graphics in modern SaaS marketing videos, AI product demos, and developer tool explainers — with a fully adaptive light and dark theme system.

---

## Table of Contents

1. [Design Token Architecture](#1-design-token-architecture)
2. [Theme-Aware Color System](#2-theme-aware-color-system)
3. [Animation Primitives](#3-animation-primitives)
4. [Spring Physics & Interpolation](#4-spring-physics--interpolation)
5. [Composition Layering](#5-composition-layering)
6. [Scene Orchestration](#6-scene-orchestration)
7. [Real-World Motion Patterns](#7-real-world-motion-patterns)
8. [Performance Optimization](#8-performance-optimization)
9. [Anti-Patterns & Debugging](#9-anti-patterns--debugging)
10. [Animation Recipes](#10-animation-recipes)

---

## 1. Design Token Architecture

### 1.1 Core Design Tokens

Define a unified token system that adapts seamlessly between light and dark modes:

```typescript
// tokens/motion.ts
export const motionTokens = {
  // Duration scales (in frames @ 60fps)
  duration: {
    instant: 3,      // 50ms - micro-interactions
    fast: 9,         // 150ms - button hovers, small transitions
    normal: 18,      // 300ms - standard transitions
    slow: 30,        // 500ms - entrances, reveals
    cinematic: 60,   // 1000ms - hero animations
    dramatic: 120,   // 2000ms - special moments
  },
  
  // Easing curves (cubic-bezier)
  ease: {
    linear: [0, 0, 1, 1],
    default: [0.4, 0, 0.2, 1],
    in: [0.4, 0, 1, 1],
    out: [0, 0, 0.2, 1],
    inOut: [0.4, 0, 0.2, 1],
    // Cinematic eases
    expoOut: [0.16, 1, 0.3, 1],
    expoIn: [0.7, 0, 0.84, 0],
    expoInOut: [0.87, 0, 0.13, 1],
    // Spring-like
    spring: [0.34, 1.56, 0.64, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
  },
  
  // Spring configurations
  spring: {
    gentle: { mass: 1, stiffness: 100, damping: 15 },
    standard: { mass: 1, stiffness: 200, damping: 20 },
    snappy: { mass: 1, stiffness: 400, damping: 25 },
    bouncy: { mass: 1, stiffness: 300, damping: 10 },
    smooth: { mass: 2, stiffness: 150, damping: 25 },
  },
  
  // Distance scales (in pixels)
  distance: {
    xs: 10,
    sm: 25,
    md: 50,
    lg: 100,
    xl: 200,
    screen: 1080,
  },
  
  // Scale values
  scale: {
    subtle: 1.02,
    normal: 1.05,
    emphasis: 1.1,
    dramatic: 1.25,
    pop: 1.5,
  },
  
  // Opacity values
  opacity: {
    ghost: 0.1,
    muted: 0.3,
    subtle: 0.5,
    visible: 0.7,
    solid: 1,
  },
  
  // Blur values
  blur: {
    subtle: '2px',
    soft: '4px',
    medium: '8px',
    strong: '16px',
    extreme: '32px',
  },
  
  // Z-index layering
  zIndex: {
    background: -10,
    base: 0,
    content: 10,
    overlay: 50,
    floating: 100,
    modal: 200,
    tooltip: 300,
    max: 9999,
  },
};
```

### 1.2 Theme Token System

```typescript
// tokens/theme.ts
export type ThemeMode = 'light' | 'dark';

export interface ThemeTokens {
  // Background hierarchy
  background: {
    primary: string;      // Main canvas
    secondary: string;    // Cards, sections
    tertiary: string;     // Subtle backgrounds
    elevated: string;     // Popovers, modals
    inverse: string;      // Contrasting elements
  };
  
  // Foreground hierarchy
  foreground: {
    primary: string;      // Headlines
    secondary: string;    // Body text
    tertiary: string;     // Captions, labels
    muted: string;        // Placeholders, disabled
    inverse: string;      // On dark backgrounds
  };
  
  // Accent colors (brand)
  accent: {
    primary: string;      // Main brand color
    secondary: string;    // Complementary
    tertiary: string;     // Tertiary accent
    gradient: [string, string, string?]; // Gradient stops
  };
  
  // Functional colors
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  
  // UI elements
  border: {
    subtle: string;
    default: string;
    strong: string;
  };
  
  // Glow effects (adaptive)
  glow: {
    primary: string;
    accent: string;
    success: string;
    error: string;
  };
  
  // Shadow system
  shadow: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    glow: string;
  };
}

// Light theme tokens
export const lightTheme: ThemeTokens = {
  background: {
    primary: '#fafafa',
    secondary: '#ffffff',
    tertiary: '#f5f5f5',
    elevated: '#ffffff',
    inverse: '#0a0a0a',
  },
  foreground: {
    primary: '#0a0a0a',
    secondary: '#525252',
    tertiary: '#737373',
    muted: '#a3a3a3',
    inverse: '#fafafa',
  },
  accent: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    tertiary: '#ec4899',
    gradient: ['#6366f1', '#8b5cf6', '#ec4899'],
  },
  status: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  border: {
    subtle: '#e5e5e5',
    default: '#d4d4d4',
    strong: '#a3a3a3',
  },
  glow: {
    primary: 'rgba(99, 102, 241, 0.3)',
    accent: 'rgba(139, 92, 246, 0.3)',
    success: 'rgba(34, 197, 94, 0.3)',
    error: 'rgba(239, 68, 68, 0.3)',
  },
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    glow: '0 0 40px rgba(99, 102, 241, 0.2)',
  },
};

// Dark theme tokens
export const darkTheme: ThemeTokens = {
  background: {
    primary: '#09090b',
    secondary: '#0a0a0a',
    tertiary: '#141414',
    elevated: '#1a1a1a',
    inverse: '#fafafa',
  },
  foreground: {
    primary: '#fafafa',
    secondary: '#a1a1aa',
    tertiary: '#71717a',
    muted: '#52525b',
    inverse: '#0a0a0a',
  },
  accent: {
    primary: '#818cf8',
    secondary: '#a78bfa',
    tertiary: '#f472b6',
    gradient: ['#818cf8', '#a78bfa', '#f472b6'],
  },
  status: {
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
  },
  border: {
    subtle: '#27272a',
    default: '#3f3f46',
    strong: '#52525b',
  },
  glow: {
    primary: 'rgba(129, 140, 248, 0.4)',
    accent: 'rgba(167, 139, 250, 0.4)',
    success: 'rgba(74, 222, 128, 0.4)',
    error: 'rgba(248, 113, 113, 0.4)',
  },
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.6), 0 8px 10px -6px rgb(0 0 0 / 0.6)',
    glow: '0 0 60px rgba(129, 140, 248, 0.35)',
  },
};
```

### 1.3 Theme Provider Component

```tsx
// components/ThemeProvider.tsx
import { createContext, useContext, ReactNode } from 'react';
import { lightTheme, darkTheme, ThemeTokens, ThemeMode } from '../tokens/theme';

interface ThemeContextType {
  theme: ThemeTokens;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ 
  children, 
  defaultMode = 'dark' 
}: { 
  children: ReactNode; 
  defaultMode?: ThemeMode;
}) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  
  const theme = mode === 'light' ? lightTheme : darkTheme;
  
  const toggleTheme = () => setMode(prev => prev === 'light' ? 'dark' : 'light');
  
  // Provide CSS custom properties for all tokens
  const cssVariables = useMemo(() => {
    const vars: Record<string, string> = {};
    
    // Flatten theme tokens into CSS variables
    Object.entries(theme).forEach(([category, values]) => {
      Object.entries(values).forEach(([key, value]) => {
        if (typeof value === 'string') {
          vars[`--${category}-${key}`] = value;
        } else if (Array.isArray(value)) {
          vars[`--${category}-${key}`] = value.join(', ');
        }
      });
    });
    
    return vars;
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, mode, setMode, toggleTheme }}>
      <div style={cssVariables}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

---

## 2. Theme-Aware Color System

### 2.1 Adaptive Color Utilities

```typescript
// utils/colors.ts
import { interpolate, Color, Easing } from 'remotion';
import { ThemeTokens, ThemeMode } from '../tokens/theme';

// Interpolate between light and dark theme colors
export function interpolateThemeColor(
  frame: number,
  duration: number,
  lightColor: string,
  darkColor: string,
  easing: Easing = (t) => t
): string {
  return interpolate(frame, [0, duration], [lightColor, darkColor], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
}

// Get adaptive color based on current theme
export function getThemeColor(
  mode: ThemeMode,
  colorKey: keyof ThemeTokens['accent']
): string {
  const theme = mode === 'light' ? lightTheme : darkTheme;
  return theme.accent[colorKey];
}

// Calculate contrast ratio for accessibility
export function getContrastRatio(foreground: string, background: string): number {
  const luminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    
    const [lr, lg, lb] = [r, g, b].map((c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
  };
  
  const l1 = luminance(foreground);
  const l2 = luminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// Ensure minimum contrast ratio
export function ensureContrast(
  color: string,
  background: string,
  minRatio: number = 4.5
): string {
  const currentRatio = getContrastRatio(color, background);
  
  if (currentRatio >= minRatio) return color;
  
  // Adjust color brightness
  // Implementation would adjust HSL lightness
  return color;
}

// Generate theme-aware gradient
export function generateGradient(
  mode: ThemeMode,
  type: 'primary' | 'accent' | 'success' | 'error' = 'primary',
  angle: number = 135
): string {
  const theme = mode === 'light' ? lightTheme : darkTheme;
  const colors = theme.accent.gradient;
  
  return `linear-gradient(${angle}deg, ${colors.join(', ')})`;
}

// Animated gradient for theme transitions
export function getAnimatedGradient(
  frame: number,
  mode: ThemeMode,
  offset: number = 0
): string {
  const theme = mode === 'light' ? lightTheme : darkTheme;
  const colors = theme.accent.gradient;
  
  // Create flowing gradient effect
  const position = (frame + offset) % 300;
  const percentage = position / 3;
  
  return `linear-gradient(${135 + percentage}deg, ${colors.join(', ')})`;
}
```

### 2.2 Theme Transition Effects

```tsx
// components/ThemeTransition.tsx
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { motionTokens } from '../tokens/motion';

interface ThemeTransitionProps {
  children: React.ReactNode;
  fromMode: 'light' | 'dark';
  toMode: 'light' | 'dark';
  duration?: number;
  type?: 'crossfade' | 'gradient-morph' | 'ambient-shift';
}

// Crossfade transition
export function CrossfadeTransition({
  children,
  fromMode,
  toMode,
  duration = 30,
}: ThemeTransitionProps) {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(frame, [0, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: motionTokens.ease.expoInOut,
  });
  
  return (
    <div style={{ position: 'relative' }}>
      {/* Outgoing theme */}
      <div style={{ 
        opacity,
        position: 'absolute',
        inset: 0,
      }}>
        {children}
      </div>
      
      {/* Incoming theme */}
      <div style={{ 
        opacity: 1 - opacity,
        position: 'relative',
      }}>
        {children}
      </div>
    </div>
  );
}

// Gradient morph transition
export function GradientMorphTransition({
  children,
  fromMode,
  toMode,
  duration = 60,
}: ThemeTransitionProps) {
  const frame = useCurrentFrame();
  
  const fromGradient = fromMode === 'light' 
    ? 'radial-gradient(circle at 50% 50%, #fafafa 0%, #f0f0f0 100%)'
    : 'radial-gradient(circle at 50% 50%, #09090b 0%, #0a0a0a 100%)';
    
  const toGradient = toMode === 'light'
    ? 'radial-gradient(circle at 50% 50%, #fafafa 0%, #f0f0f0 100%)'
    : 'radial-gradient(circle at 50% 50%, #09090b 0%, #0a0a0a 100%)';
  
  const progress = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: motionTokens.ease.expoInOut,
  });
  
  // Note: Actual gradient interpolation requires additional handling
  // This is a conceptual representation
  
  return (
    <div style={{
      background: progress < 0.5 ? fromGradient : toGradient,
      transition: 'background 0.5s ease',
    }}>
      {children}
    </div>
  );
}

// Ambient lighting shift
export function AmbientShiftTransition({
  children,
  fromMode,
  toMode,
  duration = 90,
}: ThemeTransitionProps) {
  const frame = useCurrentFrame();
  
  const fromGlow = fromMode === 'light' 
    ? 'rgba(255, 255, 255, 0.8)'
    : 'rgba(129, 140, 248, 0.3)';
    
  const toGlow = toMode === 'light'
    ? 'rgba(255, 255, 255, 0.8)'
    : 'rgba(129, 140, 248, 0.3)'';
  
  const glowIntensity = interpolate(frame, [0, duration / 2, duration], [0.3, 0.8, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  return (
    <div style={{ position: 'relative' }}>
      {/* Ambient glow overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at 50% 0%, ${fromGlow} 0%, transparent 60%)`,
        opacity: glowIntensity,
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  );
}
```

---

## 3. Animation Primitives

### 3.1 Core Animation Components

```tsx
// primitives/Fade.tsx
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { motionTokens } from '../tokens/motion';

interface FadeProps {
  children: React.ReactNode;
  start?: number;
  duration?: number;
  direction?: 'in' | 'out' | 'in-out';
  easing?: Easing;
  style?: React.CSSProperties;
}

export function Fade({
  children,
  start = 0,
  duration = motionTokens.duration.normal,
  direction = 'in',
  easing = motionTokens.ease.default,
  style,
}: FadeProps) {
  const frame = useCurrentFrame();
  
  const opacity = (() => {
    switch (direction) {
      case 'in':
        return interpolate(frame, [start, start + duration], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing,
        });
      case 'out':
        return interpolate(frame, [start, start + duration], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing,
        });
      case 'in-out':
        return interpolate(frame, 
          [start, start + duration / 2, start + duration], 
          [0, 1, 0], 
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing }
        );
      default:
        return 1;
    }
  })();
  
  return (
    <div style={{ opacity, ...style }}>
      {children}
    </div>
  );
}

// primitives/Slide.tsx
interface SlideProps extends FadeProps {
  distance?: number;
  axis?: 'x' | 'y';
  from?: 'start' | 'end';
}

export function Slide({
  children,
  distance = motionTokens.distance.md,
  axis = 'y',
  from = 'end',
  ...fadeProps
}: SlideProps) {
  const frame = useCurrentFrame();
  const { start = 0, duration = motionTokens.duration.normal, easing = motionTokens.ease.expoOut } = fadeProps;
  
  const fromValue = from === 'start' ? -distance : distance;
  const toValue = 0;
  
  const translate = interpolate(frame, [start, start + duration], [fromValue, toValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
  
  const opacity = interpolate(frame, [start, start + duration * 0.5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const transform = axis === 'y' 
    ? `translateY(${translate}px)` 
    : `translateX(${translate}px)`;
  
  return (
    <div style={{ transform, opacity }}>
      {children}
    </div>
  );
}

// primitives/Scale.tsx
interface ScaleProps extends FadeProps {
  from?: number;
  to?: number;
  origin?: string;
}

export function Scale({
  children,
  from = 0.8,
  to = 1,
  origin = 'center',
  ...fadeProps
}: ScaleProps) {
  const frame = useCurrentFrame();
  const { start = 0, duration = motionTokens.duration.normal, easing = motionTokens.ease.spring } = fadeProps;
  
  const scale = interpolate(frame, [start, start + duration], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
  
  return (
    <div style={{ 
      transform: `scale(${scale})`,
      transformOrigin: origin,
    }}>
      {children}
    </div>
  );
}

// primitives/Blur.tsx
interface BlurProps extends FadeProps {
  from?: number;
  to?: number;
}

export function Blur({
  children,
  from = 10,
  to = 0,
  ...fadeProps
}: BlurProps) {
  const frame = useCurrentFrame();
  const { start = 0, duration = motionTokens.duration.slow } = fadeProps;
  
  const blur = interpolate(frame, [start, start + duration], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  return (
    <div style={{ filter: `blur(${blur}px)` }}>
      {children}
    </div>
  );
}
```

### 3.2 Advanced Primitives

```tsx
// primitives/Stagger.tsx
import { Children, cloneElement, isValidElement } from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface StaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  start?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  childStyle?: (index: number, progress: number) => React.CSSProperties;
}

export function Stagger({
  children,
  staggerDelay = 3,
  start = 0,
  duration = 18,
  direction = 'up',
  childStyle,
}: StaggerProps) {
  const frame = useCurrentFrame();
  const childArray = Children.toArray(children);
  
  const getDirectionOffset = (progress: number) => {
    const distance = 30;
    switch (direction) {
      case 'up': return { y: (1 - progress) * distance };
      case 'down': return { y: (progress - 1) * distance };
      case 'left': return { x: (1 - progress) * distance };
      case 'right': return { x: (progress - 1) * distance };
    }
  };
  
  return (
    <>
      {childArray.map((child, index) => {
        const childStart = start + index * staggerDelay;
        const childEnd = childStart + duration;
        
        const progress = interpolate(frame, [childStart, childEnd], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: motionTokens.ease.expoOut,
        });
        
        const offset = getDirectionOffset(progress);
        
        const defaultStyle: React.CSSProperties = {
          opacity: progress,
          transform: `translate(${offset.x || 0}px, ${offset.y || 0}px)`,
        };
        
        if (!isValidElement(child)) return child;
        
        return cloneElement(child, {
          style: {
            ...defaultStyle,
            ...childStyle?.(index, progress),
            ...(child.props.style || {}),
          },
        });
      })}
    </>
  );
}

// primitives/Morph.tsx
interface MorphProps {
  children: (progress: number) => React.ReactNode;
  start?: number;
  duration?: number;
  easing?: (t: number) => number;
}

export function Morph({
  children,
  start = 0,
  duration = 30,
  easing = (t) => t,
}: MorphProps) {
  const frame = useCurrentFrame();
  
  const progress = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
  
  return <>{children(progress)}</>;
}

// primitives/Loop.tsx
interface LoopProps {
  children: React.ReactNode;
  duration: number;
  times?: number | 'infinite';
  easing?: (t: number) => number;
}

export function Loop({
  children,
  duration,
  times = 'infinite',
  easing = (t) => t,
}: LoopProps) {
  const frame = useCurrentFrame();
  
  const loopProgress = (() => {
    if (times === 'infinite') {
      return (frame % duration) / duration;
    }
    const totalDuration = duration * times;
    if (frame >= totalDuration) return 1;
    return (frame % duration) / duration;
  })();
  
  const easedProgress = easing(loopProgress);
  
  return (
    <LoopContext.Provider value={easedProgress}>
      {children}
    </LoopContext.Provider>
  );
}

const LoopContext = createContext<number>(0);
export const useLoop = () => useContext(LoopContext);
```

---

## 4. Spring Physics & Interpolation

### 4.1 Spring Configuration System

```typescript
// physics/springs.ts
import { spring, SpringConfig } from 'remotion';

// Pre-configured spring presets
export const springs = {
  // Gentle, elegant motion (good for text reveals)
  gentle: {
    damping: 15,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
  } as SpringConfig,
  
  // Standard UI interactions
  standard: {
    damping: 20,
    mass: 1,
    stiffness: 200,
    overshootClamping: false,
  } as SpringConfig,
  
  // Snappy, responsive feel
  snappy: {
    damping: 25,
    mass: 1,
    stiffness: 400,
    overshootClamping: false,
  } as SpringConfig,
  
  // Bouncy, playful
  bouncy: {
    damping: 10,
    mass: 1,
    stiffness: 300,
    overshootClamping: false,
  } as SpringConfig,
  
  // Smooth, heavy feel
  smooth: {
    damping: 25,
    mass: 2,
    stiffness: 150,
    overshootClamping: false,
  } as SpringConfig,
  
  // No overshoot (clamped)
  clamped: {
    damping: 30,
    mass: 1,
    stiffness: 300,
    overshootClamping: true,
  } as SpringConfig,
  
  // Cinematic slow
  cinematic: {
    damping: 20,
    mass: 3,
    stiffness: 80,
    overshootClamping: false,
  } as SpringConfig,
};

// Calculate spring duration (approximate frames to settle)
export function estimateSpringDuration(
  config: SpringConfig,
  threshold: number = 0.01
): number {
  const { damping, mass, stiffness } = config;
  const dampingRatio = damping / (2 * Math.sqrt(mass * stiffness));
  
  if (dampingRatio >= 1) {
    // Overdamped/critically damped
    return Math.ceil(-Math.log(threshold) / (damping / (2 * mass)));
  }
  
  // Underdamped - estimate based on decay envelope
  const decayRate = damping / (2 * mass);
  return Math.ceil(-Math.log(threshold) / decayRate);
}
```

### 4.2 Advanced Interpolation

```typescript
// physics/interpolation.ts
import { interpolate, Easing, interpolateColors } from 'remotion';

// Bezier-based easing functions
export const easings = {
  // Expo family (cinematic feel)
  expo: {
    in: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
    out: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    inOut: (t: number) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
      return (2 - Math.pow(2, -20 * t + 10)) / 2;
    },
  },
  
  // Circ family (circular)
  circ: {
    in: (t: number) => 1 - Math.sqrt(1 - Math.pow(t, 2)),
    out: (t: number) => Math.sqrt(1 - Math.pow(t - 1, 2)),
    inOut: (t: number) => {
      if (t < 0.5) return (1 - Math.sqrt(1 - 4 * t * t)) / 2;
      return (Math.sqrt(1 - 4 * (t - 1) * (t - 1)) + 1) / 2;
    },
  },
  
  // Back family (anticipation)
  back: (overshoot: number = 1.70158) => ({
    in: (t: number) => t * t * ((overshoot + 1) * t - overshoot),
    out: (t: number) => 1 + (t - 1) * (t - 1) * ((overshoot + 1) * (t - 1) + overshoot),
    inOut: (t: number) => {
      const c = overshoot * 1.525;
      if (t < 0.5) return (t * t * ((c + 1) * 2 * t - c)) / 2;
      return (1 + (2 * t - 2) * (2 * t - 2) * ((c + 1) * (2 * t - 2) + c)) / 2;
    },
  }),
  
  // Elastic family (spring-like without physics)
  elastic: (amplitude: number = 1, period: number = 0.3) => ({
    in: (t: number) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      const s = period / 4;
      return -(amplitude * Math.pow(2, 10 * (t - 1)) * Math.sin(((t - 1 - s) * 2 * Math.PI) / period));
    },
    out: (t: number) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      const s = period / 4;
      return amplitude * Math.pow(2, -10 * t) * Math.sin(((t - s) * 2 * Math.PI) / period) + 1;
    },
  }),
};

// Multi-point interpolation
export function interpolateMulti(
  frame: number,
  keyframes: Array<{ frame: number; value: number; easing?: Easing }>
): number {
  if (keyframes.length < 2) return keyframes[0]?.value ?? 0;
  
  // Find current segment
  for (let i = 0; i < keyframes.length - 1; i++) {
    const current = keyframes[i];
    const next = keyframes[i + 1];
    
    if (frame >= current.frame && frame <= next.frame) {
      const progress = (frame - current.frame) / (next.frame - current.frame);
      const eased = current.easing ? current.easing(progress) : progress;
      return current.value + (next.value - current.value) * eased;
    }
  }
  
  // Before first or after last
  if (frame < keyframes[0].frame) return keyframes[0].value;
  return keyframes[keyframes.length - 1].value;
}

// Path interpolation for complex motion
export function interpolatePath(
  frame: number,
  startFrame: number,
  endFrame: number,
  points: Array<{ x: number; y: number }>,
  tension: number = 0.5
): { x: number; y: number } {
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const segmentCount = points.length - 1;
  const segmentProgress = progress * segmentCount;
  const segmentIndex = Math.floor(segmentProgress);
  const localProgress = segmentProgress - segmentIndex;
  
  if (segmentIndex >= segmentCount) {
    return points[points.length - 1];
  }
  
  const p0 = points[Math.max(0, segmentIndex - 1)];
  const p1 = points[segmentIndex];
  const p2 = points[Math.min(points.length - 1, segmentIndex + 1)];
  const p3 = points[Math.min(points.length - 1, segmentIndex + 2)];
  
  // Catmull-Rom spline
  const t = localProgress;
  const t2 = t * t;
  const t3 = t2 * t;
  
  const x = 0.5 * (
    (2 * p1.x) +
    (-p0.x + p2.x) * t +
    (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
    (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
  );
  
  const y = 0.5 * (
    (2 * p1.y) +
    (-p0.y + p2.y) * t +
    (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
    (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
  );
  
  return { x, y };
}
```

---

## 5. Composition Layering

### 5.1 Layer Architecture

```tsx
// composition/Layer.tsx
import { zIndex } from '../tokens/motion';

interface LayerProps {
  children: React.ReactNode;
  z?: keyof typeof zIndex | number;
  blendMode?: React.CSSProperties['mixBlendMode'];
  style?: React.CSSProperties;
}

export function Layer({ 
  children, 
  z = 'base', 
  blendMode,
  style 
}: LayerProps) {
  const zValue = typeof z === 'number' ? z : zIndex[z];
  
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: zValue,
      mixBlendMode: blendMode,
      ...style,
    }}>
      {children}
    </div>
  );
}

// composition/BackgroundLayer.tsx
interface BackgroundLayerProps {
  gradient?: string;
  color?: string;
  animated?: boolean;
  noise?: boolean;
  noiseOpacity?: number;
}

export function BackgroundLayer({
  gradient,
  color = '#09090b',
  animated = false,
  noise = false,
  noiseOpacity = 0.03,
}: BackgroundLayerProps) {
  const frame = useCurrentFrame();
  
  const animatedGradient = animated 
    ? `linear-gradient(${135 + frame * 0.1}deg, #09090b 0%, #141414 50%, #0a0a0a 100%)`
    : gradient;
  
  return (
    <Layer z="background">
      <div style={{
        position: 'absolute',
        inset: 0,
        background: animatedGradient || color,
      }}>
        {noise && (
          <svg style={{
            position: 'absolute',
            inset: 0,
            opacity: noiseOpacity,
            mixBlendMode: 'overlay',
          }}>
            <filter id="noise">
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.8" 
                numOctaves="4" 
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        )}
      </div>
    </Layer>
  );
}

// composition/ContentLayer.tsx
interface ContentLayerProps {
  children: React.ReactNode;
  center?: boolean;
  padding?: number | string;
  maxWidth?: number | string;
}

export function ContentLayer({
  children,
  center = true,
  padding = 60,
  maxWidth = 1200,
}: ContentLayerProps) {
  return (
    <Layer z="content">
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: center ? 'center' : 'flex-start',
        alignItems: center ? 'center' : 'flex-start',
        padding,
        maxWidth,
        margin: '0 auto',
      }}>
        {children}
      </div>
    </Layer>
  );
}

// composition/GlowLayer.tsx
interface GlowLayerProps {
  color?: string;
  intensity?: number;
  position?: { x: string; y: string };
  size?: string;
}

export function GlowLayer({
  color = 'rgba(129, 140, 248, 0.3)',
  intensity = 0.5,
  position = { x: '50%', y: '50%' },
  size = '600px',
}: GlowLayerProps) {
  const frame = useCurrentFrame();
  
  // Subtle breathing animation
  const breathe = 1 + Math.sin(frame * 0.05) * 0.1;
  
  return (
    <Layer z="background" style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: intensity * breathe,
        filter: 'blur(60px)',
      }} />
    </Layer>
  );
}

// composition/GridLayer.tsx
interface GridLayerProps {
  color?: string;
  size?: number;
  animated?: boolean;
}

export function GridLayer({
  color = 'rgba(255, 255, 255, 0.03)',
  size = 60,
  animated = true,
}: GridLayerProps) {
  const frame = useCurrentFrame();
  
  const offset = animated ? frame * 0.5 : 0;
  
  return (
    <Layer z="background" style={{ pointerEvents: 'none' }}>
      <svg width="100%" height="100%" style={{ position: 'absolute' }}>
        <defs>
          <pattern 
            id="grid" 
            width={size} 
            height={size} 
            patternUnits="userSpaceOnUse"
          >
            <path 
              d={`M ${size} 0 L 0 0 0 ${size}`} 
              fill="none" 
              stroke={color}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect 
          width="100%" 
          height="100%" 
          fill="url(#grid)"
          style={{
            transform: `translate(${offset % size}px, ${offset % size}px)`,
          }}
        />
      </svg>
    </Layer>
  );
}
```

---

## 6. Scene Orchestration

### 6.1 Scene Management

```tsx
// scenes/Scene.tsx
import { Sequence, useVideoConfig } from 'remotion';

interface SceneProps {
  children: React.ReactNode;
  name: string;
  durationInFrames: number;
  from?: number;
  layout?: 'fill' | 'absolute-fill';
  transition?: {
    type: 'fade' | 'slide' | 'scale' | 'wipe';
    duration: number;
    direction?: 'left' | 'right' | 'up' | 'down';
  };
}

export function Scene({
  children,
  name,
  durationInFrames,
  from = 0,
  layout = 'fill',
  transition,
}: SceneProps) {
  return (
    <Sequence
      from={from}
      durationInFrames={durationInFrames}
      name={name}
      layout={layout}
    >
      {transition && (
        <SceneTransition type={transition.type} duration={transition.duration}>
          {children}
        </SceneTransition>
      )}
      {!transition && children}
    </Sequence>
  );
}

// scenes/SceneComposer.tsx
interface SceneComposerProps {
  scenes: Array<{
    id: string;
    component: React.ComponentType<any>;
    duration: number;
    props?: Record<string, any>;
    transition?: SceneProps['transition'];
  }>;
}

export function SceneComposer({ scenes }: SceneComposerProps) {
  let currentFrame = 0;
  
  return (
    <>
      {scenes.map((scene) => {
        const from = currentFrame;
        currentFrame += scene.duration;
        
        const SceneComponent = scene.component;
        
        return (
          <Scene
            key={scene.id}
            name={scene.id}
            from={from}
            durationInFrames={scene.duration}
            transition={scene.transition}
          >
            <SceneComponent {...scene.props} />
          </Scene>
        );
      })}
    </>
  );
}

// scenes/useScene.ts
import { useCurrentFrame, useVideoConfig } from 'remotion';

interface SceneState {
  progress: number;       // 0-1 within scene
  frame: number;          // Current frame within scene
  isStart: boolean;       // First 10% of scene
  isEnd: boolean;         // Last 10% of scene
  isMiddle: boolean;      // Middle 80% of scene
}

export function useScene(durationInFrames: number): SceneState {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = Math.min(frame / durationInFrames, 1);
  const isStart = progress < 0.1;
  const isEnd = progress > 0.9;
  const isMiddle = !isStart && !isEnd;
  
  return {
    progress,
    frame,
    isStart,
    isEnd,
    isMiddle,
  };
}
```

### 6.2 Timeline Utilities

```typescript
// scenes/timeline.ts
import { Sequence } from 'remotion';

// Beat-based timing for music-synced animations
export function beatsToFrames(bpm: number, beats: number, fps: number): number {
  const secondsPerBeat = 60 / bpm;
  const totalSeconds = beats * secondsPerBeat;
  return Math.round(totalSeconds * fps);
}

// Time signature-based grouping
export function createMeasures(
  bpm: number,
  fps: number,
  measures: number,
  beatsPerMeasure: number = 4
): number {
  return beatsToFrames(bpm, measures * beatsPerMeasure, fps);
}

// Dynamic tempo changes
export function interpolateTempo(
  frame: number,
  startFrame: number,
  endFrame: number,
  startBpm: number,
  endBpm: number
): number {
  const progress = (frame - startFrame) / (endFrame - startFrame);
  return startBpm + (endBpm - startBpm) * progress;
}

// Timeline marker system
export interface TimelineMarker {
  frame: number;
  label: string;
  type: 'beat' | 'bar' | 'phrase' | 'cue';
}

export function generateBeatMarkers(
  bpm: number,
  fps: number,
  totalFrames: number
): TimelineMarker[] {
  const markers: TimelineMarker[] = [];
  const framesPerBeat = beatsToFrames(bpm, 1, fps);
  
  for (let frame = 0; frame < totalFrames; frame += framesPerBeat) {
    const beatNumber = frame / framesPerBeat;
    
    markers.push({
      frame,
      label: `Beat ${Math.floor(beatNumber) + 1}`,
      type: 'beat',
    });
    
    // Add bar markers every 4 beats
    if (beatNumber % 4 === 0) {
      markers.push({
        frame,
        label: `Bar ${Math.floor(beatNumber / 4) + 1}`,
        type: 'bar',
      });
    }
    
    // Add phrase markers every 16 beats
    if (beatNumber % 16 === 0) {
      markers.push({
        frame,
        label: `Phrase ${Math.floor(beatNumber / 16) + 1}`,
        type: 'phrase',
      });
    }
  }
  
  return markers;
}
```

---

## 7. Real-World Motion Patterns

### 7.1 SaaS Marketing Video Patterns

```tsx
// patterns/hero-reveal.tsx
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { springs } from '../physics/springs';

interface HeroRevealProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  theme: 'light' | 'dark';
}

export function HeroReveal({ headline, subheadline, ctaText, theme }: HeroRevealProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Staggered entrance timing
  const headlineStart = 15;
  const subheadlineStart = 45;
  const ctaStart = 75;
  
  // Spring animations
  const headlineY = spring({
    frame: frame - headlineStart,
    fps,
    config: springs.cinematic,
    from: 100,
    to: 0,
  });
  
  const headlineOpacity = interpolate(frame, [headlineStart, headlineStart + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const subheadlineY = spring({
    frame: frame - subheadlineStart,
    fps,
    config: springs.gentle,
    from: 50,
    to: 0,
  });
  
  const subheadlineOpacity = interpolate(frame, [subheadlineStart, subheadlineStart + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const ctaScale = spring({
    frame: frame - ctaStart,
    fps,
    config: springs.bouncy,
    from: 0.8,
    to: 1,
  });
  
  const ctaOpacity = interpolate(frame, [ctaStart, ctaStart + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const isDark = theme === 'dark';
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Headline */}
      <h1 style={{
        fontSize: 96,
        fontWeight: 800,
        letterSpacing: '-0.04em',
        color: isDark ? '#fafafa' : '#0a0a0a',
        transform: `translateY(${headlineY}px)`,
        opacity: headlineOpacity,
        margin: 0,
        textAlign: 'center',
      }}>
        {headline}
      </h1>
      
      {/* Subheadline */}
      <p style={{
        fontSize: 32,
        fontWeight: 400,
        color: isDark ? '#a1a1aa' : '#525252',
        transform: `translateY(${subheadlineY}px)`,
        opacity: subheadlineOpacity,
        marginTop: 24,
        maxWidth: 700,
        textAlign: 'center',
        lineHeight: 1.5,
      }}>
        {subheadline}
      </p>
      
      {/* CTA Button */}
      <div style={{
        marginTop: 48,
        transform: `scale(${ctaScale})`,
        opacity: ctaOpacity,
      }}>
        <button style={{
          padding: '20px 40px',
          fontSize: 20,
          fontWeight: 600,
          color: '#ffffff',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none',
          borderRadius: 12,
          cursor: 'pointer',
          boxShadow: isDark 
            ? '0 0 40px rgba(99, 102, 241, 0.4)' 
            : '0 4px 14px rgba(99, 102, 241, 0.3)',
        }}>
          {ctaText}
        </button>
      </div>
    </div>
  );
}

// patterns/feature-showcase.tsx
interface FeatureShowcaseProps {
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  theme: 'light' | 'dark';
}

export function FeatureShowcase({ features, theme }: FeatureShowcaseProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const isDark = theme === 'dark';
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 32,
      padding: 80,
      height: '100%',
      alignItems: 'center',
    }}>
      {features.map((feature, index) => {
        const startFrame = index * 15;
        const progress = spring({
          frame: frame - startFrame,
          fps,
          config: springs.standard,
          from: 0,
          to: 1,
        });
        
        const y = (1 - progress) * 60;
        const opacity = progress;
        const scale = 0.9 + progress * 0.1;
        
        return (
          <div
            key={index}
            style={{
              padding: 40,
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              borderRadius: 24,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              transform: `translateY(${y}px) scale(${scale})`,
              opacity,
            }}
          >
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              marginBottom: 24,
            }}>
              {feature.icon}
            </div>
            <h3 style={{
              fontSize: 24,
              fontWeight: 700,
              color: isDark ? '#fafafa' : '#0a0a0a',
              marginBottom: 12,
            }}>
              {feature.title}
            </h3>
            <p style={{
              fontSize: 16,
              color: isDark ? '#a1a1aa' : '#525252',
              lineHeight: 1.6,
            }}>
              {feature.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// patterns/pricing-reveal.tsx
interface PricingRevealProps {
  plans: Array<{
    name: string;
    price: string;
    period: string;
    features: string[];
    highlighted?: boolean;
  }>;
  theme: 'light' | 'dark';
}

export function PricingReveal({ plans, theme }: PricingRevealProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme === 'dark';
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 24,
      height: '100%',
      padding: 60,
    }}>
      {plans.map((plan, index) => {
        const startFrame = index * 12;
        const isHighlighted = plan.highlighted;
        
        const progress = spring({
          frame: frame - startFrame,
          fps,
          config: springs.cinematic,
          from: 0,
          to: 1,
        });
        
        const y = (1 - progress) * 100;
        const opacity = progress;
        const scale = 0.95 + progress * 0.05;
        
        return (
          <div
            key={index}
            style={{
              width: 340,
              padding: 40,
              background: isHighlighted 
                ? (isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)')
                : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'),
              borderRadius: 24,
              border: `2px solid ${isHighlighted 
                ? '#6366f1' 
                : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)')}`,
              transform: `translateY(${y}px) scale(${scale})`,
              opacity,
              position: 'relative',
            }}
          >
            {isHighlighted && (
              <div style={{
                position: 'absolute',
                top: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '6px 16px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                color: '#ffffff',
              }}>
                Most Popular
              </div>
            )}
            
            <p style={{
              fontSize: 14,
              fontWeight: 600,
              color: isDark ? '#a1a1aa' : '#525252',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 16,
            }}>
              {plan.name}
            </p>
            
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{
                fontSize: 56,
                fontWeight: 800,
                color: isDark ? '#fafafa' : '#0a0a0a',
              }}>
                {plan.price}
              </span>
              <span style={{
                fontSize: 16,
                color: isDark ? '#71717a' : '#737373',
                marginLeft: 4,
              }}>
                {plan.period}
              </span>
            </div>
            
            <div style={{
              height: 1,
              background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              margin: '24px 0',
            }} />
            
            {plan.features.map((feature, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <span style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#22c55e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                }}>
                  ✓
                </span>
                <span style={{
                  fontSize: 15,
                  color: isDark ? '#d4d4d8' : '#3f3f46',
                }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
```

### 7.2 Product Demo Patterns

```tsx
// patterns/ui-mockup.tsx
interface UIMockupProps {
  interface: 'dashboard' | 'terminal' | 'code-editor' | 'api-playground';
  theme: 'light' | 'dark';
  actions: Array<{
    type: 'click' | 'type' | 'hover' | 'scroll';
    target: string;
    value?: string;
    at: number;
  }>;
}

export function UIMockup({ interface: type, theme, actions }: UIMockupProps) {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';
  
  const renderTerminal = () => (
    <div style={{
      width: 800,
      background: isDark ? '#0c0c0c' : '#fafafa',
      borderRadius: 12,
      overflow: 'hidden',
      border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
      boxShadow: isDark 
        ? '0 25px 50px -12px rgba(0,0,0,0.8)' 
        : '0 25px 50px -12px rgba(0,0,0,0.15)',
    }}>
      {/* Terminal header */}
      <div style={{
        padding: '12px 16px',
        background: isDark ? '#18181b' : '#f4f4f5',
        borderBottom: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
        </div>
        <span style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          fontSize: 13,
          color: isDark ? '#71717a' : '#71717a',
          fontFamily: 'monospace',
        }}>
          user@aether-db:~ — zsh
        </span>
      </div>
      
      {/* Terminal content */}
      <div style={{
        padding: 24,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 14,
        lineHeight: 1.6,
        minHeight: 400,
      }}>
        <TypewriterText
          text="npx aether-db init"
          startFrame={30}
          speed={2}
          prefix="$ "
          prefixColor={isDark ? '#22c55e' : '#15803d'}
          textColor={isDark ? '#e4e4e7' : '#27272a'}
        />
        <Fade start={90} duration={20}>
          <div style={{ marginTop: 16, color: isDark ? '#a1a1aa' : '#525252' }}>
            ✓ Initialized Aether DB project
            <br />
            ✓ Connected to PostgreSQL
            <br />
            ✓ Generated TypeScript types
            <br />
            ✓ Schema validation enabled
          </div>
        </Fade>
      </div>
    </div>
  );
  
  const renderDashboard = () => (
    <div style={{
      width: 1000,
      height: 600,
      background: isDark ? '#09090b' : '#ffffff',
      borderRadius: 16,
      overflow: 'hidden',
      display: 'flex',
      border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
    }}>
      {/* Sidebar */}
      <div style={{
        width: 240,
        background: isDark ? '#0a0a0a' : '#fafafa',
        borderRight: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
        padding: 24,
      }}>
        <div style={{
          fontSize: 20,
          fontWeight: 700,
          color: isDark ? '#fafafa' : '#0a0a0a',
          marginBottom: 32,
        }}>
          Dashboard
        </div>
        {['Overview', 'Analytics', 'Users', 'Settings'].map((item, i) => (
          <Slide key={item} start={i * 5} duration={15} direction="left">
            <div style={{
              padding: '12px 16px',
              borderRadius: 8,
              marginBottom: 8,
              background: i === 0 ? (isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)') : 'transparent',
              color: i === 0 ? '#6366f1' : (isDark ? '#a1a1aa' : '#525252'),
              fontSize: 14,
              fontWeight: 500,
            }}>
              {item}
            </div>
          </Slide>
        ))}
      </div>
      
      {/* Main content */}
      <div style={{ flex: 1, padding: 32 }}>
        <Stagger staggerDelay={5} start={20}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            marginBottom: 32,
          }}>
            {[
              { label: 'Total Users', value: '24.5K', change: '+12%' },
              { label: 'Revenue', value: '$84.2K', change: '+8%' },
              { label: 'Active Now', value: '1,234', change: '+23%' },
            ].map((stat) => (
              <div key={stat.label} style={{
                padding: 24,
                background: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
                borderRadius: 12,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e4e4e7'}`,
              }}>
                <p style={{
                  fontSize: 14,
                  color: isDark ? '#71717a' : '#71717a',
                  marginBottom: 8,
                }}>
                  {stat.label}
                </p>
                <p style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: isDark ? '#fafafa' : '#0a0a0a',
                }}>
                  {stat.value}
                </p>
                <span style={{
                  fontSize: 13,
                  color: '#22c55e',
                  fontWeight: 600,
                }}>
                  {stat.change}
                </span>
              </div>
            ))}
          </div>
        </Stagger>
        
        {/* Chart placeholder */}
        <Scale start={60} duration={30}>
          <div style={{
            height: 280,
            background: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
            borderRadius: 12,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e4e4e7'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDark ? '#52525b' : '#a1a1aa',
          }}>
            Analytics Chart
          </div>
        </Scale>
      </div>
    </div>
  );
  
  return type === 'terminal' ? renderTerminal() : renderDashboard();
}

// patterns/cursor-simulation.tsx
interface CursorSimulationProps {
  actions: Array<{
    type: 'move' | 'click' | 'drag';
    from?: { x: number; y: number };
    to: { x: number; y: number };
    startFrame: number;
    duration: number;
  }>;
}

export function CursorSimulation({ actions }: CursorSimulationProps) {
  const frame = useCurrentFrame();
  
  // Find current action
  const currentAction = actions.find(
    (action) => frame >= action.startFrame && frame < action.startFrame + action.duration
  );
  
  if (!currentAction) {
    // Return cursor at last position
    const lastAction = actions[actions.length - 1];
    return (
      <Cursor x={lastAction.to.x} y={lastAction.to.y} />
    );
  }
  
  const progress = (frame - currentAction.startFrame) / currentAction.duration;
  
  const x = interpolate(
    progress,
    [0, 1],
    [currentAction.from?.x ?? currentAction.to.x, currentAction.to.x],
    { easing: motionTokens.ease.expoOut }
  );
  
  const y = interpolate(
    progress,
    [0, 1],
    [currentAction.from?.y ?? currentAction.to.y, currentAction.to.y],
    { easing: motionTokens.ease.expoOut }
  );
  
  return <Cursor x={x} y={y} clicking={currentAction.type === 'click' && progress > 0.5} />;
}

function Cursor({ x, y, clicking = false }: { x: number; y: number; clicking?: boolean }) {
  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 24,
      height: 24,
      transform: `translate(-50%, -50%) scale(${clicking ? 0.9 : 1})`,
      transition: 'transform 0.1s',
      pointerEvents: 'none',
      zIndex: 9999,
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.87c.44 0 .66-.53.35-.85L6.35 2.85a.5.5 0 00-.85.35z"
          fill="white"
          stroke="black"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
```

### 7.3 Developer Tool Patterns

```tsx
// patterns/code-highlight.tsx
interface CodeHighlightProps {
  code: string;
  language: string;
  highlights: Array<{
    lines: [number, number];
    startFrame: number;
    duration: number;
  }>;
  theme: 'light' | 'dark';
}

export function CodeHighlight({ code, language, highlights, theme }: CodeHighlightProps) {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';
  const lines = code.split('\n');
  
  // Determine which lines are highlighted at current frame
  const activeHighlights = highlights.filter(
    (h) => frame >= h.startFrame && frame < h.startFrame + h.duration
  );
  
  const isLineHighlighted = (lineIndex: number) => {
    return activeHighlights.some(
      (h) => lineIndex >= h.lines[0] && lineIndex <= h.lines[1]
    );
  };
  
  const getLineOpacity = (lineIndex: number) => {
    const highlight = activeHighlights.find(
      (h) => lineIndex >= h.lines[0] && lineIndex <= h.lines[1]
    );
    
    if (!highlight) return isDark ? 0.4 : 0.5;
    
    const progress = (frame - highlight.startFrame) / highlight.duration;
    return 1 - progress * 0.3;
  };
  
  return (
    <div style={{
      background: isDark ? '#0c0c0c' : '#fafafa',
      borderRadius: 12,
      overflow: 'hidden',
      border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 14,
      lineHeight: 1.7,
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        background: isDark ? '#18181b' : '#f4f4f5',
        borderBottom: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
        </div>
        <span style={{
          fontSize: 12,
          color: isDark ? '#71717a' : '#71717a',
          textTransform: 'lowercase',
        }}>
          {language}
        </span>
      </div>
      
      {/* Code content */}
      <div style={{ padding: '20px 0' }}>
        {lines.map((line, index) => {
          const highlighted = isLineHighlighted(index);
          const opacity = getLineOpacity(index);
          
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                padding: '0 20px',
                background: highlighted 
                  ? (isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.08)')
                  : 'transparent',
                borderLeft: highlighted ? '3px solid #6366f1' : '3px solid transparent',
                opacity,
              }}
            >
              <span style={{
                width: 40,
                color: isDark ? '#52525b' : '#a1a1aa',
                userSelect: 'none',
                textAlign: 'right',
                marginRight: 20,
              }}>
                {index + 1}
              </span>
              <span style={{
                color: isDark ? '#e4e4e7' : '#27272a',
                whiteSpace: 'pre',
              }}>
                {line || ' '}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// patterns/api-flow.tsx
interface APIFlowProps {
  steps: Array<{
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    endpoint: string;
    description: string;
    request?: object;
    response?: object;
  }>;
  theme: 'light' | 'dark';
}

export function APIFlow({ steps, theme }: APIFlowProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme === 'dark';
  
  const methodColors: Record<string, string> = {
    GET: '#22c55e',
    POST: '#3b82f6',
    PUT: '#f59e0b',
    DELETE: '#ef4444',
  };
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      padding: 40,
    }}>
      {steps.map((step, index) => {
        const startFrame = index * 60;
        const progress = spring({
          frame: frame - startFrame,
          fps,
          config: springs.standard,
          from: 0,
          to: 1,
        });
        
        const x = (1 - progress) * 50;
        const opacity = progress;
        
        return (
          <div
            key={index}
            style={{
              transform: `translateX(${x}px)`,
              opacity,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 20,
            }}
          >
            {/* Step number */}
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: methodColors[step.method],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 14,
              fontWeight: 700,
              flexShrink: 0,
            }}>
              {index + 1}
            </div>
            
            {/* Content */}
            <div style={{
              flex: 1,
              padding: 24,
              background: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
              borderRadius: 12,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e4e4e7'}`,
            }}>
              {/* Method & endpoint */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: `${methodColors[step.method]}20`,
                  color: methodColors[step.method],
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'monospace',
                }}>
                  {step.method}
                </span>
                <code style={{
                  fontSize: 14,
                  color: isDark ? '#fafafa' : '#0a0a0a',
                  fontFamily: 'monospace',
                }}>
                  {step.endpoint}
                </code>
              </div>
              
              {/* Description */}
              <p style={{
                fontSize: 14,
                color: isDark ? '#a1a1aa' : '#525252',
                marginBottom: step.request || step.response ? 16 : 0,
              }}>
                {step.description}
              </p>
              
              {/* Request/Response */}
              {(step.request || step.response) && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: step.request && step.response ? '1fr 1fr' : '1fr',
                  gap: 16,
                  marginTop: 16,
                }}>
                  {step.request && (
                    <div>
                      <p style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: isDark ? '#71717a' : '#71717a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: 8,
                      }}>
                        Request
                      </p>
                      <pre style={{
                        padding: 12,
                        background: isDark ? '#0c0c0c' : '#ffffff',
                        borderRadius: 8,
                        fontSize: 12,
                        color: isDark ? '#e4e4e7' : '#27272a',
                        overflow: 'auto',
                        margin: 0,
                      }}>
                        {JSON.stringify(step.request, null, 2)}
                      </pre>
                    </div>
                  )}
                  {step.response && (
                    <div>
                      <p style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: isDark ? '#71717a' : '#71717a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: 8,
                      }}>
                        Response
                      </p>
                      <pre style={{
                        padding: 12,
                        background: isDark ? '#0c0c0c' : '#ffffff',
                        borderRadius: 8,
                        fontSize: 12,
                        color: isDark ? '#e4e4e7' : '#27272a',
                        overflow: 'auto',
                        margin: 0,
                      }}>
                        {JSON.stringify(step.response, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

---

## 8. Performance Optimization

### 8.1 Memoization Strategies

```tsx
// performance/memoization.tsx
import { useMemo, memo, useCallback } from 'react';
import { useCurrentFrame } from 'remotion';

// Memoized animation component
export const MemoizedAnimatedText = memo(function AnimatedText({
  text,
  startFrame,
  theme,
}: {
  text: string;
  startFrame: number;
  theme: 'light' | 'dark';
}) {
  const frame = useCurrentFrame();
  
  // Only re-render when frame changes significantly
  const progress = useMemo(() => {
    return Math.min(Math.max((frame - startFrame) / 30, 0), 1);
  }, [frame, startFrame]);
  
  return (
    <span style={{
      opacity: progress,
      transform: `translateY(${(1 - progress) * 20}px)`,
      color: theme === 'dark' ? '#fafafa' : '#0a0a0a',
    }}>
      {text}
    </span>
  );
}, (prev, next) => {
  // Custom comparison for performance
  return prev.text === next.text && prev.theme === next.theme;
});

// useMemo for expensive calculations
export function useAnimatedValue(
  startFrame: number,
  duration: number,
  from: number,
  to: number
): number {
  const frame = useCurrentFrame();
  
  return useMemo(() => {
    if (frame < startFrame) return from;
    if (frame > startFrame + duration) return to;
    
    const progress = (frame - startFrame) / duration;
    return from + (to - from) * progress;
  }, [frame, startFrame, duration, from, to]);
}

// useCallback for event handlers
export function useAnimationTrigger(callback: () => void, triggerFrame: number) {
  const frame = useCurrentFrame();
  const hasTriggered = useRef(false);
  
  const memoizedCallback = useCallback(callback, [callback]);
  
  useEffect(() => {
    if (frame >= triggerFrame && !hasTriggered.current) {
      hasTriggered.current = true;
      memoizedCallback();
    }
  }, [frame, triggerFrame, memoizedCallback]);
}
```

### 8.2 Render Splitting

```tsx
// performance/render-splitting.tsx
import { Sequence, OffthreadVideo, Img } from 'remotion';

// Split heavy renders across frames
export function SplitRender({
  children,
  splitCount = 4,
}: {
  children: React.ReactNode[];
  splitCount?: number;
}) {
  const childrenArray = Children.toArray(children);
  const chunkSize = Math.ceil(childrenArray.length / splitCount);
  
  return (
    <>
      {Array.from({ length: splitCount }).map((_, chunkIndex) => {
        const chunk = childrenArray.slice(
          chunkIndex * chunkSize,
          (chunkIndex + 1) * chunkSize
        );
        
        return (
          <Sequence
            key={chunkIndex}
            from={chunkIndex * 2} // 2 frame offset per chunk
            durationInFrames={Infinity}
          >
            {chunk}
          </Sequence>
        );
      })}
    </>
  );
}

// Offthread rendering for images
export function OptimizedImage({
  src,
  style,
}: {
  src: string;
  style?: React.CSSProperties;
}) {
  return <Img src={src} style={style} />;
}

// Lazy load heavy components
export function LazyComponent({
  component: Component,
  loadAtFrame,
  ...props
}: {
  component: React.ComponentType<any>;
  loadAtFrame: number;
}) {
  const frame = useCurrentFrame();
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    if (frame >= loadAtFrame) {
      setLoaded(true);
    }
  }, [frame, loadAtFrame]);
  
  if (!loaded) return null;
  
  return <Component {...props} />;
}
```

### 8.3 Asset Preloading

```typescript
// performance/preload.ts
import { prefetch, staticFile } from 'remotion';

// Preload strategy for assets
export class AssetPreloader {
  private cache: Map<string, Promise<void>> = new Map();
  
  preloadImage(src: string): Promise<void> {
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }
    
    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
    
    this.cache.set(src, promise);
    return promise;
  }
  
  preloadFont(family: string, url: string): Promise<void> {
    const key = `font:${family}`;
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }
    
    const promise = new FontFace(family, `url(${url})`).load().then((face) => {
      document.fonts.add(face);
    });
    
    this.cache.set(key, promise);
    return promise;
  }
  
  preloadVideo(src: string): void {
    // Use Remotion's prefetch for videos
    prefetch(src);
  }
}

// Component-level preloading
export function useAssetPreloader(assets: Array<{ type: 'image' | 'font' | 'video'; src: string }>) {
  const [loaded, setLoaded] = useState(false);
  const preloader = useMemo(() => new AssetPreloader(), []);
  
  useEffect(() => {
    const loadAll = async () => {
      await Promise.all(
        assets.map((asset) => {
          switch (asset.type) {
            case 'image':
              return preloader.preloadImage(asset.src);
            case 'font':
              return preloader.preloadFont(asset.src, asset.src);
            case 'video':
              preloader.preloadVideo(asset.src);
              return Promise.resolve();
          }
        })
      );
      setLoaded(true);
    };
    
    loadAll();
  }, [assets, preloader]);
  
  return loaded;
}
```

### 8.4 Cloud Rendering Strategies

```typescript
// performance/cloud-render.ts
import { getRenderProgress, renderMediaOnLambda } from '@remotion/lambda';

// Lambda configuration for optimal cloud rendering
export const lambdaConfig = {
  // Memory allocation based on complexity
  memorySizes: {
    simple: 2048,      // Basic animations
    standard: 4096,    // Most use cases
    complex: 8192,     // 4K, heavy effects
    extreme: 10240,    // 8K, particle systems
  },
  
  // Timeout configurations
  timeouts: {
    short: 120,        // 2 minutes
    medium: 300,       // 5 minutes
    long: 600,         // 10 minutes
    extended: 900,     // 15 minutes
  },
  
  // Frame range chunking for parallelization
  chunkOptimization(complexity: 'low' | 'medium' | 'high'): number {
    switch (complexity) {
      case 'low':
        return 90;      // 1.5s @ 60fps
      case 'medium':
        return 60;      // 1s @ 60fps
      case 'high':
        return 30;      // 0.5s @ 60fps
    }
  },
  
  // Render quality presets
  qualityPresets: {
    draft: { crf: 35, pixelFormat: 'yuv420p' },
    preview: { crf: 28, pixelFormat: 'yuv420p' },
    production: { crf: 18, pixelFormat: 'yuv444p' },
    max: { crf: 10, pixelFormat: 'yuv444p10le' },
  },
};

// Render orchestration
export async function orchestrateRender({
  composition,
  quality = 'production',
  complexity = 'medium',
}: {
  composition: string;
  quality?: keyof typeof lambdaConfig.qualityPresets;
  complexity?: 'low' | 'medium' | 'high';
}) {
  const { renderId, bucketName } = await renderMediaOnLambda({
    composition,
    serveUrl: process.env.REMOTION_SERVE_URL!,
    codec: 'h264',
    imageFormat: 'jpeg',
    crf: lambdaConfig.qualityPresets[quality].crf,
    pixelFormat: lambdaConfig.qualityPresets[quality].pixelFormat,
    framesPerLambda: lambdaConfig.chunkOptimization(complexity),
    memorySizeInMb: lambdaConfig.memorySizes[complexity === 'high' ? 'complex' : 'standard'],
    timeoutInMilliseconds: lambdaConfig.timeouts.medium * 1000,
  });
  
  // Poll for completion
  while (true) {
    const progress = await getRenderProgress({
      renderId,
      bucketName,
      functionName: process.env.REMOTION_FUNCTION_NAME!,
      region: 'us-east-1',
    });
    
    if (progress.done) {
      return progress.outputFile;
    }
    
    if (progress.fatalErrorEncountered) {
      throw new Error(progress.errors[0].message);
    }
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
```

---

## 9. Anti-Patterns & Debugging

### 9.1 Common Anti-Patterns

```markdown
## Anti-Pattern Catalog

### 1. Low Contrast in Dark Mode
**Problem**: Text or UI elements become unreadable in dark themes due to insufficient luminance contrast.

**Symptoms**:
- Gray text (#71717a) on dark backgrounds (#18181b)
- Muted elements disappearing in dark mode
- Accessibility score below WCAG AA (4.5:1 ratio)

**Solution**:
```typescript
// ❌ Bad
const textColor = isDark ? '#52525b' : '#27272a';

// ✅ Good
const textColor = isDark ? '#a1a1aa' : '#525252'; // Lighter in dark mode

// ✅ Better - Use semantic tokens
const textColor = theme.foreground.secondary;
```

### 2. Over-Glow in Light Mode
**Problem**: Glow effects that look elegant in dark mode become washed out or harsh in light mode.

**Symptoms**:
- Glow appearing as a solid color blob
- Loss of subtlety and depth
- Visual fatigue

**Solution**:
```typescript
// ❌ Bad
const glow = '0 0 40px rgba(99, 102, 241, 0.5)';

// ✅ Good - Adaptive intensity
const glow = isDark 
  ? '0 0 40px rgba(99, 102, 241, 0.4)'
  : '0 0 20px rgba(99, 102, 241, 0.15)';
```

### 3. Harsh White Flashes
**Problem**: Abrupt transitions between scenes cause white/light flashes that strain viewers.

**Symptoms**:
- Sudden brightness changes
- Viewer discomfort
- Unprofessional appearance

**Solution**:
```typescript
// ❌ Bad - Direct cut
<Sequence from={0} durationInFrames={60}>
  <DarkScene />
</Sequence>
<Sequence from={60} durationInFrames={60}>
  <LightScene />
</Sequence>

// ✅ Good - Crossfade with easing
<SceneTransition type="crossfade" duration={30} easing={ease.expoInOut}>
  <DarkScene />
  <LightScene />
</SceneTransition>
```

### 4. Frame Drift
**Problem**: Animations don't align to frame boundaries, causing jitter or inconsistent timing.

**Symptoms**:
- Subtle stuttering
- Misaligned audio sync
- Inconsistent motion across renders

**Solution**:
```typescript
// ❌ Bad - Floating point frame calculations
const progress = (Date.now() - startTime) / 1000 * fps;

// ✅ Good - Integer frame-based calculations
const frame = useCurrentFrame();
const progress = frame / durationInFrames;
```

### 5. Layout Thrashing
**Problem**: Repeated read/write operations to DOM cause forced synchronous layout.

**Symptoms**:
- Poor performance in complex scenes
- Dropped frames
- Jank during animations

**Solution**:
```typescript
// ❌ Bad - Multiple layout reads
const height1 = element1.offsetHeight;
element2.style.height = height1 + 'px';
const height2 = element2.offsetHeight;
element3.style.height = height2 + 'px';

// ✅ Good - Batch reads and writes
const [height1, width1] = [element1.offsetHeight, element1.offsetWidth];
requestAnimationFrame(() => {
  element2.style.height = height1 + 'px';
  element2.style.width = width1 + 'px';
});
```

### 6. Excessive Spring Bounce
**Problem**: Spring animations with low damping cause distracting oscillation.

**Symptoms**:
- Elements "jiggle" too long
- Unprofessional, playful feel in serious contexts
- Motion sickness in sensitive viewers

**Solution**:
```typescript
// ❌ Bad - Too bouncy for UI
const config = { mass: 1, stiffness: 300, damping: 8 };

// ✅ Good - Controlled elegance
const config = { mass: 1, stiffness: 200, damping: 20 };

// ✅ Use presets
const config = springs.standard;
```

### 7. Missing Will-Change
**Problem**: Complex animations without hardware acceleration hints cause jank.

**Solution**:
```typescript
// ✅ Always add for animated elements
<div style={{
  willChange: 'transform, opacity',
  transform: `translateX(${x}px)`,
  opacity,
}} />

// ✅ Clean up after animation
useEffect(() => {
  return () => {
    // Remove will-change to free GPU memory
    element.style.willChange = 'auto';
  };
}, []);
```
```

### 9.2 Debugging Strategies

```tsx
// debugging/debug-overlay.tsx
import { useCurrentFrame, useVideoConfig, getRemotionEnvironment } from 'remotion';

export function DebugOverlay({ enabled = true }: { enabled?: boolean }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const env = getRemotionEnvironment();
  
  if (!enabled || env.isRendering) return null;
  
  const seconds = (frame / fps).toFixed(2);
  const progress = ((frame / durationInFrames) * 100).toFixed(1);
  
  return (
    <div style={{
      position: 'fixed',
      top: 10,
      left: 10,
      padding: '12px 16px',
      background: 'rgba(0,0,0,0.8)',
      color: '#0f0',
      fontFamily: 'monospace',
      fontSize: 12,
      borderRadius: 8,
      zIndex: 99999,
      pointerEvents: 'none',
    }}>
      <div>Frame: {frame} / {durationInFrames}</div>
      <div>Time: {seconds}s</div>
      <div>Progress: {progress}%</div>
      <div>Resolution: {width}x{height}</div>
      <div>FPS: {fps}</div>
      <div>Env: {env.type}</div>
    </div>
  );
}

// debugging/performance-monitor.tsx
export function PerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const frameRef = useRef(0);
  const timeRef = useRef(performance.now());
  
  useEffect(() => {
    let rafId: number;
    
    const measure = () => {
      frameRef.current++;
      const now = performance.now();
      const elapsed = now - timeRef.current;
      
      if (elapsed >= 1000) {
        setFps(Math.round((frameRef.current * 1000) / elapsed));
        frameRef.current = 0;
        timeRef.current = now;
      }
      
      rafId = requestAnimationFrame(measure);
    };
    
    rafId = requestAnimationFrame(measure);
    
    return () => cancelAnimationFrame(rafId);
  }, []);
  
  const getFpsColor = () => {
    if (fps >= 55) return '#22c55e';
    if (fps >= 30) return '#f59e0b';
    return '#ef4444';
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      padding: '8px 12px',
      background: 'rgba(0,0,0,0.8)',
      color: getFpsColor(),
      fontFamily: 'monospace',
      fontSize: 14,
      fontWeight: 'bold',
      borderRadius: 8,
      zIndex: 99999,
    }}>
      {fps} FPS
    </div>
  );
}

// debugging/scrubber.tsx
export function FrameScrubber() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 600,
      padding: 16,
      background: 'rgba(0,0,0,0.8)',
      borderRadius: 12,
      zIndex: 99999,
    }}>
      <input
        type="range"
        min={0}
        max={durationInFrames}
        value={frame}
        readOnly
        style={{
          width: '100%',
          accentColor: '#6366f1',
        }}
      />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        color: '#a1a1aa',
        fontSize: 12,
        marginTop: 8,
        fontFamily: 'monospace',
      }}>
        <span>0</span>
        <span>{Math.floor(durationInFrames / 2)}</span>
        <span>{durationInFrames}</span>
      </div>
    </div>
  );
}

// debugging/visualize-anchors.tsx
export function VisualizeAnchors({ enabled = true }: { enabled?: boolean }) {
  if (!enabled) return null;
  
  return (
    <>
      {/* Center lines */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        bottom: 0,
        width: 1,
        background: 'rgba(239, 68, 68, 0.5)',
        pointerEvents: 'none',
        zIndex: 99998,
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: 1,
        background: 'rgba(239, 68, 68, 0.5)',
        pointerEvents: 'none',
        zIndex: 99998,
      }} />
      
      {/* Thirds grid */}
      {[1/3, 2/3].map((pos, i) => (
        <React.Fragment key={i}>
          <div style={{
            position: 'absolute',
            left: `${pos * 100}%`,
            top: 0,
            bottom: 0,
            width: 1,
            background: 'rgba(99, 102, 241, 0.3)',
            pointerEvents: 'none',
            zIndex: 99998,
          }} />
          <div style={{
            position: 'absolute',
            top: `${pos * 100}%`,
            left: 0,
            right: 0,
            height: 1,
            background: 'rgba(99, 102, 241, 0.3)',
            pointerEvents: 'none',
            zIndex: 99998,
          }} />
        </React.Fragment>
      ))}
      
      {/* Safe area markers */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '5%',
        right: '5%',
        bottom: '5%',
        border: '1px dashed rgba(34, 197, 94, 0.4)',
        pointerEvents: 'none',
        zIndex: 99998,
      }} />
    </>
  );
}
```

---

## 10. Animation Recipes

### 10.1 Typography Animations

```tsx
// recipes/text-animations.tsx

// Letter-by-letter reveal
export function LetterReveal({
  text,
  startFrame = 0,
  stagger = 2,
  theme = 'dark',
}: {
  text: string;
  startFrame?: number;
  stagger?: number;
  theme?: 'light' | 'dark';
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  return (
    <span>
      {text.split('').map((char, i) => {
        const charStart = startFrame + i * stagger;
        const progress = spring({
          frame: frame - charStart,
          fps,
          config: springs.gentle,
          from: 0,
          to: 1,
        });
        
        const y = (1 - progress) * 30;
        const rotateX = (1 - progress) * -45;
        const opacity = progress;
        
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translateY(${y}px) rotateX(${rotateX}deg)`,
              opacity,
              color: theme === 'dark' ? '#fafafa' : '#0a0a0a',
              whiteSpace: char === ' ' ? 'pre' : 'normal',
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}

// Typewriter effect
export function TypewriterText({
  text,
  startFrame,
  speed = 3,
  prefix = '',
  prefixColor,
  textColor,
  cursor = true,
}: {
  text: string;
  startFrame: number;
  speed?: number;
  prefix?: string;
  prefixColor?: string;
  textColor?: string;
  cursor?: boolean;
}) {
  const frame = useCurrentFrame();
  
  const charsToShow = Math.max(0, Math.floor((frame - startFrame) / speed));
  const displayedText = text.slice(0, charsToShow);
  const isTyping = charsToShow < text.length;
  
  return (
    <span style={{ fontFamily: 'monospace' }}>
      {prefix && (
        <span style={{ color: prefixColor }}>{prefix}</span>
      )}
      <span style={{ color: textColor }}>{displayedText}</span>
      {cursor && (
        <span style={{
          color: textColor,
          opacity: isTyping ? (frame % 30 < 15 ? 1 : 0) : 0,
        }}>
          ▋
        </span>
      )}
    </span>
  );
}

// Text scramble decode
export function TextScramble({
  text,
  startFrame,
  duration = 60,
  theme = 'dark',
}: {
  text: string;
  startFrame: number;
  duration?: number;
  theme?: 'light' | 'dark';
}) {
  const frame = useCurrentFrame();
  const [displayText, setDisplayText] = useState('');
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  useEffect(() => {
    if (frame < startFrame) return;
    
    const progress = Math.min((frame - startFrame) / duration, 1);
    const revealedLength = Math.floor(progress * text.length);
    
    let result = '';
    for (let i = 0; i < text.length; i++) {
      if (i < revealedLength) {
        result += text[i];
      } else if (text[i] === ' ') {
        result += ' ';
      } else {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    
    setDisplayText(result);
  }, [frame, startFrame, duration, text]);
  
  return (
    <span style={{ color: theme === 'dark' ? '#fafafa' : '#0a0a0a' }}>
      {displayText}
    </span>
  );
}
```

### 10.2 Micro-Interactions

```tsx
// recipes/micro-interactions.tsx

// Button hover effect
export function AnimatedButton({
  children,
  onClick,
  theme = 'dark',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  theme?: 'light' | 'dark';
}) {
  const frame = useCurrentFrame();
  const [isHovered, setIsHovered] = useState(false);
  
  const scale = isHovered ? 1.05 : 1;
  const glowOpacity = isHovered ? 0.4 : 0.2;
  
  return (
    <button
      style={{
        position: 'relative',
        padding: '16px 32px',
        fontSize: 16,
        fontWeight: 600,
        color: '#ffffff',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        border: 'none',
        borderRadius: 12,
        cursor: 'pointer',
        transform: `scale(${scale})`,
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Glow effect */}
      <div style={{
        position: 'absolute',
        inset: -4,
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        borderRadius: 16,
        opacity: glowOpacity,
        filter: 'blur(12px)',
        zIndex: -1,
        transition: 'opacity 0.2s ease',
      }} />
      {children}
    </button>
  );
}

// Card lift effect
export function HoverCard({
  children,
  theme = 'dark',
}: {
  children: React.ReactNode;
  theme?: 'light' | 'dark';
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  const y = isHovered ? -8 : 0;
  const shadow = isHovered
    ? '0 20px 40px rgba(0,0,0,0.3)'
    : '0 4px 12px rgba(0,0,0,0.1)';
  
  return (
    <div
      style={{
        padding: 32,
        background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : '#ffffff',
        borderRadius: 16,
        border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : '#e4e4e7'}`,
        transform: `translateY(${y}px)`,
        boxShadow: shadow,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
}

// Loading spinner
export function Spinner({
  size = 40,
  color = '#6366f1',
}: {
  size?: number;
  color?: string;
}) {
  const frame = useCurrentFrame();
  const rotation = (frame * 6) % 360;
  
  return (
    <div style={{
      width: size,
      height: size,
      animation: 'none',
    }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="60 100"
        />
      </svg>
    </div>
  );
}

// Progress bar
export function ProgressBar({
  progress,
  theme = 'dark',
}: {
  progress: number;
  theme?: 'light' | 'dark';
}) {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  
  return (
    <div style={{
      width: '100%',
      height: 4,
      background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      borderRadius: 2,
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${clampedProgress * 100}%`,
        height: '100%',
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
        borderRadius: 2,
        transition: 'width 0.3s ease',
      }} />
    </div>
  );
}
```

### 10.3 Cinematic Effects

```tsx
// recipes/cinematic-effects.tsx

// Parallax layers
export function ParallaxLayer({
  children,
  speed = 0.5,
  direction = 'vertical',
}: {
  children: React.ReactNode;
  speed?: number;
  direction?: 'vertical' | 'horizontal';
}) {
  const frame = useCurrentFrame();
  
  const offset = frame * speed;
  const transform = direction === 'vertical'
    ? `translateY(${offset}px)`
    : `translateX(${offset}px)`;
  
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      transform,
      willChange: 'transform',
    }}>
      {children}
    </div>
  );
}

// Depth of field blur
export function DepthOfField({
  children,
  focusDistance,
  blurStrength = 10,
}: {
  children: React.ReactNode;
  focusDistance: number;
  blurStrength?: number;
}) {
  const frame = useCurrentFrame();
  
  // Calculate blur based on "distance" from focus
  const blur = Math.abs(frame - focusDistance) / 10;
  const clampedBlur = Math.min(blur, blurStrength);
  
  return (
    <div style={{
      filter: `blur(${clampedBlur}px)`,
      transition: 'filter 0.1s linear',
    }}>
      {children}
    </div>
  );
}

// Ken Burns effect
export function KenBurns({
  children,
  startScale = 1,
  endScale = 1.1,
  startPosition = { x: 0, y: 0 },
  endPosition = { x: -5, y: -5 },
  duration,
}: {
  children: React.ReactNode;
  startScale?: number;
  endScale?: number;
  startPosition?: { x: number; y: number };
  endPosition?: { x: number; y: number };
  duration: number;
}) {
  const frame = useCurrentFrame();
  
  const progress = Math.min(frame / duration, 1);
  
  const scale = startScale + (endScale - startScale) * progress;
  const x = startPosition.x + (endPosition.x - startPosition.x) * progress;
  const y = startPosition.y + (endPosition.y - startPosition.y) * progress;
  
  return (
    <div style={{
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        transform: `scale(${scale}) translate(${x}%, ${y}%)`,
        willChange: 'transform',
      }}>
        {children}
      </div>
    </div>
  );
}

// Particle field
export function ParticleField({
  count = 50,
  theme = 'dark',
}: {
  count?: number;
  theme?: 'light' | 'dark';
}) {
  const frame = useCurrentFrame();
  
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, [count]);
  
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      {particles.map((particle) => {
        const y = (particle.y + frame * particle.speed) % 100;
        
        return (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${y}%`,
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              background: theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.4)',
              opacity: particle.opacity,
            }}
          />
        );
      })}
    </div>
  );
}

// Light leak effect
export function LightLeak({
  color = '#f59e0b',
  intensity = 0.3,
  position = 'top-right',
}: {
  color?: string;
  intensity?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) {
  const positionStyles = {
    'top-left': { top: -20, left: -20 },
    'top-right': { top: -20, right: -20 },
    'bottom-left': { bottom: -20, left: -20 },
    'bottom-right': { bottom: -20, right: -20 },
  };
  
  return (
    <div style={{
      position: 'absolute',
      width: 400,
      height: 400,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity: intensity,
      filter: 'blur(60px)',
      pointerEvents: 'none',
      ...positionStyles[position],
    }} />
  );
}
```

---

## Quick Reference

### Timing Cheat Sheet

| Duration | Frames @ 60fps | Use Case |
|----------|----------------|----------|
| 50ms | 3 | Micro-feedback |
| 150ms | 9 | Button states |
| 300ms | 18 | Standard transitions |
| 500ms | 30 | Entrances |
| 1000ms | 60 | Hero animations |
| 2000ms | 120 | Dramatic moments |

### Color Contrast Ratios

| Foreground | Background | Ratio | WCAG |
|------------|------------|-------|------|
| #0a0a0a | #fafafa | 19.3:1 | AAA |
| #525252 | #fafafa | 7.4:1 | AAA |
| #a1a1aa | #0a0a0a | 8.6:1 | AAA |
| #71717a | #0a0a0a | 5.9:1 | AA |

### Spring Configurations

| Name | Mass | Stiffness | Damping | Use Case |
|------|------|-----------|---------|----------|
| Gentle | 1 | 100 | 15 | Text reveals |
| Standard | 1 | 200 | 20 | UI elements |
| Snappy | 1 | 400 | 25 | Buttons, toggles |
| Bouncy | 1 | 300 | 10 | Playful elements |
| Cinematic | 3 | 80 | 20 | Slow motion |

---

*This framework is designed to elevate Remotion projects into studio-quality motion systems that look premium in both light and dark color schemes, ensuring accessibility, performance, and visual excellence.*
