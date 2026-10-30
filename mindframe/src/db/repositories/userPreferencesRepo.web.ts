import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserPreferences, defaultPreferences } from "../../types/UserPreferences.types";

const KEY = "user_preferences";

export function createUserPreferencesRepo(_db?: unknown) {
  return {
    async load(): Promise<UserPreferences> {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (!raw) return { ...defaultPreferences };
        // Merged over defaults, so preferences saved before a field existed
        // (e.g. hasOnboarded) pick up its default rather than undefined.
        return { ...defaultPreferences, ...JSON.parse(raw) };
      } catch (e) {
        console.error("userPreferencesRepo: couldn't read stored preferences, using defaults", e);
        return { ...defaultPreferences };
      }
    },

    // Not swallowed on purpose — see taskRepo.web.ts writeAll.
    async save(p: UserPreferences): Promise<void> {
      try {
        await AsyncStorage.setItem(KEY, JSON.stringify(p));
      } catch (e) {
        console.error("userPreferencesRepo: couldn't persist preferences", e);
        throw e;
      }
    },
  };
}

export type UserPreferencesRepo = ReturnType<typeof createUserPreferencesRepo>;
