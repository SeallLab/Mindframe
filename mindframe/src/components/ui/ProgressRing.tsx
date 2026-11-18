// src/components/ui/ProgressRing.tsx
//
// Shared circular/arc progress indicator. ActiveActivitySession (full ring,
// countdown dial) and UserStateGauge (semicircle gauge) both need "a
// stroked ring/arc that fills in as progress increases" — this is that
// primitive, so the geometry and dash-offset technique live in one place
// instead of being duplicated across the two components.

import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { describeArc } from "./arcMath";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface ProgressRingProps {
  /** Width of the SVG canvas, and the basis for the default radius. */
  size: number;
  strokeWidth: number;
  /** 0–1. Values outside this range are clamped. */
  progress: number;
  trackColor: string;
  /** Solid stroke color. Ignored if `gradient` is provided. */
  color?: string;
  /** Two-color gradient stroke — use for the single emphasis ring on a
   *  screen (see design plan, "one glow per screen"). */
  gradient?: readonly [string, string];
  gradientId?: string;
  /** 360 = full ring (default — e.g. a countdown dial). Pass 180 for a
   *  semicircle gauge, etc. */
  sweepAngle?: number;
  /** Degrees, 0 = 3 o'clock, clockwise. Default -90 = 12 o'clock, the
   *  natural start point for a clock-style dial. A left-to-right semicircle
   *  gauge should pass 180 here (see UserStateGauge). */
  startAngle?: number;
  /** Canvas height, if different from `size` — needed for a semicircle
   *  gauge, which is shorter than it is wide. Defaults to `size`. */
  height?: number;
  /** Arc center Y, if different from height / 2 — lets a semicircle gauge
   *  sit at the bottom of its (shorter) canvas instead of the middle. */
  centerY?: number;
  /** Arc radius override. Defaults to (size - strokeWidth) / 2. */
  radius?: number;
  /** When true, changes to `progress` ease into place instead of snapping —
   *  use for anything driven by a value that can jump between renders (a
   *  state gauge reacting to a dispatch). Leave false for anything already
   *  updating in small, precise steps on its own (a per-second countdown),
   *  where easing would just make it lag behind the real value. */
  animated?: boolean;
  children?: React.ReactNode;
}

export function ProgressRing({
  size,
  strokeWidth,
  progress,
  trackColor,
  color,
  gradient,
  gradientId = "progressRingGradient",
  sweepAngle = 360,
  startAngle = -90,
  height,
  centerY,
  radius,
  animated = false,
  children,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  const canvasHeight = height ?? size;
  const cx = size / 2;
  const cy = centerY ?? canvasHeight / 2;
  const r = radius ?? (size - strokeWidth) / 2;
  const isFullCircle = sweepAngle >= 360;

  // A full 360° circle can't be a single arc command (start === end), so
  // it's drawn as two 180° halves joined into one path. A partial sweep
  // (e.g. the 180° gauge) is just one arc command.
  const path = isFullCircle
    ? [
        describeArc(cx, cy, r, startAngle, startAngle + 179.99),
        describeArc(cx, cy, r, startAngle + 180, startAngle + 359.99),
      ].join(" ")
    : describeArc(cx, cy, r, startAngle, startAngle + sweepAngle);

  const pathLength = (sweepAngle * Math.PI * r) / 180;

  // Progress is always driven through an Animated.Value — when `animated`
  // is false it's just set instantly (no visible difference from a plain
  // value), which keeps this to one code path instead of two.
  const progressAnim = useRef(new Animated.Value(clamped)).current;
  useEffect(() => {
    if (!animated) {
      progressAnim.setValue(clamped);
      return;
    }
    Animated.timing(progressAnim, {
      toValue: clamped,
      duration: 500,
      useNativeDriver: false, // SVG stroke props aren't supported by the native driver
    }).start();
  }, [clamped, animated]);

  const dashOffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [pathLength, 0],
  });

  return (
    <View style={{ width: size, height: canvasHeight }}>
      <Svg width={size} height={canvasHeight}>
        {gradient && (
          <Defs>
            <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={gradient[0]} />
              <Stop offset="100%" stopColor={gradient[1]} />
            </LinearGradient>
          </Defs>
        )}
        <Path d={path} stroke={trackColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
        <AnimatedPath
          d={path}
          stroke={gradient ? `url(#${gradientId})` : color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={dashOffset}
        />
      </Svg>
      {children && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </View>
      )}
    </View>
  );
}
