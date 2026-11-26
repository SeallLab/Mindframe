import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Sparkles, X } from "lucide-react-native";
import { breakActivities, BreakActivity } from "../../types/breaks/BreakActivity.types";
import { BreakActivityCategory } from "../../types/AppEvent.types";
import { useUserStateStore } from "../../store/useUserStateStore";
import { ActivityCard } from "../ui/ActivityCard";
import { GradientFill } from "../ui/GradientFill";
import { HeroHeader } from "../ui/HeroHeader";
import { EmptyState } from "../ui/EmptyState";
import { ActiveActivitySession } from "./ActiveActivitySession";
import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_LABELS } from "../../styling/breaksTheme";
import { colors, spacing } from "../../styling/theme";
import { styles } from "../../styling/components/breaks/BreakSheet.styles";

type CategoryFilter = "all" | BreakActivityCategory;

const ALL_CATEGORIES: BreakActivityCategory[] = ["breathing", "movement", "mindfulness", "social", "rest"];

// How long the sheet's own slide-down takes (RN's default Modal slide
// animation). Resetting `active` back to null is delayed by this long after
// closing so the list view is never rendered while the sheet is still
// visible mid-close — see completeActivity below.
const SHEET_CLOSE_MS = 320;
const CROSSFADE_MS = 220;

interface BreakSheetProps {
  onClose: () => void;
}

function CategoryChip({
  filter,
  isActive,
  onPress,
}: {
  filter: CategoryFilter;
  isActive: boolean;
  onPress: () => void;
}) {
  const isAll = filter === "all";
  const accent = isAll ? colors.brand : CATEGORY_COLORS[filter];
  const Icon = isAll ? Sparkles : CATEGORY_ICONS[filter];
  const label = isAll ? "All" : CATEGORY_LABELS[filter];
  const iconColor = isActive ? colors.inkOnBrand : accent;

  // Active = solid accent fill. Inactive = transparent with just a colored
  // hairline, so the category stays identifiable without every chip in the
  // row reading as an equally-weighted filled block.
  return (
    <View
      onTouchEnd={onPress}
      style={[
        styles.chip,
        { backgroundColor: isActive ? accent : "transparent", borderColor: accent },
      ]}
    >
      <Icon size={14} color={iconColor} />
      <Text style={[styles.chipLabel, { color: iconColor }]}>{label}</Text>
    </View>
  );
}

export function BreakSheet({ onClose }: BreakSheetProps) {
  const insets = useSafeAreaInsets();
  const dispatch = useUserStateStore((s) => s.dispatch);
  const [active, setActive] = useState<BreakActivity | null>(null);
  const [filter, setFilter] = useState<CategoryFilter>("all");

  // Cross-fades between the list and the active session instead of hard-
  // swapping them, so starting/finishing an activity reads as one
  // transition rather than a jump cut.
  const contentOpacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    contentOpacity.setValue(0);
    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: CROSSFADE_MS,
      useNativeDriver: true,
    }).start();
  }, [active]);

  const filteredActivities = useMemo(
    () => (filter === "all" ? breakActivities : breakActivities.filter((a) => a.category === filter)),
    [filter]
  );

  function startActivity(activity: BreakActivity) {
    setActive(activity);
  }

  function completeActivity(actualMinutes: number) {
    if (!active) return;
    dispatch({
      type: "BREAK_TAKEN",
      durationMinutes: actualMinutes,
      activityType: active.category,
    });

    // Close first — the sheet starts sliding down while ActiveActivitySession
    // is still showing its "Nice work" hold state (active hasn't been reset
    // yet). Resetting `active` immediately here would swap the visible
    // content back to the category list for a frame before the close
    // animation even starts.
    onClose();
    setTimeout(() => setActive(null), SHEET_CLOSE_MS);
  }

  function cancelActivity() {
    setActive(null);
  }

  return (
    <Animated.View
      style={[
        styles.root,
        { paddingTop: Math.max(insets.top, 12), backgroundColor: colors.bg },
      ]}
    >
      <GradientFill name="sheet" />

      {/* Dawn scene: this is the "restore" half of the app, so it gets the
          warm sunrise rather than the night sky used for state/stats. */}
      <HeroHeader
        variant="dawn"
        height={132}
        title="Take a break"
        subtitle={active ? active.title : "Pick something that fits how you're feeling right now."}
      />

      <Animated.View style={{ flex: 1, opacity: contentOpacity }}>
        {active ? (
          <View style={styles.sessionContainer}>
            <ActiveActivitySession
              activity={active}
              onComplete={completeActivity}
              onCancel={cancelActivity}
            />
          </View>
        ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
              style={styles.chipScroll}
            >
              <CategoryChip filter="all" isActive={filter === "all"} onPress={() => setFilter("all")} />
              {ALL_CATEGORIES.map((cat) => (
                <CategoryChip key={cat} filter={cat} isActive={filter === cat} onPress={() => setFilter(cat)} />
              ))}
            </ScrollView>

            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              {filteredActivities.length === 0 ? (
                <EmptyState glyph="◌" title="Nothing here" subtitle="No activities in this category yet." />
              ) : (
                filteredActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} onPress={startActivity} />
                ))
              )}
            </ScrollView>
          </>
        )}
      </Animated.View>

      <Pressable
        onPress={onClose}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Close"
        style={({ pressed }) => [
          local.closeBtn,
          { top: Math.max(insets.top, 12) + spacing.md },
          pressed && local.closeBtnPressed,
        ]}
      >
        <X size={18} color={colors.ink} />
      </Pressable>
    </Animated.View>
  );
}

const local = StyleSheet.create({
  closeBtn: {
    position: "absolute",
    right: spacing.base,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 10,
    elevation: 10,
  },
  closeBtnPressed: { opacity: 0.7 },
});
