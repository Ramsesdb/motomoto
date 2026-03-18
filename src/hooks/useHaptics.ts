import { Platform } from 'react-native';

/**
 * Safe haptic feedback — no-ops until the dev client is rebuilt
 * with expo-haptics native module linked.
 */
export function triggerHaptic(): void {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;

  // Lazy-import to avoid crash when module isn't linked
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Haptics = require('expo-haptics') as typeof import('expo-haptics');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
      // Native module not available — silently ignore
    });
  } catch {
    // require itself failed — module not installed
  }
}
