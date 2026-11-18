// src/navigators/RootNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { useDatabase } from "../db/useDatabase";
import { useUserPreferencesStore } from "../store/useUserPreferencesStore";
import { TabNavigator } from "./TabNavigator";
import { LoadingScreen } from "../screens/LoadingScreen";
import { ErrorScreen } from "../screens/ErrorScreen";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { BreakPromptModal } from "../components/breaks/BreakPromptModal";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { ROUTES } from "./routes";
import { colors } from "../styling/theme";
import { FONT_ASSETS } from "../styling/fonts";

export type RootStackParamList = {
  [ROUTES.LOADING]: undefined;
  [ROUTES.ERROR]: { message: string };
  [ROUTES.ONBOARDING]: undefined;
  [ROUTES.MAIN]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { ready, error } = useDatabase();

  // The preferences store is what knows whether onboarding has happened, so
  // the app isn't "loaded" until it has hydrated too — otherwise a returning
  // user would see onboarding flash for a frame before their saved
  // hasOnboarded=true arrived.
  const preferencesHydrated = useUserPreferencesStore((s) => s.isHydrated);
  const hasOnboarded = useUserPreferencesStore((s) => s.preferences.hasOnboarded);

  // Fonts are part of "loaded": without this, the first frame would render
  // in the system font and visibly swap to Fraunces/Manrope a moment later.
  // A font error counts as ready so a failed download degrades to the
  // system font instead of trapping the user on the loading screen.
  const [fontsLoaded, fontError] = useFonts(FONT_ASSETS);
  const fontsReady = fontsLoaded || !!fontError;

  const isLoaded = ready && preferencesHydrated && fontsReady;

  // Derive which screen to show as the initial route
  const initialRoute = (): keyof RootStackParamList => {
    if (error) return ROUTES.ERROR;
    if (!isLoaded) return ROUTES.LOADING;
    if (!hasOnboarded) return ROUTES.ONBOARDING;
    return ROUTES.MAIN;
  };

  return (
    // Wraps both the navigator and the global break prompt: the prompt is
    // rendered outside any screen, so a crash in it would otherwise escape
    // every boundary placed inside a screen.
    <ErrorBoundary>
      <Stack.Navigator
        initialRouteName={initialRoute()}
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        {!isLoaded && !error && (
          <Stack.Screen name={ROUTES.LOADING} component={LoadingScreen} />
        )}
        {error && (
          <Stack.Screen
            name={ROUTES.ERROR}
            component={ErrorScreen}
            initialParams={{ message: error.message }}
          />
        )}
        {isLoaded && !hasOnboarded && (
          <Stack.Screen name={ROUTES.ONBOARDING} component={OnboardingScreen} />
        )}
        {isLoaded && hasOnboarded && (
          <Stack.Screen name={ROUTES.MAIN} component={TabNavigator} />
        )}
      </Stack.Navigator>

      {/* No break prompts mid-onboarding — the user hasn't seen what they are yet. */}
      {isLoaded && hasOnboarded && <BreakPromptModal />}
    </ErrorBoundary>
  );
}
