// src/components/art/SceneArt.tsx
//
// The app's artwork, drawn in code with react-native-svg so there are no
// image assets to export, size, or keep in sync with the palette.
//
// Every coordinate is derived from the width/height passed in (rather than
// a fixed viewBox that gets cropped), so the same scene composes correctly
// as a wide header banner and as a tall arch-shaped onboarding frame.
//
// The sky's top edge and the front-most hill are both colors.bg, so a scene
// placed on a screen melts into it with no visible edge.

import React, { useMemo, useRef } from "react";
import Svg, { Circle, Defs, Line, LinearGradient, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import { colors } from "../../styling/theme";
import { METRIC_COLORS } from "../../styling/statsTheme";

export type SceneVariant = "dusk" | "dawn" | "night" | "constellation";

interface SceneArtProps {
  variant: SceneVariant;
  width: number;
  height: number;
}

interface Palette {
  skyMid: string;
  skyHorizon: string;
  glow: string;
  backHill: string;
  midHill: string;
  tree: string;
}

const NIGHT: Palette = {
  skyMid: "#1F1A4A",
  skyHorizon: "#3A2F78",
  glow: colors.brand,
  backHill: "#322A6B",
  midHill: "#251F52",
  tree: "#1A1540",
};

const PALETTES: Record<SceneVariant, Palette> = {
  dusk: {
    skyMid: "#2B2163",
    skyHorizon: "#6A3F86",
    glow: colors.energy,
    backHill: "#4A3580",
    midHill: "#33265F",
    tree: "#241C52",
  },
  dawn: {
    skyMid: "#3A2A6A",
    skyHorizon: "#B45F86",
    glow: colors.stress,
    backHill: "#7A4A86",
    midHill: "#4A3274",
    tree: "#2F2260",
  },
  night: NIGHT,
  constellation: NIGHT,
};

// ── Deterministic helpers ────────────────────────────────────────────────
// Stars use a seeded generator so a scene looks identical on every render
// and every device, rather than re-scattering whenever it re-renders.

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hillY(x: number, w: number, base: number, amp: number, phase: number) {
  const t = x / w;
  return (
    base +
    amp * Math.sin(t * Math.PI * 2 * 0.9 + phase) +
    amp * 0.45 * Math.sin(t * Math.PI * 2 * 2.1 + phase * 1.7)
  );
}

function hillPath(w: number, h: number, base: number, amp: number, phase: number) {
  const steps = 56;
  let d = `M0,${h}`;
  for (let i = 0; i <= steps; i++) {
    const x = (w * i) / steps;
    d += ` L${x.toFixed(1)},${hillY(x, w, base, amp, phase).toFixed(1)}`;
  }
  return `${d} L${w},${h} Z`;
}

interface Star {
  x: number;
  y: number;
  r: number;
  o: number;
  c: string;
}

function buildStars(
  w: number,
  horizon: number,
  variant: SceneVariant,
  avoid: { x: number; y: number; r: number } | null
): Star[] {
  const rand = seeded(variant.length * 97 + 13);
  const density = variant === "night" || variant === "constellation" ? 1000 : 1500;
  const count = Math.round((w * horizon) / density);
  const stars: Star[] = [];

  for (let i = 0; i < count; i++) {
    const x = rand() * w;
    const y = rand() * horizon * 0.85;
    const pick = rand();
    const star: Star = {
      x,
      y,
      r: 0.5 + rand() * 0.9,
      o: 0.3 + rand() * 0.6,
      c:
        pick < 0.7 ? "#FFFFFF"
        : pick < 0.82 ? colors.brand
        : pick < 0.92 ? colors.energy
        : colors.confidence,
    };
    // Keep the moon's halo clear of stars.
    if (avoid && Math.hypot(x - avoid.x, y - avoid.y) < avoid.r * 3) continue;
    stars.push(star);
  }
  return stars;
}

// Orb positions as fractions of (width, horizon). Order matches the five
// metrics so the constellation is literally the user's state.
const ORB_LAYOUT: [number, number][] = [
  [0.16, 0.55],
  [0.34, 0.32],
  [0.52, 0.5],
  [0.7, 0.28],
  [0.86, 0.48],
];
const ORB_COLORS = [
  METRIC_COLORS.stressLevel,
  METRIC_COLORS.energyLevel,
  METRIC_COLORS.focusLevel,
  METRIC_COLORS.momentum,
  METRIC_COLORS.confidence,
];

const TREE_SPOTS = [0.1, 0.19, 0.27, 0.72, 0.81, 0.9];

let nextSceneId = 0;

// ── Scene ────────────────────────────────────────────────────────────────

export function SceneArt({ variant, width: w, height: h }: SceneArtProps) {
  // SVG gradient ids are global to the app's SVG tree, so every instance
  // needs its own or two scenes on screen would share (and corrupt) each
  // other's gradients.
  const idRef = useRef<string | null>(null);
  if (!idRef.current) idRef.current = `scene${nextSceneId++}`;
  const id = idRef.current;

  const p = PALETTES[variant];
  const horizon = h * 0.64;

  const hasMoon = variant === "dusk" || variant === "night";
  const moonR = Math.max(9, Math.min(20, h * 0.085));
  const moon = hasMoon
    ? variant === "dusk"
      ? { x: w * 0.78, y: horizon * 0.42, r: moonR }
      : { x: w * 0.22, y: horizon * 0.4, r: moonR }
    : null;

  const sun =
    variant === "dawn"
      ? { x: w * 0.74, y: horizon + h * 0.02, r: Math.max(14, h * 0.13) }
      : null;

  const stars = useMemo(
    () => buildStars(w, horizon, variant, moon),
    [w, horizon, variant, moon?.x, moon?.y, moon?.r]
  );

  const orbs =
    variant === "constellation"
      ? ORB_LAYOUT.map(([fx, fy], i) => ({ x: w * fx, y: horizon * fy, color: ORB_COLORS[i] }))
      : [];

  const back = { base: h * 0.66, amp: h * 0.07, phase: 0.6 };
  const mid = { base: h * 0.79, amp: h * 0.055, phase: 2.1 };
  const front = { base: h * 0.93, amp: h * 0.035, phase: 4.0 };

  return (
    <Svg width={w} height={h}>
      <Defs>
        <LinearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.bg} />
          <Stop offset="0.5" stopColor={p.skyMid} />
          <Stop offset="1" stopColor={p.skyHorizon} />
        </LinearGradient>
        <RadialGradient id={`${id}glow`} cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor={p.glow} stopOpacity="0.55" />
          <Stop offset="1" stopColor={p.glow} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id={`${id}moonHalo`} cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor={colors.confidence} stopOpacity="0.45" />
          <Stop offset="1" stopColor={colors.confidence} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id={`${id}sunHalo`} cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor={colors.energy} stopOpacity="0.6" />
          <Stop offset="1" stopColor={colors.energy} stopOpacity="0" />
        </RadialGradient>
        {orbs.map((o, i) => (
          <RadialGradient key={i} id={`${id}orb${i}`} cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor={o.color} stopOpacity="0.55" />
            <Stop offset="1" stopColor={o.color} stopOpacity="0" />
          </RadialGradient>
        ))}
      </Defs>

      {/* Sky + horizon glow */}
      <Rect x={0} y={0} width={w} height={h} fill={`url(#${id}sky)`} />
      <Circle cx={w * 0.5} cy={horizon} r={w * 0.7} fill={`url(#${id}glow)`} />

      {/* Stars */}
      {stars.map((s, i) => (
        <Circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.c} opacity={s.o} />
      ))}

      {/* Moon */}
      {moon && (
        <>
          <Circle cx={moon.x} cy={moon.y} r={moon.r * 4} fill={`url(#${id}moonHalo)`} />
          <Circle cx={moon.x} cy={moon.y} r={moon.r} fill={colors.confidence} />
          <Circle cx={moon.x - moon.r * 0.3} cy={moon.y - moon.r * 0.2} r={moon.r * 0.22} fill="#E9C47E" opacity={0.55} />
          <Circle cx={moon.x + moon.r * 0.35} cy={moon.y + moon.r * 0.3} r={moon.r * 0.15} fill="#E9C47E" opacity={0.45} />
        </>
      )}

      {/* Sun — drawn before the hills so they cover its lower half */}
      {sun && (
        <>
          <Circle cx={sun.x} cy={sun.y} r={sun.r * 3.5} fill={`url(#${id}sunHalo)`} />
          <Circle cx={sun.x} cy={sun.y} r={sun.r} fill={colors.energy} />
        </>
      )}

      {/* Constellation of the five metrics */}
      {orbs.slice(1).map((o, i) => (
        <Line
          key={`l${i}`}
          x1={orbs[i].x}
          y1={orbs[i].y}
          x2={o.x}
          y2={o.y}
          stroke="#FFFFFF"
          strokeOpacity={0.2}
          strokeWidth={1}
        />
      ))}
      {orbs.map((o, i) => (
        <React.Fragment key={`o${i}`}>
          <Circle cx={o.x} cy={o.y} r={16} fill={`url(#${id}orb${i})`} />
          <Circle cx={o.x} cy={o.y} r={4.5} fill={o.color} />
        </React.Fragment>
      ))}

      {/* Hills, back to front */}
      <Path d={hillPath(w, h, back.base, back.amp, back.phase)} fill={p.backHill} />
      <Path d={hillPath(w, h, mid.base, mid.amp, mid.phase)} fill={p.midHill} />
      {TREE_SPOTS.map((fx, i) => {
        const x = w * fx;
        const y = hillY(x, w, mid.base, mid.amp, mid.phase) + 1;
        const th = h * (0.1 + (i % 3) * 0.015);
        const tw = th * 0.32;
        return (
          <Path
            key={`t${i}`}
            d={`M${x},${y - th} L${x - tw},${y - th * 0.35} L${x + tw},${y - th * 0.35} Z M${x},${y - th * 0.7} L${x - tw * 1.25},${y} L${x + tw * 1.25},${y} Z`}
            fill={p.tree}
          />
        );
      })}
      <Path d={hillPath(w, h, front.base, front.amp, front.phase)} fill={colors.bg} />
    </Svg>
  );
}

// ── Orb glow ─────────────────────────────────────────────────────────────
// A soft radial halo, used behind the break timer dial.

export function OrbGlow({ size, color, opacity = 0.3 }: { size: number; color: string; opacity?: number }) {
  const idRef = useRef<string | null>(null);
  if (!idRef.current) idRef.current = `orbGlow${nextSceneId++}`;
  const id = idRef.current;

  return (
    <Svg width={size} height={size}>
      <Defs>
        <RadialGradient id={id} cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor={color} stopOpacity={opacity} />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
    </Svg>
  );
}
