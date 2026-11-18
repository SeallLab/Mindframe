import { StyleSheet } from "react-native";
import { colors, radius, shadow, spacing, type } from "../theme";

// Sized so the tallest step (art + body + the five metric pills) still fits
// above the dots and button on a short screen like an iPhone SE.
export const ARCH_WIDTH = 220;
export const ARCH_HEIGHT = 236;

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  skipRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    minHeight: 36, // reserved so the layout doesn't shift on the last step, where Skip is hidden
  },
  skip: {
    ...type.bodyStrong,
    fontSize: 14,
    color: colors.inkMuted,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxl,
  },
  // A doorway/window shape: top corners rounded to half the width (a full
  // semicircle), bottom corners only softly rounded.
  arch: {
    width: ARCH_WIDTH,
    height: ARCH_HEIGHT,
    borderTopLeftRadius: ARCH_WIDTH / 2,
    borderTopRightRadius: ARCH_WIDTH / 2,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.borderStrong,
    marginBottom: spacing.xl,
    ...shadow.raised,
  },
  title: {
    ...type.display,
    color: colors.ink,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  body: {
    ...type.body,
    color: colors.inkMuted,
    textAlign: "center",
    lineHeight: 22,
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  metricPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  metricDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metricLabel: {
    ...type.caption,
    color: colors.ink,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.brand,
  },
  actions: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
