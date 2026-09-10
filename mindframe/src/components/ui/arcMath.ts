// src/components/ui/arcMath.ts
//
// Shared circle/arc geometry for anything drawing an SVG progress ring or
// gauge. Extracted so ProgressRing and any future circular indicator share
// one implementation instead of each re-deriving it.

/** angleDeg: 0 = 3 o'clock, increasing clockwise (matches SVG's y-down space). */
export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

/**
 * SVG path `d` for an arc from startAngle to endAngle (degrees, clockwise).
 * Note: a single arc command can't describe a full 360° sweep since the
 * start and end points would coincide — callers drawing a full circle
 * should split it into two ~180° arcs joined into one path string (see
 * ProgressRing).
 */
export function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}
