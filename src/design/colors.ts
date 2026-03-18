import type { ChannelType } from '@/types';
import type { UserStatus } from '@/types';

// ─── Theme color shape ───────────────────────────────────────────────────────

export interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
  };
  glass: {
    background: string;
    border: string;
    highlight: string;
  };
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
  channel: Record<ChannelType, string>;
  status: Record<UserStatus, string>;
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    placeholder: string;
    inverse: string;
    link: string;
  };
  separator: {
    opaque: string;
    transparent: string;
  };
}

// ─── Dark palette ────────────────────────────────────────────────────────────

export const darkColors: ThemeColors = {
  background: {
    primary: '#0A0A0A',
    secondary: '#141414',
    tertiary: '#1C1C1E',
    elevated: '#2C2C2E',
  },
  glass: {
    background: 'rgba(28, 28, 30, 0.72)',
    border: 'rgba(255, 255, 255, 0.08)',
    highlight: 'rgba(255, 255, 255, 0.04)',
  },
  accent: {
    primary: '#007AFF',
    primaryMuted: 'rgba(0, 122, 255, 0.20)',
    success: '#30D158',
    successMuted: 'rgba(48, 209, 88, 0.20)',
    warning: '#FF9F0A',
    warningMuted: 'rgba(255, 159, 10, 0.20)',
    error: '#FF453A',
    errorMuted: 'rgba(255, 69, 58, 0.20)',
    info: '#64D2FF',
    infoMuted: 'rgba(100, 210, 255, 0.20)',
    purple: '#BF5AF2',
    purpleMuted: 'rgba(191, 90, 242, 0.20)',
  },
  channel: {
    whatsapp: '#25D366',
    instagram: '#E1306C',
    facebook: '#1877F2',
    sms: '#30D158',
    email: '#007AFF',
  },
  status: {
    online: '#30D158',
    away: '#FF9F0A',
    offline: '#636366',
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.60)',
    tertiary: 'rgba(255, 255, 255, 0.30)',
    placeholder: 'rgba(255, 255, 255, 0.25)',
    inverse: '#000000',
    link: '#007AFF',
  },
  separator: {
    opaque: '#38383A',
    transparent: 'rgba(255, 255, 255, 0.08)',
  },
};

// ─── Light palette ───────────────────────────────────────────────────────────

export const lightColors: ThemeColors = {
  background: {
    primary: '#F2F2F7',
    secondary: '#FFFFFF',
    tertiary: '#E5E5EA',
    elevated: '#FFFFFF',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.72)',
    border: 'rgba(0, 0, 0, 0.06)',
    highlight: 'rgba(255, 255, 255, 0.80)',
  },
  accent: {
    primary: '#007AFF',
    primaryMuted: 'rgba(0, 122, 255, 0.12)',
    success: '#28A745',
    successMuted: 'rgba(40, 167, 69, 0.12)',
    warning: '#E8940A',
    warningMuted: 'rgba(232, 148, 10, 0.12)',
    error: '#E5383B',
    errorMuted: 'rgba(229, 56, 59, 0.12)',
    info: '#32ADE6',
    infoMuted: 'rgba(50, 173, 230, 0.12)',
    purple: '#AF52DE',
    purpleMuted: 'rgba(175, 82, 222, 0.12)',
  },
  channel: {
    whatsapp: '#25D366',
    instagram: '#E1306C',
    facebook: '#1877F2',
    sms: '#28A745',
    email: '#007AFF',
  },
  status: {
    online: '#28A745',
    away: '#E8940A',
    offline: '#8E8E93',
  },
  text: {
    primary: '#000000',
    secondary: 'rgba(0, 0, 0, 0.55)',
    tertiary: 'rgba(0, 0, 0, 0.30)',
    placeholder: 'rgba(0, 0, 0, 0.25)',
    inverse: '#FFFFFF',
    link: '#007AFF',
  },
  separator: {
    opaque: '#C6C6C8',
    transparent: 'rgba(0, 0, 0, 0.06)',
  },
};

/**
 * @deprecated Use `useColors()` hook instead for dynamic theming.
 * Kept for backwards compatibility during migration.
 */
export const colors = darkColors;
