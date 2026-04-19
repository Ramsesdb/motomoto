import type { ReactNode } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { useColors } from '@/hooks/useColors';

import { AuraGlow } from '@/components/ui/AuraGlow';

// ─── Props ──────────────────────────────────────────────────────────────────

export type MeshGradientVariant = 'default' | 'ai' | 'login';

export interface MeshGradientProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: MeshGradientVariant;
}

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * Full-screen mesh-gradient background container.
 *
 * Renders a base surface color with 2-3 translucent `LinearGradient`
 * circles stacked behind `children`. Three visual variants:
 *
 * - **default** — subtle blue (top-right) + purple (bottom-left)
 * - **ai** — stronger purple + blue for AI-focused screens
 * - **login** — delegates to `AuraGlow` for a bolder effect
 */
export function MeshGradient({
  children,
  style,
  variant = 'default',
}: MeshGradientProps) {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceBackground }, style]}>
      {/* Gradient layers — non-interactive */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {variant === 'login' ? <AuraGlow /> : <GradientLayers variant={variant} />}
      </View>

      {/* Content */}
      {children}
    </View>
  );
}

// ─── Internal: gradient layers per variant ───────────────────────────────────

function GradientLayers({ variant }: { variant: 'default' | 'ai' }) {
  if (variant === 'ai') {
    return (
      <>
        {/* Purple — dominant for AI screens */}
        <LinearGradient
          colors={['rgba(125,1,177,0.12)', 'rgba(125,1,177,0)']}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
          style={styles.aiPurple}
        />
        {/* Blue accent */}
        <LinearGradient
          colors={['rgba(75,142,255,0.06)', 'rgba(75,142,255,0)']}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
          style={styles.aiBlue}
        />
      </>
    );
  }

  // default variant
  return (
    <>
      {/* Blue — top-right */}
      <LinearGradient
        colors={['rgba(75,142,255,0.08)', 'rgba(75,142,255,0)']}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={styles.defaultBlue}
      />
      {/* Purple — bottom-left */}
      <LinearGradient
        colors={['rgba(125,1,177,0.05)', 'rgba(125,1,177,0)']}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={styles.defaultPurple}
      />
    </>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const ORB_LG = 500;
const ORB_MD = 450;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // default variant
  defaultBlue: {
    position: 'absolute',
    width: ORB_LG,
    height: ORB_LG,
    borderRadius: ORB_LG / 2,
    top: '-10%',
    right: '-15%',
  },
  defaultPurple: {
    position: 'absolute',
    width: ORB_MD,
    height: ORB_MD,
    borderRadius: ORB_MD / 2,
    bottom: '-5%',
    left: '-10%',
  },

  // ai variant
  aiPurple: {
    position: 'absolute',
    width: ORB_LG,
    height: ORB_LG,
    borderRadius: ORB_LG / 2,
    top: '5%',
    left: '-10%',
  },
  aiBlue: {
    position: 'absolute',
    width: ORB_MD,
    height: ORB_MD,
    borderRadius: ORB_MD / 2,
    top: '15%',
    right: '-10%',
  },
});
