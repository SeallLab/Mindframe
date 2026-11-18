// src/styling/gradients.ts
//
// Two kinds of gradient live here:
//   - `gradients`: two-stop pairs used as SVG stroke colors (ProgressRing).
//   - `fills`: full fill gradients (surface backdrops, buttons, tab bar)
//     rendered through expo-linear-gradient — see GradientFill/GradientButton.
//
// Gradients are reserved for emphasis: the primary button, the tab bar, the
// sheet backdrop, tinted stat tiles. Most surfaces stay flat so the ones
// that glow actually stand out.

import { colors } from './theme';

// ── Ring strokes ─────────────────────────────────────────────────────────

export const gradients = {
  /** Lavender → rose. The default "this is the thing to look at" ring. */
  focusRing: [colors.brand, colors.stress] as [string, string],
  /** Peach → butter. Reserved for energy/break contexts. */
  recoveryRing: [colors.energy, colors.confidence] as [string, string],
  /** Sky → mint. Calm, steady states. */
  calmRing: [colors.momentum, colors.positive] as [string, string],
} as const;

export type GradientName = keyof typeof gradients;

// ── Fills ────────────────────────────────────────────────────────────────

type Point = { x: number; y: number };

export interface FillGradient {
  colors: readonly [string, string, ...string[]];
  start: Point;
  end: Point;
}

export const directions = {
  down: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  across: { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } },
  diagonal: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
} as const;

export type Direction = keyof typeof directions;

export type FillName =
  | 'backdrop'
  | 'sheet'
  | 'tabBar'
  | 'ctaPrimary'
  | 'ctaWarm'
  | 'ctaCalm';

export const fills: Record<FillName, FillGradient> = {
  // Top edge matches colors.bg exactly, so hero artwork (whose sky also
  // starts at bg) blends into it with no visible seam.
  backdrop: { colors: [colors.bg, '#1B1540', '#241B52'], ...directions.down },
  sheet: { colors: [colors.bg, '#1A1440'], ...directions.down },
  tabBar: { colors: ['#1C1838', colors.bg], ...directions.down },

  // Buttons run left → right so the pastel shift reads as light, not a fade.
  ctaPrimary: { colors: [colors.brand, colors.stress], ...directions.across },
  ctaWarm: { colors: [colors.energy, colors.stress], ...directions.across },
  ctaCalm: { colors: [colors.momentum, colors.positive], ...directions.across },
};
