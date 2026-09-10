// ─────────────────────────────────────────────────────────────────────────────
// components/stats/UserStateGauge.tsx
//
// A semi-circular arc gauge for a single 0–100 cognitive metric.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Text, View } from "react-native";
import { ProgressRing } from "../ui/ProgressRing";
import { colors } from "../../styling/theme";
import { styles } from "../../styling/components/stats/UserStateGauge.styles";

interface Props {
  value: number; // 0–100
  label: string;
  color: string;
  isInverted?: boolean;
}

const SIZE = 80;
const RADIUS = 30;
const STROKE_W = 7;
const CANVAS_HEIGHT = SIZE / 2 + 16;
const CENTER_Y = SIZE / 2 + 6;

function resolveColor(value: number, brandColor: string, isInverted: boolean): string {
  if (isInverted) {
    if (value > 75) return colors.stress;
    if (value > 50) return colors.momentum;
    return colors.energy;
  }
  return brandColor;
}

export function UserStateGauge({ value, label, color, isInverted = false }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const arcColor = resolveColor(clamped, color, isInverted);

  return (
    <View style={styles.container}>
      <ProgressRing
        size={SIZE}
        height={CANVAS_HEIGHT}
        centerY={CENTER_Y}
        radius={RADIUS}
        strokeWidth={STROKE_W}
        progress={clamped / 100}
        trackColor={colors.surfaceSunken}
        color={arcColor}
        sweepAngle={180}
        startAngle={180}
      />
      <Text style={[styles.value, { color: arcColor }]}>{Math.round(clamped)}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
