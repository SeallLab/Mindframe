// src/screens/OnboardingScreen.tsx
//
// First-run flow. Shown once, before the main tabs, until the user finishes
// or skips it — RootNavigator decides when to show it based on
// preferences.hasOnboarded, so this screen has no navigation logic of its
// own: completing it just flips the flag, and the navigator swaps screens.

import React, { useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Brain, ShieldCheck, Sparkles, Zap } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { Button } from "../components/ui/Button";
import { useUserPreferencesStore } from "../store/useUserPreferencesStore";
import { METRIC_COLORS, METRIC_LABELS } from "../styling/statsTheme";
import { colors } from "../styling/theme";
import { styles } from "../styling/screens/OnboardingScreen.styles";

interface Step {
  Icon: LucideIcon;
  accent: string;
  accentSoft: string;
  title: string;
  body: string;
  /** Renders the five-metric legend under the body copy. */
  showMetrics?: boolean;
}

const STEPS: Step[] = [
  {
    Icon: Sparkles,
    accent: colors.brand,
    accentSoft: colors.brandSoft,
    title: "Welcome to Mindframe",
    body: "This app tracks how you're actually doing, not just what's on your calendar, and uses that to shape what it suggests next.",
  },
  {
    Icon: Brain,
    accent: colors.momentum,
    accentSoft: colors.momentumSoft,
    title: "Five signals, tracked live",
    body: "These move as you complete, skip, or delay tasks, and as you take breaks.",
    showMetrics: true,
  },
  {
    Icon: Zap,
    accent: colors.confidence,
    accentSoft: colors.confidenceSoft,
    title: "Suggestions that react",
    body: "The banner on Home changes with your state. Sometimes that's encouragement, sometimes it's a nudge to step away for a few minutes.",
  },
  {
    Icon: ShieldCheck,
    accent: colors.energy,
    accentSoft: colors.energySoft,
    title: "You're in control",
    body: "Your data stays on this device. You can change how sensitive the nudges are any time from your Profile.",
  },
];

const METRIC_KEYS = Object.keys(METRIC_LABELS) as (keyof typeof METRIC_LABELS)[];

export function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const completeOnboarding = useUserPreferencesStore((s) => s.completeOnboarding);
  const fade = useRef(new Animated.Value(1)).current;
  const isTransitioning = useRef(false);

  // Fade out → swap content → fade in, so changing steps reads as one
  // transition rather than text jumping. The guard stops a fast double-tap
  // from queueing two overlapping transitions and skipping a step.
  function goTo(next: number) {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    Animated.timing(fade, { toValue: 0, duration: 140, useNativeDriver: true }).start(() => {
      setStep(next);
      Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }).start(() => {
        isTransitioning.current = false;
      });
    });
  }

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.skipRow}>
        {!isLast && (
          <TouchableOpacity
            onPress={completeOnboarding}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Skip introduction"
          >
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <Animated.View style={[styles.content, { opacity: fade }]}>
        <View style={[styles.iconWrap, { backgroundColor: current.accentSoft }]}>
          <current.Icon size={32} color={current.accent} />
        </View>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.body}>{current.body}</Text>

        {current.showMetrics && (
          <View style={styles.metrics}>
            {METRIC_KEYS.map((key) => (
              <View key={key} style={styles.metricPill}>
                <View style={[styles.metricDot, { backgroundColor: METRIC_COLORS[key] }]} />
                <Text style={styles.metricLabel}>{METRIC_LABELS[key]}</Text>
              </View>
            ))}
          </View>
        )}
      </Animated.View>

      <View style={styles.dots}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.actions}>
        <Button
          label={isLast ? "Get started" : "Next"}
          onPress={() => (isLast ? completeOnboarding() : goTo(step + 1))}
        />
      </View>
    </SafeAreaView>
  );
}
