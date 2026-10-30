import { StyleSheet } from "react-native";
import { colors, radius, shadow, spacing, type } from "../../theme";

export const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.raised,
  },
  barPressed: {
    opacity: 0.85,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  textBlock: {
    flex: 1,
    gap: 1,
  },
  label: {
    ...type.bodyStrong,
    fontSize: 14,
    color: colors.ink,
  },
  sub: {
    ...type.body,
    fontSize: 12,
    color: colors.inkFaint,
  },
  chevronWrap: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
