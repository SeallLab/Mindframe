// src/styling/fonts.ts
//
// Font files to load before first render (see RootNavigator). Kept apart
// from theme.ts so the tokens there stay plain strings with no package
// imports. The keys here must match the fontFamily names used in `type`.
//
// Install:
//   npx expo install expo-font @expo-google-fonts/fraunces @expo-google-fonts/manrope

import { Fraunces_600SemiBold, Fraunces_700Bold } from "@expo-google-fonts/fraunces";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from "@expo-google-fonts/manrope";

export const FONT_ASSETS = {
  Fraunces_600SemiBold,
  Fraunces_700Bold,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
};
