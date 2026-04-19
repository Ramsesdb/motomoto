import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { darkColors, lightColors, type ThemeColors } from '@/design/colors';
import { useThemeStore } from '@/store/useThemeStore';

/**
 * Returns the active color palette based on:
 * 1. User preference from ThemeStore ('light' | 'dark' | 'system')
 * 2. System color scheme (when preference is 'system')
 *
 * Usage: `const colors = useColors();`
 */
export function useColors(): ThemeColors {
  const preference = useThemeStore((s) => s.preference);
  const systemScheme = useColorScheme();

  return useMemo(() => {
    if (preference === 'light') return lightColors;
    if (preference === 'dark') return darkColors;
    // 'system' — follow device setting, default to dark
    return systemScheme === 'light' ? lightColors : darkColors;
  }, [preference, systemScheme]);
}

/**
 * Returns true when the resolved theme is dark.
 */
export function useIsDark(): boolean {
  const preference = useThemeStore((s) => s.preference);
  const systemScheme = useColorScheme();

  return useMemo(() => {
    if (preference === 'dark') return true;
    if (preference === 'light') return false;
    return systemScheme !== 'light';
  }, [preference, systemScheme]);
}
