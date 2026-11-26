// src/components/AppFrame.web.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../styling/theme";
import { MAX_APP_WIDTH } from "../styling/layout";

interface AppFrameProps {
  children: React.ReactNode;
  /**
   * Leave the page and column unpainted. Use inside a transparent Modal so
   * what's underneath shows through while the content is dragged or sliding.
   */
  transparent?: boolean;
}

/** Centers the app in a phone-width column on a darker page background. */
export function AppFrame({ children, transparent = false }: AppFrameProps) {
  return (
    <View style={[styles.page, !transparent && styles.pageFill]}>
      <View style={[styles.frame, transparent ? styles.frameClear : styles.frameFill]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: "center" },
  pageFill: { backgroundColor: colors.surfaceSunken },
  frame: { flex: 1, width: "100%", maxWidth: MAX_APP_WIDTH, overflow: "hidden" },
  frameFill: {
    backgroundColor: colors.bg,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  frameClear: { backgroundColor: "transparent" },
});
