// src/styling/gradients.ts
//
// Gradient pairs. Used sparingly — only on the single highest-priority
// element on a screen (active dial, top recommendation strip, primary CTA).
// Everything else stays a flat surface color. See design plan, principle 3.

import { colors } from './theme';

export const gradients = {
  /** Marks the single highest-priority element on a screen. */
  focusRing: [colors.brand, colors.stress] as [string, string],
  /** Reserved for energy/break contexts, so "restoring" reads visually
   *  distinct from "focusing". */
  recoveryRing: [colors.energy, colors.confidence] as [string, string],
} as const;

export type GradientName = keyof typeof gradients;
