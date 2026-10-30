import React, { useRef } from "react";
import { Animated, Modal, Text, View } from "react-native";
import { BatteryLow, AlertCircle } from "lucide-react-native";
import { useUserStateStore } from "../../store/useUserStateStore";
import { useBreakPromptStore } from "../../store/useBreakPromptStore";
import { THRESHOLDS } from "../../types/UserState.types";
import { Button } from "../ui/Button";
import { colors } from "../../styling/theme";
import { styles } from "../../styling/components/breaks/BreakPromptModal.styles";

export function BreakPromptModal() {
  const state = useUserStateStore((s) => s.state);
  const dismissedAt = useBreakPromptStore((s) => s.dismissedAt);
  const canShow = useBreakPromptStore((s) => s.canShow);
  const dismiss = useBreakPromptStore((s) => s.dismiss);
  const openModal = useBreakPromptStore((s) => s.openModal);

  const isCritical =
    state.energyLevel < THRESHOLDS.criticalEnergy ||
    state.stressLevel > THRESHOLDS.highStressCritical;

  const visible = isCritical && canShow();

  // `animationType="fade"` on the Modal fades the whole overlay — backdrop
  // and card — uniformly and at once, which reads as an abrupt flash.
  // Animating the card itself (scale up slightly while it fades in, on
  // native `onShow`) makes it read as arriving instead of just appearing.
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
          <View style={styles.iconWrap}>
            {isEnergyDriven ? (
              <BatteryLow size={22} color={colors.stress} />
            ) : (
              <AlertCircle size={22} color={colors.stress} />
            )}
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
            <Button label="Start a break" variant="danger" onPress={handleStartActivity} />
            <Button label="Not now" variant="ghost" onPress={handleDismiss} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
