// src/styling/breaksTheme.ts
//
// Color/label tokens for break activity categories. Referenced by
// BreakSheet, and indirectly by ActiveActivitySession.
//
// These intentionally reuse the same five-hue family as the state metrics
// (they're drawn from the same palette so the app reads as one system) but
// are a different axis of meaning — activity type, not cognitive state —
// so they're kept in their own table rather than aliased to METRIC_COLORS.
// "Rest" gets a muted neutral rather than a bright accent: a category whose
// whole point is "no stimulation" shouldn't be the loudest chip on the row.

import { colors } from './theme';
import { BreakActivityCategory } from '../types/AppEvent.types';

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

export const CATEGORY_GLYPHS: Record<BreakActivityCategory, string> = {
  breathing: '◒',
  movement: '↝',
  mindfulness: '◎',
  social: '◐',
  rest: '☾',
};

export const CATEGORY_LABELS: Record<BreakActivityCategory, string> = {
  breathing: 'Breathing',
  movement: 'Movement',
  mindfulness: 'Mindfulness',
  social: 'Social',
  rest: 'Rest',
};
