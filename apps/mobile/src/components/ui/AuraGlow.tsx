import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

// ─── Props ──────────────────────────────────────────────────────────────────

export interface AuraGlowProps {
  style?: StyleProp<ViewStyle>;
}

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * Decorative radial-style glow overlay built from two overlapping
 * `LinearGradient` circles (purple + blue). Renders as an absolute-fill
 * layer with `pointerEvents="none"` so it never blocks touches.
 */
export function AuraGlow({ style }: AuraGlowProps) {
  return (
    <View style={[StyleSheet.absoluteFill, style]} pointerEvents="none">
      {/* Purple glow — centered ~50% horizontal, ~40% vertical */}
      <LinearGradient
        colors={['rgba(125,1,177,0.3)', 'rgba(125,1,177,0)']}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={styles.purpleOrb}
      />

      {/* Blue glow — slightly offset from purple */}
      <LinearGradient
        colors={['rgba(75,142,255,0.2)', 'rgba(75,142,255,0)']}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={styles.blueOrb}
      />
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const ORB_SIZE_PURPLE = 500;
const ORB_SIZE_BLUE = 450;

const styles = StyleSheet.create({
  purpleOrb: {
    position: 'absolute',
    width: ORB_SIZE_PURPLE,
    height: ORB_SIZE_PURPLE,
    borderRadius: ORB_SIZE_PURPLE / 2,
    top: '20%',
    left: '0%',
  },
  blueOrb: {
    position: 'absolute',
    width: ORB_SIZE_BLUE,
    height: ORB_SIZE_BLUE,
    borderRadius: ORB_SIZE_BLUE / 2,
    top: '30%',
    left: '15%',
  },
});
