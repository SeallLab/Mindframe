// src/components/ui/GradientButton.tsx
//
// The one emphasized action on a screen. Secondary/ghost actions should
// keep using Button — a gradient on everything stops meaning anything.

import React from "react";
import { Pressable, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FillName, fills } from "../../styling/gradients";
import { styles } from "../../styling/components/ui/GradientButton.styles";

type Variant = "primary" | "warm" | "calm";

const VARIANT_FILL: Record<Variant, FillName> = {
  primary: "ctaPrimary", // lavender → rose
  warm: "ctaWarm",       // peach → rose: urgent, break-now moments
  calm: "ctaCalm",       // sky → mint
};

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  fullWidth?: boolean;
  disabled?: boolean;
}

export function GradientButton({
  label,
  onPress,
  variant = "primary",
  fullWidth = true,
  disabled = false,
}: GradientButtonProps) {
  const fill = fills[VARIANT_FILL[variant]];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.wrap,
        fullWidth ? styles.full : styles.auto,
        // The glow takes its color from the gradient's first stop so each
        // variant lights its own surroundings.
        !disabled && [styles.glow, { shadowColor: fill.colors[0] }],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <LinearGradient colors={fill.colors} start={fill.start} end={fill.end} style={styles.fill}>
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}
