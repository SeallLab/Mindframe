import React, { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
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

// Fixed order so a tier change can be expressed as a single animated index
// (0/1/2) and interpolated through — see emphasisAnim below.
const EMPHASIS_ORDER: BreakEmphasis[] = ["urgent", "suggested", "subtle"];
const ACCENT_OUTPUT_RANGE = EMPHASIS_ORDER.map((tier) => EMPHASIS_ACCENT[tier]);

interface BreakMiniBarProps {
  emphasis: BreakEmphasis;
  onPress: () => void;
}

export function BreakMiniBar({ emphasis, onPress }: BreakMiniBarProps) {
  const copy = EMPHASIS_COPY[emphasis];
  const targetIndex = EMPHASIS_ORDER.indexOf(emphasis);

  // Dot + glow color ease between tiers instead of snapping — state doesn't
  // cross a threshold mid-animation in the real world, so a brief color
  // morph reads as "this is changing," not as lag.
  const emphasisAnim = useRef(new Animated.Value(targetIndex)).current;
  // Label/sub-label cross-fade on change, since the color easing doesn't
  // cover text content swapping.
  const textOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(emphasisAnim, {
      toValue: targetIndex,
      duration: 260,
      useNativeDriver: false, // backgroundColor/shadowColor aren't native-driver props
    }).start();

    textOpacity.setValue(0);
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [targetIndex]);

  const accentColor = emphasisAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ACCENT_OUTPUT_RANGE,
  });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.bar, pressed && styles.barPressed]}
      accessibilityRole="button"
      accessibilityLabel="Open break activities"
    >
      <Animated.View
        style={[
          styles.dot,
          { backgroundColor: accentColor },
          // shadow.glow's shadowColor accepts the same Animated color value,
          // so the glow morphs in step with the dot rather than jumping to
          // match it a beat later.
          { ...shadow.glow(EMPHASIS_ACCENT[emphasis]), shadowColor: accentColor },
        ]}
      />

      <Animated.View style={[styles.textBlock, { opacity: textOpacity }]}>
        <Text style={styles.label}>{copy.label}</Text>
        <Text style={styles.sub}>{copy.sub}</Text>
      </Animated.View>

      <View style={styles.chevronWrap}>
        <View style={styles.chevronUp} />
      </View>
    </Pressable>
  );
}
