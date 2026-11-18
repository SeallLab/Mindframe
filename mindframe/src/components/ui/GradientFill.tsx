// src/components/ui/GradientFill.tsx
//
// An absolutely-positioned gradient layer. Drop it in as the first child of
// any container to give it a gradient background — the container's own
// style file doesn't need to change, and touches pass straight through.
//
// Use a named fill from gradients.ts, or pass `colors` for a one-off tint
// (e.g. a stat tile washed with its own accent color).

import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Direction, FillName, directions, fills } from "../../styling/gradients";

interface GradientFillProps {
  name?: FillName;
  colors?: readonly [string, string, ...string[]];
  direction?: Direction;
  style?: StyleProp<ViewStyle>;
}

export function GradientFill({ name, colors, direction = "down", style }: GradientFillProps) {
  const preset = name ? fills[name] : undefined;
  const stops = colors ?? preset?.colors;
  if (!stops) return null;

  const { start, end } = preset ?? directions[direction];

  return (
    <LinearGradient
      colors={stops}
      start={start}
      end={end}
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, style]}
    />
  );
}
