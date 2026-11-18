// ─────────────────────────────────────────────────────────────────────────────
// components/stats/StatsSummaryCard.tsx
//
// A single metric tile. Renders a label, a large value, and an optional
// unit string. Used in a horizontal row at the top of StatsScreen. When it
// has an accent color, the tile is washed with it so the row reads as a
// set of five distinct pastel tiles rather than five identical boxes.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Text, View } from "react-native";
import { GradientFill } from "../ui/GradientFill";
import { alpha } from "../../styling/theme";
import { styles } from "../../styling/components/stats/StatsSummaryCard.styles";

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  accentColor?: string;
}

export function StatsSummaryCard({ label, value, unit, accentColor }: Props) {
  return (
    <View style={styles.card}>
      {accentColor && (
        <GradientFill colors={[alpha(accentColor, 0.24), alpha(accentColor, 0.02)]} direction="diagonal" />
      )}
      {accentColor && <View style={[styles.accentDot, { backgroundColor: accentColor }]} />}
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, accentColor ? { color: accentColor } : null]}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
    </View>
  );
}
