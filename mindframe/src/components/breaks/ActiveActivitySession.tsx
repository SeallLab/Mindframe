import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
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
// movement/social read as "activating" (focusRing: violet→signal). Keeps the
// same two gradients used everywhere else in the app, just picked by what
// the activity is doing for the user rather than a per-activity one-off.
const RESTORING_CATEGORIES = new Set(["breathing", "mindfulness", "rest"]);

export function ActiveActivitySession({ activity, onComplete, onCancel }: ActiveActivitySessionProps) {
  const totalSeconds = activity.defaultDurationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      const actualMinutes = totalSeconds / 60;
      onComplete(actualMinutes);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  function finishEarly() {
    const elapsedMinutes = Math.max(1, Math.round((totalSeconds - secondsLeft) / 60));
    onComplete(elapsedMinutes);
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
          progress={progress}
          trackColor={colors.surfaceSunken}
          gradient={gradient}
          gradientId="activityDialGradient"
        >
          <Text style={styles.timer}>
            {minutes}:{seconds}
          </Text>
        </ProgressRing>
      </View>

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
    </View>
  );
}
