/**
 * Base-4 spacing scale.
 * Usage: spacing[4] → 16, spacing[6] → 24, etc.
 */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

/** Reusable shadow style shape (iOS + Android). */
export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

const zeroShadow: ShadowStyle = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0,
  shadowRadius: 0,
  elevation: 0,
};

/**
 * Cross-platform shadow presets.
 * shadowColor / shadowOffset / shadowOpacity / shadowRadius → iOS
 * elevation → Android
 */
export const shadows = {
  /** @deprecated Use `shadows.modal` or `shadows.glow()` instead. Zeroed out — the new design language uses glow, not box shadows. */
  sm: { ...zeroShadow },
  /** @deprecated Use `shadows.modal` or `shadows.glow()` instead. Zeroed out — the new design language uses glow, not box shadows. */
  md: { ...zeroShadow },
  /** @deprecated Use `shadows.modal` or `shadows.glow()` instead. Zeroed out — the new design language uses glow, not box shadows. */
  lg: { ...zeroShadow },
  /** @deprecated Use `shadows.modal` or `shadows.glow()` instead. Zeroed out — the new design language uses glow, not box shadows. */
  xl: { ...zeroShadow },

  /** Elevated modal / bottom-sheet shadow. */
  modal: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 24,
  } as ShadowStyle,

  /**
   * Colored glow effect for tabs, buttons, and other interactive elements.
   * @param color  - glow color (e.g. brand accent)
   * @param radius - blur radius (default 20)
   * @param opacity - shadow opacity 0-1 (default 0.45)
   */
  glow(color: string, radius = 20, opacity = 0.45): ShadowStyle {
    return {
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: opacity,
      shadowRadius: radius,
      elevation: 0,
    };
  },
};
