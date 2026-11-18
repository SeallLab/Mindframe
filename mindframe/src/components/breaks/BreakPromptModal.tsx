import React, { useRef } from "react";
import { Animated, Modal, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { BatteryLow, AlertCircle } from "lucide-react-native";
import { useUserStateStore } from "../../store/useUserStateStore";
import { useBreakPromptStore } from "../../store/useBreakPromptStore";
import { THRESHOLDS } from "../../types/UserState.types";
import { Button } from "../ui/Button";
import { GradientButton } from "../ui/GradientButton";
import { SceneArt } from "../art/SceneArt";
import { colors, spacing } from "../../styling/theme";
import { styles, CARD_MAX_WIDTH, ART_HEIGHT } from "../../styling/components/breaks/BreakPromptModal.styles";

export function BreakPromptModal() {
  const state = useUserStateStore((s) => s.state);
  const dismissedAt = useBreakPromptStore((s) => s.dismissedAt);
  const canShow = useBreakPromptStore((s) => s.canShow);
  const dismiss = useBreakPromptStore((s) => s.dismiss);
  const openModal = useBreakPromptStore((s) => s.openModal);
  const { width: screenWidth } = useWindowDimensions();

  const isCritical =
    state.energyLevel < THRESHOLDS.criticalEnergy ||
    state.stressLevel > THRESHOLDS.highStressCritical;

  const visible = isCritical && canShow();

  // `animationType="fade"` fades backdrop and card together as one flat
  // ramp, which reads as a flash. Scaling the card in on native `onShow`
  // makes it read as arriving.
  const cardAnim = useRef(new Animated.Value(0)).current;

  function handleShow() {
    cardAnim.setValue(0);
    Animated.spring(cardAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 60,
    }).start();
  }

  function handleStartActivity() {
    dismiss();
    openModal();
  }

  function handleDismiss() {
    dismiss();
  }

  const isEnergyDriven = state.energyLevel < THRESHOLDS.criticalEnergy;

  // The scene fills the card's inner width: the card is capped at
  // CARD_MAX_WIDTH, and the backdrop pads both sides by spacing.xl.
  const cardWidth = Math.min(CARD_MAX_WIDTH, screenWidth - spacing.xl * 2);
  const artWidth = cardWidth - spacing.xl * 2;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onShow={handleShow}
      onRequestClose={handleDismiss}
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardAnim,
              transform: [
                { scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) },
              ],
            },
          ]}
        >
          {/* Low energy → a sleepy night sky; high stress → dusk. The badge
              hangs in the sky like a small planet. */}
          <View style={styles.artWrap}>
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <SceneArt variant={isEnergyDriven ? "night" : "dusk"} width={artWidth} height={ART_HEIGHT} />
            </View>
            <View style={styles.iconWrap}>
              {isEnergyDriven ? (
                <BatteryLow size={22} color={colors.stress} />
              ) : (
                <AlertCircle size={22} color={colors.stress} />
              )}
            </View>
          </View>

          <Text style={styles.headline}>
            {isEnergyDriven ? "You're running on empty" : "Stress is at a critical level"}
          </Text>
          <Text style={styles.detail}>
            {isEnergyDriven
              ? "Continuing now risks mistakes and a much longer recovery. A short break can turn this around."
              : "Your decision quality and retention drop sharply here. A short break now will likely cost you less than pushing through."}
          </Text>
          <View style={styles.actions}>
            <GradientButton label="Start a break" variant="warm" onPress={handleStartActivity} />
            <Button label="Not now" variant="ghost" onPress={handleDismiss} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
