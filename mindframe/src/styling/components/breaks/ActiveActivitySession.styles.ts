import { StyleSheet } from "react-native";
import { colors, spacing, type } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: spacing.xl,
  },
  title: {
    ...type.subtitle,
    color: colors.ink,
    marginBottom: spacing.lg,
  },
  dialWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  // Absolute so it adds no layout; centered by dialWrap's alignItems/justifyContent.
  halo: {
    position: "absolute",
  },
  // Tabular figures keep the digits from shifting width as they tick down.
  timer: {
    ...type.numeral,
    fontSize: 34,
    color: colors.ink,
  },
  completeLabel: {
    ...type.subtitle,
    color: colors.ink,
    marginBottom: spacing.xl,
  },
  steps: {
    marginBottom: spacing.xl,
    alignSelf: "stretch",
    gap: 10,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  stepDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.energy,
    marginTop: 7,
  },
  step: {
    ...type.body,
    fontSize: 14,
    color: colors.inkMuted,
    flex: 1,
    lineHeight: 20,
  },
  actions: {
    alignSelf: "stretch",
    gap: spacing.sm,
  },
});
