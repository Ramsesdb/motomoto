import type { ChannelType } from '@/types';
import type { UserStatus } from '@/types';

// ─── Theme color shape ───────────────────────────────────────────────────────

export interface ThemeColors {
  // Material 3 surface system
  surfaceBackground: string;
  surface: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  surfaceBright: string;
  surfaceTint: string;

  // Content-on-surface
  onSurface: string;
  onSurfaceVariant: string;

  // Primary
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  primaryFixed: string;
  primaryFixedDim: string;

  // Secondary
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  secondaryFixed: string;
  secondaryFixedDim: string;

  // Tertiary
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  tertiaryFixed: string;
  tertiaryFixedDim: string;

  // Error
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  // Outline
  outline: string;
  outlineVariant: string;

  // Inverse
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;

  // Glass system (derived, for GlassCard convenience)
  glass: {
    background: string;
    highlight: string;
  };

  // Channel brand colors
  channel: Record<ChannelType, string>;

  // Status indicator colors
  status: Record<UserStatus, string>;

  // Legacy text convenience aliases (maps to M3 tokens)
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    placeholder: string;
    inverse: string;
    link: string;
  };

  // Legacy accent convenience aliases (maps to M3 tokens)
  accent: {
    primary: string;
    primaryMuted: string;
    success: string;
    successMuted: string;
    warning: string;
    warningMuted: string;
    error: string;
    errorMuted: string;
    info: string;
    infoMuted: string;
    purple: string;
    purpleMuted: string;
  };

  // Legacy separator aliases
  separator: {
    opaque: string;
    transparent: string;
  };

  // Legacy background aliases (preserved for backward compat)
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
  };
}

// ─── Dark palette ────────────────────────────────────────────────────────────

export const darkColors: ThemeColors = {
  // M3 surface system
  surfaceBackground: '#0A0A0A',
  surface: '#131313',
  surfaceContainerLowest: '#0E0E0E',
  surfaceContainerLow: '#1C1B1B',
  surfaceContainer: '#201F1F',
  surfaceContainerHigh: '#2A2A2A',
  surfaceContainerHighest: '#353534',
  surfaceBright: '#3A3939',
  surfaceTint: '#ADC6FF',

  onSurface: '#E5E2E1',
  onSurfaceVariant: '#C1C6D7',

  primary: '#ADC6FF',
  onPrimary: '#002E69',
  primaryContainer: '#4B8EFF',
  onPrimaryContainer: '#00285C',
  primaryFixed: '#D8E2FF',
  primaryFixedDim: '#ADC6FF',

  secondary: '#E9B3FF',
  onSecondary: '#510074',
  secondaryContainer: '#7D01B1',
  onSecondaryContainer: '#E5A9FF',
  secondaryFixed: '#F6D9FF',
  secondaryFixedDim: '#E9B3FF',

  tertiary: '#47E266',
  onTertiary: '#003910',
  tertiaryContainer: '#00A73E',
  onTertiaryContainer: '#00320D',
  tertiaryFixed: '#6CFF82',
  tertiaryFixedDim: '#47E266',

  error: '#FFB4AB',
  onError: '#690005',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',

  outline: '#8B90A0',
  outlineVariant: '#414755',

  inverseSurface: '#E5E2E1',
  inverseOnSurface: '#313030',
  inversePrimary: '#005BC1',

  glass: {
    background: 'rgba(32, 31, 31, 0.65)',
    highlight: 'rgba(65, 71, 85, 0.10)',
  },

  channel: {
    whatsapp: '#25D366',
    instagram: '#E1306C',
    facebook: '#1877F2',
    sms: '#FF9500',
    email: '#007AFF',
  },

  status: {
    online: '#47E266',
    away: '#FF9F0A',
    offline: '#8B90A0',
  },

  // Legacy aliases
  text: {
    primary: '#E5E2E1',
    secondary: '#C1C6D7',
    tertiary: '#8B90A0',
    placeholder: 'rgba(193, 198, 215, 0.50)',
    inverse: '#E5E2E1',
    link: '#ADC6FF',
  },
  accent: {
    primary: '#ADC6FF',
    primaryMuted: 'rgba(173, 198, 255, 0.20)',
    success: '#47E266',
    successMuted: 'rgba(71, 226, 102, 0.20)',
    warning: '#FF9F0A',
    warningMuted: 'rgba(255, 159, 10, 0.20)',
    error: '#FFB4AB',
    errorMuted: 'rgba(255, 180, 171, 0.20)',
    info: '#64D2FF',
    infoMuted: 'rgba(100, 210, 255, 0.20)',
    purple: '#E9B3FF',
    purpleMuted: 'rgba(233, 179, 255, 0.20)',
  },
  separator: {
    opaque: '#414755',
    transparent: 'rgba(65, 71, 85, 0.08)',
  },
  background: {
    primary: '#0A0A0A',
    secondary: '#131313',
    tertiary: '#201F1F',
    elevated: '#2A2A2A',
  },
};

