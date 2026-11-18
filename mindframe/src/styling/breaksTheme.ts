// src/styling/breaksTheme.ts
//
// Color/label/icon tokens for break activity categories. Referenced by
// BreakSheet.

import { Wind, Footprints, CircleDot, Users, Moon } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { colors } from "./theme";
import { BreakActivityCategory } from "../types/AppEvent.types";

export const CATEGORY_COLORS: Record<BreakActivityCategory, string> = {
  breathing: colors.brand,
  movement: colors.energy,
  mindfulness: colors.confidence,
  social: colors.momentum,
  rest: colors.inkMuted,
};

export const CATEGORY_SOFT_COLORS: Record<BreakActivityCategory, string> = {
  breathing: colors.brandSoft,
  movement: colors.energySoft,
  mindfulness: colors.confidenceSoft,
  social: colors.momentumSoft,
  rest: 'rgba(154, 155, 192, 0.15)',
};

// Replaces the old unicode glyph table (◒ ↝ ◎ ◐ ☾) — real icon components
// render consistently across platforms/fonts, unlike unicode glyphs, which
// is exactly the kind of thing that reads as "placeholder" rather than
// finished.
export const CATEGORY_ICONS: Record<BreakActivityCategory, LucideIcon> = {
  breathing: Wind,
  movement: Footprints,
  mindfulness: CircleDot,
  social: Users,
  rest: Moon,
};

export const CATEGORY_LABELS: Record<BreakActivityCategory, string> = {
  breathing: 'Breathing',
  movement: 'Movement',
  mindfulness: 'Mindfulness',
  social: 'Social',
  rest: 'Rest',
};
