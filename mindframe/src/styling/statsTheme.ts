// src/styling/statsTheme.ts
//
// Color/label tokens for the stats screen. Referenced by UserStateGauge,
// TaskCompletionChart, ProductivityTimeline, PriorityBreakdown,
// StatsSummaryCard, StatsScreen.

import { colors } from './theme';

export const METRIC_COLORS = {
  stressLevel: colors.stress,
  energyLevel: colors.energy,
  focusLevel: colors.brand,
  momentum: colors.momentum,
  confidence: colors.confidence,
} as const;

export const METRIC_LABELS = {
  stressLevel: 'Stress',
  energyLevel: 'Energy',
  focusLevel: 'Focus',
  momentum: 'Momentum',
  confidence: 'Confidence',
} as const;

export const OUTCOME_COLORS = {
  completed: colors.energy,
  delayed: colors.momentum,
  skipped: colors.stress,
  pending: colors.border,
} as const;

export const OUTCOME_LABELS = {
  completed: 'Completed',
  delayed: 'Delayed',
  skipped: 'Skipped',
  pending: 'Pending',
} as const;

export const PRIORITY_COLORS = {
  high: colors.stress,
  medium: colors.momentum,
  low: colors.energy,
} as const;

export const PRIORITY_LABELS = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
} as const;

export const TIMELINE_DAYS = 7;
