import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import { BreakActivity } from "../../types/breaks/BreakActivity.types";
import { Button } from "../ui/Button";
import { ProgressRing } from "../ui/ProgressRing";
import { colors } from "../../styling/theme";
import { gradients } from "../../styling/gradients";
import { styles } from "../../styling/components/breaks/ActiveActivitySession.styles";

interface ActiveActivitySessionProps {
  activity: BreakActivity;
  /** Called with the actual number of minutes spent once the session ends. */
  onComplete: (actualMinutes: number) => void;
  onCancel: () => void;
}

const DIAL_SIZE = 148;
const DIAL_STROKE = 8;

// Breathing/mindfulness/rest read as "restoring" (recoveryRing: ember→gold);
// movement/social read as "activating" (focusRing: violet→signal).
const RESTORING_CATEGORIES = new Set(["breathing", "mindfulness", "rest"]);

// How long the "Nice work" confirmation holds on screen before handing
// control back to the parent. This is what the sheet's slide-down animation
// plays over, instead of the list view flashing back the instant the
// session ends — see BreakSheet.completeActivity for the other half of this.
const COMPLETION_HOLD_MS = 700;

export function ActiveActivitySession({ activity, onComplete, onCancel }: ActiveActivitySessionProps) {
  const totalSeconds = activity.defaultDurationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isComplete, setIsComplete] = useState(false);
  const completeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isComplete) return;
    if (secondsLeft <= 0) {
      triggerCompletion(totalSeconds / 60);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, isComplete]);

  function triggerCompletion(actualMinutes: number) {
    setIsComplete(true);
    Animated.spring(completeAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 60,
    }).start();
    // The parent doesn't hear about completion until the hold finishes, so
    // whatever it does next (closing the sheet) happens while this
    // component is already showing the checkmark, not the countdown.
    setTimeout(() => onComplete(actualMinutes), COMPLETION_HOLD_MS);
  }

  function finishEarly() {
    if (isComplete) return;
    const elapsedMinutes = Math.max(1, Math.round((totalSeconds - secondsLeft) / 60));
    triggerCompletion(elapsedMinutes);
  }

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");
  const progress = totalSeconds === 0 ? 0 : 1 - secondsLeft / totalSeconds;
  const gradient = RESTORING_CATEGORIES.has(activity.category) ? gradients.recoveryRing : gradients.focusRing;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{activity.title}</Text>

      <View style={styles.dialWrap}>
        <ProgressRing
          size={DIAL_SIZE}
          strokeWidth={DIAL_STROKE}
          progress={isComplete ? 1 : progress}
          trackColor={colors.surfaceSunken}
          gradient={gradient}
          gradientId="activityDialGradient"
        >
          {isComplete ? (
            <Animated.View
              style={{
                opacity: completeAnim,
                transform: [
                  { scale: completeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
                ],
              }}
            >
              <Text style={styles.checkmark}>✓</Text>
            </Animated.View>
          ) : (
            <Text style={styles.timer}>
              {minutes}:{seconds}
            </Text>
          )}
        </ProgressRing>
      </View>

      {isComplete ? (
        <Animated.Text style={[styles.completeLabel, { opacity: completeAnim }]}>Nice work</Animated.Text>
      ) : (
        <>
          {activity.steps && (
            <View style={styles.steps}>
              {activity.steps.map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  <View style={styles.stepDot} />
                  <Text style={styles.step}>{step}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.actions}>
            <Button label="I'm done" onPress={finishEarly} />
            <Button label="Cancel" variant="ghost" onPress={onCancel} />
          </View>
        </>
      )}
    </View>
  );
}
