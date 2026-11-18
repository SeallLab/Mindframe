import React, { useEffect, useRef } from "react";
import { Animated, View, Text, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStateStore } from "../store/useUserStateStore";
import { useBreakPromptStore } from "../store/useBreakPromptStore";
import { Recommendation, RecommendationCategory } from "../types/recommendations/Recommendation.types";
import { Calendar } from "../components/calendar/Calendar";
import { BreakMiniBar, getBreakEmphasis } from "../components/breaks/BreakMiniBar";
import { BreakSheet } from "../components/breaks/BreakSheet";
import { HeroHeader } from "../components/ui/HeroHeader";
import { GradientFill } from "../components/ui/GradientFill";
import { alpha, colors, radius, semantic } from "../styling/theme";
import { styles, banner } from "../styling/screens/HomeScreen.styles";

const CATEGORY_STYLE: Record<RecommendationCategory, { accent: string; label: string }> = {
  recovery:   { accent: semantic.recovery, label: "Recovery" },
  focus:      { accent: semantic.focus, label: "Focus" },
  motivation: { accent: semantic.motivation, label: "Motivation" },
  warning:    { accent: semantic.warning, label: "Warning" },
  celebrate:  { accent: semantic.celebrate, label: "Nice work" },
};

// ─── Recommendation banner ─────────────────────────────────────────────────

function RecommendationBanner({ rec }: { rec: Recommendation }) {
  const s = CATEGORY_STYLE[rec.category];
  return (
    // Radius/overflow are set here (not left to banner.wrap) because the
    // gradient wash is an absolutely-positioned child that has to be
    // clipped to the card's shape.
    <View
      style={[
        banner.wrap,
        { backgroundColor: colors.surface, borderRadius: radius.lg, overflow: "hidden" },
      ]}
    >
      <GradientFill colors={[alpha(s.accent, 0.3), alpha(s.accent, 0.04)]} direction="diagonal" />
      <View style={[banner.strip, { backgroundColor: s.accent }]} />
      <View style={banner.body}>
        <View style={banner.row}>
          <Text style={[banner.tag, { color: s.accent }]}>{s.label.toUpperCase()}</Text>
          {rec.priority === "urgent" && (
            <View style={[banner.urgentPill, { backgroundColor: s.accent }]}>
              <Text style={banner.urgentText}>URGENT</Text>
            </View>
          )}
        </View>
        <Text style={[banner.headline, { color: s.accent }]}>{rec.headline}</Text>
        <Text style={banner.detail}>{rec.detail}</Text>
      </View>
    </View>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────

function formatWeekdayDate() {
  const today = new Date();
  return {
    weekday: today.toLocaleDateString("en-US", { weekday: "long" }),
    date: today.toLocaleDateString("en-US", { month: "long", day: "numeric" }),
  };
}

export function HomeScreen() {
  const state = useUserStateStore((s) => s.state);
  const recommendations = useUserStateStore((s) => s.recommendations);
  const topRec = recommendations[0] ?? null;

  const modalVisible = useBreakPromptStore((s) => s.modalVisible);
  const openModal = useBreakPromptStore((s) => s.openModal);
  const closeModal = useBreakPromptStore((s) => s.closeModal);

  const emphasis = getBreakEmphasis(state);
  const { weekday, date } = formatWeekdayDate();

  // Cross-fade when the top recommendation changes (keyed on id, not object
  // identity — the engine can hand back an equal-but-new object without it
  // being a different suggestion).
  const bannerOpacity = useRef(new Animated.Value(topRec ? 1 : 0)).current;
  const lastRecId = useRef<string | null>(topRec?.id ?? null);

  useEffect(() => {
    const nextId = topRec?.id ?? null;
    if (nextId === lastRecId.current) return;
    lastRecId.current = nextId;

    if (!topRec) return; // banner unmounts via the conditional below

    bannerOpacity.setValue(0);
    Animated.timing(bannerOpacity, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [topRec?.id]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <HeroHeader variant="dusk" title={weekday} subtitle={date} />

      {topRec && (
        <Animated.View style={{ opacity: bannerOpacity }}>
          <RecommendationBanner rec={topRec} />
        </Animated.View>
      )}

      <View style={styles.calendar}>
        <Calendar />
      </View>

      {/* Collapsed mini bar — tapping it slides the full break sheet up */}
      <BreakMiniBar emphasis={emphasis} onPress={openModal} />

      {/* Expanded break sheet — takes over the full screen when opened */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={closeModal}>
        <BreakSheet onClose={closeModal} />
      </Modal>
    </SafeAreaView>
  );
}
