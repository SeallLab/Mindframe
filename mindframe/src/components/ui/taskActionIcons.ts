// src/components/ui/taskActionIcons.ts
//
// Complete/delay/skip show up as icon+color pairs in two places
// (TaskDetailModal's action row, Calendar's row actions) — shared here so
// the two can't quietly drift (e.g. one using a different "delay" icon
// than the other after a future edit to just one file).

import { Check, CornerUpRight, X } from "lucide-react-native";
import { colors } from "../../styling/theme";

export const TASK_ACTION_ICONS = {
  complete: Check,
  delay: CornerUpRight,
  skip: X,
} as const;

export const TASK_ACTION_COLORS = {
  complete: colors.energy,
  delay: colors.momentum,
  skip: colors.stress,
} as const;
