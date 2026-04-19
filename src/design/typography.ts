import { Platform } from 'react-native';

/**
 * Font families — loaded via @expo-google-fonts.
 *
 * Display & Headline use Manrope; Body & Label use Inter.
 * System fallbacks are used while custom fonts load.
 */
export const fontFamily = {
  // Display & Headline (Manrope)
  displayRegular: 'Manrope_400Regular',
  displayMedium: 'Manrope_500Medium',
  displaySemiBold: 'Manrope_600SemiBold',
  displayBold: 'Manrope_700Bold',
  displayExtraBold: 'Manrope_800ExtraBold',
  // Body & Label (Inter)
  bodyRegular: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  // System fallbacks (used while fonts load)
  systemRegular: Platform.OS === 'android' ? 'Roboto' : undefined,
  systemMedium: Platform.OS === 'android' ? 'Roboto_medium' : undefined,
  systemBold: Platform.OS === 'android' ? 'Roboto_bold' : undefined,
} as const;

/**
 * Resolved font family — swaps to system fallback if custom fonts are not yet loaded.
 *
 * @param loaded - Whether custom fonts have finished loading
 * @param custom - The custom font name (e.g. fontFamily.displayBold)
 * @param fallback - The system fallback font (e.g. fontFamily.systemBold)
 * @returns The font name to use, or `undefined` for platform default
 */
export function resolvedFont(
  loaded: boolean,
  custom: string | undefined,
  fallback: string | undefined,
): string | undefined {
  return loaded ? custom : fallback;
}

/**
 * Material 3 typography scale + legacy iOS HIG aliases.
 *
 * M3 entries do NOT include `fontFamily` — components apply fontFamily separately
 * via the `fontFamily` export and `resolvedFont` utility.
 */
export const typography = {
  // ─── Display scale (Manrope) ───────────────────────────────
  displayLarge: {
    fontSize: 56,
    lineHeight: 64,
    fontWeight: '800' as const,
    letterSpacing: -0.02 * 56, // -1.12
  },
  displayMedium: {
    fontSize: 45,
    lineHeight: 52,
    fontWeight: '700' as const,
    letterSpacing: -0.02 * 45,
  },
  displaySmall: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700' as const,
    letterSpacing: -0.02 * 36,
  },

  // ─── Headline scale (Manrope) ─────────────────────────────
  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.02 * 32,
  },
  headlineMedium: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '600' as const,
    letterSpacing: -0.02 * 28,
  },
  headlineSmall: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
    letterSpacing: -0.02 * 24,
  },

  // ─── Title scale (Manrope) ────────────────────────────────
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
    letterSpacing: -0.02 * 22,
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },

  // ─── Body scale (Inter) ───────────────────────────────────
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
  },

  // ─── Label scale (Inter) ──────────────────────────────────
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
  },

  // ─── Legacy iOS HIG aliases (backward compat) ─────────────
  /** @deprecated Use displaySmall */
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '400' as const,
    letterSpacing: 0.37,
  },
  /** @deprecated Use headlineMedium */
  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '400' as const,
    letterSpacing: 0.36,
  },
  /** @deprecated Use titleLarge */
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '400' as const,
    letterSpacing: 0.35,
  },
  /** @deprecated Use titleMedium */
  title3: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '400' as const,
    letterSpacing: 0.38,
  },
  /** @deprecated Use titleMedium with weight 600 */
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.41,
  },
  /** @deprecated Use bodyLarge */
  body: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400' as const,
    letterSpacing: -0.41,
  },
  /** @deprecated Use bodyLarge */
  callout: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400' as const,
    letterSpacing: -0.32,
  },
  /** @deprecated Use bodyMedium */
  subhead: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400' as const,
    letterSpacing: -0.24,
  },
  /** @deprecated Use bodySmall */
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
    letterSpacing: -0.08,
  },
  /** @deprecated Use labelMedium */
  caption1: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  /** @deprecated Use labelSmall */
  caption2: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '400' as const,
    letterSpacing: 0.07,
  },
} as const;
