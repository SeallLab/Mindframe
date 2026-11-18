import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserPreferencesStore } from "../store/useUserPreferencesStore";
import { PreferencesForm } from "../components/profile/PreferencesForm";
import { UserPreferences } from "../types/UserPreferences.types";
import { HeroHeader } from "../components/ui/HeroHeader";
import { Toast, ToastStatus } from "../components/profile/Toast";
import { colors, swatches } from "../styling/theme";
import { styles } from "../styling/screens/ProfileScreen.styles";

// Same pastel set used for task colors, so a user's picks always sit well on the palette.
const AVATAR_COLORS = swatches;

const SAVE_DEBOUNCE_MS = 500;
const SAVED_DISPLAY_MS = 1500;

export function ProfileScreen() {
  const { preferences, updatePreferences, isHydrated } = useUserPreferencesStore();

  const [saveStatus, setSaveStatus] = useState<ToastStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [localName, setLocalName] = useState(preferences.displayName);

  useEffect(() => {
    setLocalName(preferences.displayName);
  }, [isHydrated]);

  const handleChange = useCallback(
    (patch: Partial<UserPreferences>) => {
      setSaveStatus("saving");

      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);

      debounceRef.current = setTimeout(async () => {
        await updatePreferences(patch);
        setSaveStatus("saved");

        savedTimerRef.current = setTimeout(() => setSaveStatus("idle"), SAVED_DISPLAY_MS);
      }, SAVE_DEBOUNCE_MS);
    },
    [updatePreferences]
  );

  const handleNameBlur = () => {
    if (localName !== preferences.displayName) {
      handleChange({ displayName: localName });
    }
  };

  if (!isHydrated) {
    return (
      <SafeAreaView style={styles.loadingSafe}>
        <Text style={styles.loadingText}>Loading your profile…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header lives inside the scroll view so it scrolls away with the content.
            It's outside the padded wrapper below so the artwork stays full-width. */}
        <HeroHeader variant="dawn" title="Profile" subtitle="How you work, and how we help" />
        <View style={styles.scrollContent}>
          {/* Identity card */}
          <View style={styles.identityCard}>
            <View style={styles.avatarRow}>
              <View style={[styles.avatar, { backgroundColor: preferences.avatarColor }]}>
                <Text style={styles.avatarText}>
                  {preferences.displayName ? preferences.displayName.charAt(0).toUpperCase() : "?"}
                </Text>
              </View>

              <TextInput
                style={styles.input}
                value={localName}
                placeholder="Your name"
                placeholderTextColor={colors.inkFaint}
                maxLength={40}
                onChangeText={setLocalName}
                onBlur={handleNameBlur}
              />
            </View>

            <Text style={styles.colorLabel}>Avatar color</Text>
            <View style={styles.colorPicker}>
              {AVATAR_COLORS.map((color) => {
                const selected = preferences.avatarColor === color;
                return (
                  <Pressable
                    key={color}
                    onPress={() => handleChange({ avatarColor: color })}
                    style={[styles.colorSwatch, { backgroundColor: color }, selected && styles.colorSelected]}
                    accessibilityRole="button"
                    accessibilityLabel={`Choose avatar color ${color}`}
                  />
                );
              })}
            </View>
          </View>

          {/* Preferences */}
          <PreferencesForm preferences={preferences} onChange={handleChange} />

          <View style={styles.bottomPad} />
        </View>
      </ScrollView>

      <Toast status={saveStatus} />
    </SafeAreaView>
  );
}