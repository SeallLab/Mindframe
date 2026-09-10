// src/styling/theme.ts
//
// Single source of truth for color, radius, shadow, spacing, and type
// tokens. Every *.styles.ts file reads from here — no raw hex values, radii,
// or shadow configs in component-level style files.

// ── Colors ───────────────────────────────────────────────────────────────

export const colors = {
  // Surfaces
  bg: '#0C0D1F',
  surface: '#15172E',
  surfaceAlt: '#1D1F3B',
  surfaceSunken: '#0F1026',
  overlay: 'rgba(4, 5, 15, 0.75)',
  border: '#2A2C4D',
  borderStrong: '#3A3D66',

  // Text
  ink: '#F3F3FA',
  inkOnBrand: '#0C0D1F',
  inkMuted: '#9A9BC0',
  inkFaint: '#63648C',

  // Metric accents — each owns exactly one meaning app-wide (stress,
  // energy, focus, momentum, confidence). Don't reuse these for unrelated
  // UI chrome — see `positive` below for why that matters.
  brand: '#8B6BF2', // focus
  brandSoft: 'rgba(139, 107, 242, 0.15)',

  energy: '#FF7A45',
  energySoft: 'rgba(255, 122, 69, 0.15)',

  stress: '#F5457A',
  stressSoft: 'rgba(245, 69, 122, 0.15)',

  momentum: '#4FA0FF',
  momentumSoft: 'rgba(79, 160, 255, 0.15)',

  confidence: '#FFC24B',
  confidenceSoft: 'rgba(255, 194, 75, 0.15)',

  // A save-confirmation checkmark isn't a cognitive metric — it doesn't
  // belong to stress/energy/focus/momentum/confidence, so it gets its own
  // token instead of borrowing one of theirs (e.g. `energy`, which would
  // read as "your energy went up," not "this saved").
  positive: '#5FD9A0',
} as const;

// ── Semantic aliases ─────────────────────────────────────────────────────
//
// Recommendation categories (HomeScreen's CATEGORY_STYLE) are a different
// axis from the five state metrics — "this card is about recovery" isn't
// the same claim as "energyLevel is low" — but they map onto the same
// underlying colors, so they're aliased here rather than given a second,
// independent palette.

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

// ── Radius ───────────────────────────────────────────────────────────────
//
// Deliberately not uniform — radius signals hierarchy. Hero/modal surfaces
// get the largest radius, standard cards/rows a mid radius, small controls
// (inputs, small badges) the smallest, chips/pills are fully round.

export const radius = {
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
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
// Only floating/emphasis surfaces (modals, the break mini-bar, toasts) get
// a shadow at all — plain cards and list rows use a `border` hairline
// instead (see radius comment above; same "hierarchy, not uniformity"
// rule). `glow` is for the rarer case of a colored emphasis glow (e.g. one
// state-driven dot or active ring) — pass the metric/accent color in.

export const shadow = {
  raised: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 6,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 8,
  }),
} as const;

// ── Type ─────────────────────────────────────────────────────────────────
//
// Two families, distinct roles: Space Grotesk for headlines/titles (its
// squared-off letterforms are what should make headers feel deliberate
// rather than default-system-font), Manrope for everything else. Register
// both via expo-font / useFonts before use — these tokens assume the family
// names below are the ones you load under.
//
// No role here uses textTransform: 'uppercase' — that's applied (or not)
// per-component, and intentionally isn't the default (see design plan:
// avoid the all-caps-eyebrow-label tell).

export const type = {
  display: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontWeight: '700' as const,
    fontSize: 28,
    letterSpacing: -0.5,
  },
  title: {
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: '700' as const,
    fontSize: 22,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontWeight: '600' as const,
    fontSize: 18,
  },
  bodyStrong: {
    fontFamily: 'Manrope-SemiBold',
    fontWeight: '600' as const,
    fontSize: 15,
  },
  body: {
    fontFamily: 'Manrope-Regular',
    fontWeight: '400' as const,
    fontSize: 15,
  },
  caption: {
    fontFamily: 'Manrope-SemiBold',
    fontWeight: '600' as const,
    fontSize: 12,
    letterSpacing: 0.2,
  },
  micro: {
    fontFamily: 'Manrope-Medium',
    fontWeight: '500' as const,
    fontSize: 11,
  },
} as const;