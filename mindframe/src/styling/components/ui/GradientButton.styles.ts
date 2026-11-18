import { StyleSheet } from "react-native";
import { colors, radius, spacing, type } from "../../theme";

export const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.pill,
  },
  full: {
    alignSelf: "stretch",
  },
  auto: {
    alignSelf: "center",
  },
  // shadowColor is supplied per-variant by the component.
  glow: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  fill: {
    height: 52,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    ...type.bodyStrong,
    fontSize: 16,
    color: colors.inkOnBrand,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.45,
  },
});
