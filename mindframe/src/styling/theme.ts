// src/styling/theme.ts
//
// "Dusk" — a dark pastel palette. Backgrounds are a deep plum-indigo (not
// neutral navy/black, which is what reads as generic), and every accent is
// a desaturated pastel that stays legible on it. Pastels also let us put
// dark text on a filled accent (inkOnBrand) instead of white-on-neon.
//
// Every token name from the previous palette is preserved, so style files
// that read `colors.brand`, `radius.md`, etc. pick this up with no edits.

// ── Colors ───────────────────────────────────────────────────────────────

export const colors = {
  // Surfaces — all lean violet so gradients and artwork sit in the same family
  bg: '#120F26',
  surface: '#1C1838',
  surfaceAlt: '#272150',
  surfaceSunken: '#0E0B1E',
  overlay: 'rgba(10, 7, 24, 0.78)',
  border: '#322C5C',
  borderStrong: '#463E78',

  // Text
  ink: '#F5F1FF',
  inkOnBrand: '#17122E', // dark text for use on pastel fills
  inkMuted: '#BAB2DE',
  inkFaint: '#8C84B8',

  // Metric accents — each owns exactly one meaning app-wide. Don't reuse
  // them for unrelated chrome (see `positive` for why).
  brand: '#B7A4FF', // focus — lavender
  brandSoft: 'rgba(183, 164, 255, 0.16)',

  energy: '#FFB38A', // peach
  energySoft: 'rgba(255, 179, 138, 0.16)',

  stress: '#FF8FB4', // rose
  stressSoft: 'rgba(255, 143, 180, 0.16)',

  momentum: '#8CC7FF', // sky
  momentumSoft: 'rgba(140, 199, 255, 0.16)',

  confidence: '#FFD58F', // butter
  confidenceSoft: 'rgba(255, 213, 143, 0.16)',

  // Not a cognitive metric (a "saved" tick isn't "your energy went up"), so
  // it gets its own token rather than borrowing one of the five.
  positive: '#8BE3C5', // mint
  positiveSoft: 'rgba(139, 227, 197, 0.16)',
} as const;

// ── Semantic aliases ─────────────────────────────────────────────────────

export const semantic = {
  recovery: colors.energy,
  recoverySoft: colors.energySoft,

  focus: colors.brand,
  focusSoft: colors.brandSoft,

  motivation: colors.confidence,
  motivationSoft: colors.confidenceSoft,

  warning: colors.stress,
  warningSoft: colors.stressSoft,

  celebrate: colors.confidence,
  celebrateSoft: colors.confidenceSoft,
} as const;

// User-pickable colors (task color, avatar color). Pastels from the same
// family as the UI so a user's own choices never look pasted-in.
export const swatches = [
  colors.brand,
  colors.stress,
  colors.energy,
  colors.confidence,
  colors.positive,
  colors.momentum,
  '#9FB4FF', // periwinkle
  '#E3A8F5', // orchid
] as const;

/** "#RRGGBB" + 0–1 alpha → "rgba(r, g, b, a)". Six-digit hex only. */
export function alpha(hex: string, a: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

// ── Radius ───────────────────────────────────────────────────────────────
//
// Not uniform on purpose — radius signals hierarchy (see earlier plan).

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 32,
  pill: 999,
} as const;

// ── Spacing ──────────────────────────────────────────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

// ── Shadow ───────────────────────────────────────────────────────────────
//
// Black shadows vanish on a dark background, so `raised` is a deep violet
// that actually reads as depth here. `glow` is a colored halo for emphasis.

export const shadow = {
  raised: {
    shadowColor: '#05030F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  }),
} as const;

// ── Type ─────────────────────────────────────────────────────────────────
//
// Fraunces (a soft, slightly quirky serif) carries every headline — it's
// what makes the app feel warm and a bit storybook instead of default-UI.
// Manrope handles everything functional. Family names match the
// @expo-google-fonts packages loaded in fonts.ts.
//
// fontWeight is intentionally NOT set on these: each weight is its own
// loaded font file, and pairing a family with fontWeight makes Android
// fall back to a synthetic or system face.

export const type = {
  display: { fontFamily: 'Fraunces_700Bold', fontSize: 30, letterSpacing: -0.4 },
  title: { fontFamily: 'Fraunces_600SemiBold', fontSize: 24, letterSpacing: -0.3 },
  subtitle: { fontFamily: 'Fraunces_600SemiBold', fontSize: 18 },
  bodyStrong: { fontFamily: 'Manrope_600SemiBold', fontSize: 15 },
  body: { fontFamily: 'Manrope_400Regular', fontSize: 15 },
  caption: { fontFamily: 'Manrope_600SemiBold', fontSize: 12, letterSpacing: 0.2 },
  micro: { fontFamily: 'Manrope_500Medium', fontSize: 11 },
  // For readouts that change in place (timer, stat values): tabular figures
  // keep the digits from shifting width as they tick.
  numeral: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 24,
    fontVariant: ['tabular-nums'] as ('tabular-nums')[],
  },
} as const;
