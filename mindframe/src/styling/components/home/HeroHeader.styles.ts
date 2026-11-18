import { StyleSheet } from "react-native";
import { colors, spacing, type } from "../../theme";

export const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    overflow: "hidden",
  },
  art: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  textBlock: {
    position: "absolute",
    left: spacing.xl,
    right: spacing.xl,
    bottom: spacing.base,
  },
  // Sits over the darker hills, with a soft shadow so it stays readable
  // wherever a star or the horizon glow happens to fall behind it.
  title: {
    ...type.display,
    color: colors.ink,
    textShadowColor: "rgba(10, 7, 24, 0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  subtitle: {
    ...type.body,
    fontSize: 14,
    color: colors.inkMuted,
    marginTop: 2,
    textShadowColor: "rgba(10, 7, 24, 0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  right: {
    position: "absolute",
    top: spacing.md,
    right: spacing.base,
  },
});
