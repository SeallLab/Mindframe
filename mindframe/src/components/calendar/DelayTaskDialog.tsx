import React, { useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, Text, View } from "react-native";
import { Button } from "../ui/Button";
import { DateTimeField } from "../ui/DateTimeField";
import { dateStringToLocalDate, formatDateString } from "../../utils/calendarUtils";
import { styles } from "../../styling/components/calendar/DelayTaskDialog.styles";

interface DelayTaskDialogProps {
  visible: boolean;
  taskTitle?: string;
  /** Current date of the task, "YYYY-MM-DD" — used to prefill the field. */
  initialDate?: string;
  onConfirm: (newDate: string) => void;
  onCancel: () => void;
}

export function DelayTaskDialog({
  visible,
  taskTitle,
  initialDate,
  onConfirm,
  onCancel,
}: DelayTaskDialogProps) {
  const [date, setDate] = useState<Date>(() =>
    dateStringToLocalDate(initialDate ?? formatDateString(new Date()))
  );

  // Re-seed the field whenever a new task is targeted for delay.
  useEffect(() => {
    if (visible) {
      setDate(dateStringToLocalDate(initialDate ?? formatDateString(new Date())));
    }
  }, [visible, initialDate]);

  // Same reasoning as BreakPromptModal: the Modal's own `animationType="fade"`
  // only fades backdrop + card together as one flat ramp, which reads as a
  // flash. Scaling the card in on native `onShow` makes it read as arriving.
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

  return (
    <Modal visible={visible} transparent animationType="fade" onShow={handleShow} onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
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
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Text style={styles.title}>Push this task back</Text>
            {taskTitle ? (
              <Text style={styles.message} numberOfLines={2}>
                Choose a new date for "{taskTitle}".
              </Text>
            ) : null}

            <DateTimeField label="New date" mode="date" value={date} onChange={setDate} />

            <View style={styles.actions}>
              <View style={styles.actionItem}>
                <Button label="Cancel" variant="secondary" onPress={onCancel} />
              </View>
              <View style={styles.actionItem}>
                <Button label="Delay" variant="primary" onPress={() => onConfirm(formatDateString(date))} />
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
