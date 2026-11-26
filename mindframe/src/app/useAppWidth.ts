// src/app/useAppWidth.ts
import { Platform, useWindowDimensions } from "react-native";
import { MAX_APP_WIDTH } from "../styling/layout";

/** Width of the app's content column (the window width, capped on web). */
export function useAppWidth(): number {
  const { width } = useWindowDimensions();
  return Platform.OS === "web" ? Math.min(width, MAX_APP_WIDTH) : width;
}
