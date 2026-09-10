import React from "react";
import { Pressable, Text, View } from "react-native";
import { UserState, THRESHOLDS } from "../../types/UserState.types";
import { colors, shadow } from "../../styling/theme";
import { styles } from "../../styling/components/breaks/BreakMiniBar.styles";

export type BreakEmphasis = "urgent" | "suggested" | "subtle";

export function getBreakEmphasis(state: UserState): BreakEmphasis {
  if (state.energyLevel < THRESHOLDS.criticalEnergy || state.stressLevel > THRESHOLDS.highStressCritical) {
    return "urgent";
  }
  if (state.energyLevel < THRESHOLDS.lowEnergy || state.stressLevel > THRESHOLDS.elevatedStress) {
    return "suggested";
  }
  return "subtle";
}

const EMPHASIS_COPY: Record<BreakEmphasis, { label: string; sub: string }> = {
  urgent:    { label: "Take a break now",  sub: "Energy is critically low" },
  suggested: { label: "Consider a break",  sub: "Energy is getting low" },
  subtle:    { label: "Need a break?",     sub: "Tap to browse activities" },
};

const EMPHASIS_ACCENT: Record<BreakEmphasis, string> = {
  urgent: colors.stress,
  suggested: colors.momentum,
  subtle: colors.brand,
};

interface BreakMiniBarProps {
  emphasis: BreakEmphasis;
  onPress: () => void;
}

export function BreakMiniBar({ emphasis, onPress }: BreakMiniBarProps) {
  const copy = EMPHASIS_COPY[emphasis];
  const accent = EMPHASIS_ACCENT[emphasis];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.bar, pressed && styles.barPressed]}
      accessibilityRole="button"
      accessibilityLabel="Open break activities"
    >
      {/* Glow intensity is fixed — only the color changes with emphasis —
          so "urgent" reads as more alarming without the bar itself getting
          louder every tier (see design plan: one glow per screen, applied
          here at component scale: one glowing element per bar). */}
      <View style={[styles.dot, { backgroundColor: accent }, shadow.glow(accent)]} />

      <View style={styles.textBlock}>
        <Text style={styles.label}>{copy.label}</Text>
        <Text style={styles.sub}>{copy.sub}</Text>
      </View>

      <View style={styles.chevronWrap}>
        <View style={styles.chevronUp} />
      </View>
    </Pressable>
  );
}
