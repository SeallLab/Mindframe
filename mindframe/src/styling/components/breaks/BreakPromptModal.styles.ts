import { StyleSheet } from "react-native";
import { alpha, colors, radius, shadow, spacing, type } from "../../theme";

export const CARD_MAX_WIDTH = 360;
export const ART_HEIGHT = 128;

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.xl,
    width: "100%",
    maxWidth: CARD_MAX_WIDTH,
    ...shadow.raised,
  },
  // The scene is an absolute-fill child; the icon badge is the only
  // in-flow child, so centering it centers it in the sky.
  artWrap: {
    height: ART_HEIGHT,
    borderRadius: radius.lg,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  // Translucent rather than solid so the stars show through it.
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: alpha(colors.bg, 0.55),
    borderWidth: 1,
    borderColor: alpha(colors.stress, 0.5),
    alignItems: "center",
    justifyContent: "center",
  },
  headline: {
    ...type.title,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  detail: {
    ...type.body,
    fontSize: 14,
    color: colors.inkMuted,
    lineHeight: 21,
    marginBottom: spacing.lg,
  },
  actions: {
    gap: spacing.sm,
  },
});
