import { StyleSheet } from "react-native";
import { colors, radius, shadow, type } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  pill: {
    backgroundColor: colors.ink,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    ...shadow.raised,
  },
  text: {
    ...type.bodyStrong,
    fontSize: 13,
    color: colors.surface,
  },
  textSaving: { color: colors.inkFaint },
  // Was a hardcoded hex ("#7CE0BF") — moved to the theme's `positive` token
  // so this doesn't drift from the palette during future theme changes.
  textSaved: { color: colors.positive },
});
