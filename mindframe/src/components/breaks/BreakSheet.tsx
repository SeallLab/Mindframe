import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, PanResponder, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { breakActivities, BreakActivity } from "../../types/breaks/BreakActivity.types";
import { BreakActivityCategory } from "../../types/AppEvent.types";
import { useUserStateStore } from "../../store/useUserStateStore";
import { ActivityCard } from "../ui/ActivityCard";
import { IconButton } from "../ui/IconButton";
import { EmptyState } from "../ui/EmptyState";
import { ActiveActivitySession } from "./ActiveActivitySession";
import { CATEGORY_COLORS, CATEGORY_GLYPHS, CATEGORY_LABELS } from "../../styling/breaksTheme";
import { colors } from "../../styling/theme";
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
  const glyph = isAll ? "✳" : CATEGORY_GLYPHS[filter];
  const label = isAll ? "All" : CATEGORY_LABELS[filter];

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
      <Text style={[styles.chipGlyph, { color: isActive ? colors.inkOnBrand : accent }]}>{glyph}</Text>
      <Text style={[styles.chipLabel, { color: isActive ? colors.inkOnBrand : accent }]}>{label}</Text>
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

  const translateY = useRef(new Animated.Value(0)).current;
  const DISMISS_THRESHOLD = 120;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 4,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > DISMISS_THRESHOLD) {
          Animated.timing(translateY, {
            toValue: 800,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose();
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 6,
          }).start();
        }
      },
    })
  ).current;

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
    // animation even starts, which is the "weird popping" this fixes.
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
        { paddingTop: Math.max(insets.top, 12) },
        { transform: [{ translateY }] },
      ]}
    >
      {/* Drag handle — swipe down to dismiss */}
      <View style={styles.handleWrap} {...panResponder.panHandlers}>
        <View style={styles.handle} />
      </View>

      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Take a break</Text>
          <Text style={styles.subtitle}>
            {active ? active.title : "Pick something that fits how you're feeling right now."}
          </Text>
        </View>
        <IconButton glyph="✕" label="Close" onPress={onClose} />
      </View>

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
    </Animated.View>
  );
}
