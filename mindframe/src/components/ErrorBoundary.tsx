// src/components/ErrorBoundary.tsx
//
// Catches render-time errors anywhere below it in the tree. This is a
// different job from ErrorScreen, which only handles a failed database
// initialization (a known, expected failure mode). This catches the
// unexpected kind: a bug in some component that would otherwise take the
// whole app down with no way to recover.
//
// Deliberately doesn't depend on React Navigation — the crash it's
// catching could be inside the navigator itself.
//
// Limits worth knowing: error boundaries do NOT catch errors in event
// handlers, async code (e.g. a rejected store action), or timers — only
// errors thrown while rendering. Those need their own try/catch.

import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertTriangle } from "lucide-react-native";
import { Button } from "./ui/Button";
import { colors, spacing, type } from "../styling/theme";

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Hook a crash reporter (Sentry, Bugsnag, etc.) in here. Logged in the
    // meantime so the failure isn't silent in dev or in device logs.
    console.error("Unhandled render error:", error, info.componentStack);
  }

  private reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: spacing.xxl,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.stressSoft,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: spacing.lg,
            }}
          >
            <AlertTriangle size={24} color={colors.stress} />
          </View>
          <Text
            style={[
              type.title,
              { color: colors.ink, textAlign: "center", marginBottom: spacing.sm },
            ]}
          >
            Something went wrong
          </Text>
          <Text
            style={[
              type.body,
              {
                color: colors.inkMuted,
                textAlign: "center",
                lineHeight: 22,
                marginBottom: spacing.xl,
              },
            ]}
          >
            The app hit an unexpected error. Your tasks and settings are saved on this device. Trying again usually clears it up.
          </Text>
          <Button label="Try again" fullWidth={false} onPress={this.reset} />
        </View>
      </SafeAreaView>
    );
  }
}