// ─── Light palette ───────────────────────────────────────────────────────────

export const lightColors: ThemeColors = {
  // M3 surface system (light mode reasonable defaults)
  surfaceBackground: '#FEFBFF',
  surface: '#FEFBFF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F5F2F6',
  surfaceContainer: '#EFEDF1',
  surfaceContainerHigh: '#E9E7EB',
  surfaceContainerHighest: '#E4E1E6',
  surfaceBright: '#FEFBFF',
  surfaceTint: '#005BC1',

  onSurface: '#1C1B1E',
  onSurfaceVariant: '#44474E',

  primary: '#005BC1',
  onPrimary: '#FFFFFF',
  primaryContainer: '#D8E2FF',
  onPrimaryContainer: '#001A41',
  primaryFixed: '#D8E2FF',
  primaryFixedDim: '#ADC6FF',

  secondary: '#7D01B1',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#F6D9FF',
  onSecondaryContainer: '#2E004A',
  secondaryFixed: '#F6D9FF',
  secondaryFixedDim: '#E9B3FF',

  tertiary: '#006E26',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#6CFF82',
  onTertiaryContainer: '#002107',
  tertiaryFixed: '#6CFF82',
  tertiaryFixedDim: '#47E266',

  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',

  outline: '#74777F',
  outlineVariant: '#C4C6D0',

  inverseSurface: '#313033',
  inverseOnSurface: '#F4EFF4',
  inversePrimary: '#ADC6FF',

  glass: {
    background: 'rgba(239, 237, 241, 0.72)',
    highlight: 'rgba(196, 198, 208, 0.10)',
  },

  channel: {
    whatsapp: '#25D366',
    instagram: '#E1306C',
    facebook: '#1877F2',
    sms: '#FF9500',
    email: '#005BC1',
  },

  status: {
    online: '#006E26',
    away: '#E8940A',
    offline: '#74777F',
  },

  text: {
    primary: '#1C1B1E',
    secondary: '#44474E',
    tertiary: '#74777F',
    placeholder: 'rgba(68, 71, 78, 0.50)',
    inverse: '#FEFBFF',
    link: '#005BC1',
  },
  accent: {
    primary: '#005BC1',
    primaryMuted: 'rgba(0, 91, 193, 0.12)',
    success: '#006E26',
    successMuted: 'rgba(0, 110, 38, 0.12)',
    warning: '#E8940A',
    warningMuted: 'rgba(232, 148, 10, 0.12)',
    error: '#BA1A1A',
    errorMuted: 'rgba(186, 26, 26, 0.12)',
    info: '#32ADE6',
    infoMuted: 'rgba(50, 173, 230, 0.12)',
    purple: '#7D01B1',
    purpleMuted: 'rgba(125, 1, 177, 0.12)',
  },
  separator: {
    opaque: '#C4C6D0',
    transparent: 'rgba(196, 198, 208, 0.08)',
  },
  background: {
    primary: '#FEFBFF',
    secondary: '#FFFFFF',
    tertiary: '#EFEDF1',
    elevated: '#FFFFFF',
  },
};

/**
 * @deprecated Use `useColors()` hook instead for dynamic theming.
 * Kept for backwards compatibility during migration.
 */
export const colors = darkColors;
