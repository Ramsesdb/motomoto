import type { ChannelType } from '@/types';
import type { UserStatus } from '@/types';

export const colors = {
  background: {
    /** Main app background */
    primary: '#0A0A0A',
    /** Cards, sheets */
    secondary: '#141414',
    /** Elevated surfaces (modals, popovers) */
    tertiary: '#1C1C1E',
    /** Highest elevation — tooltips, overlays */
    elevated: '#2C2C2E',
  },

  glass: {
    /** Semi-transparent background for BlurView overlays */
    background: 'rgba(28, 28, 30, 0.72)',
    /** Subtle border on glass surfaces */
    border: 'rgba(255, 255, 255, 0.08)',
    /** Inner highlight on glass surface top edge */
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

  /** One brand color per channel — exhaustive over ChannelType */
  channel: {
    whatsapp: '#25D366',
    instagram: '#E1306C',
    facebook: '#1877F2',
    sms: '#30D158',
    email: '#007AFF',
  } satisfies Record<ChannelType, string>,

  /** One indicator color per user presence status */
  status: {
    online: '#30D158',
    away: '#FF9F0A',
    offline: '#636366',
  } satisfies Record<UserStatus, string>,

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
} as const;
