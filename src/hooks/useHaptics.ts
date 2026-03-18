import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Safe haptic feedback — silently no-ops when the native module
 * isn't available (e.g. dev client built before expo-haptics was installed,
 * or Android emulator without haptics support).
 */
export function triggerHaptic(
  style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light,
): void {
  if (Platform.OS === 'web') return;
  try {
    void Haptics.impactAsync(style);
  } catch {
    // Native module not linked yet — ignore
  }
}
