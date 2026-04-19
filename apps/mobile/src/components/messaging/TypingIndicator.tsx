import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import { useColors } from '@/hooks/useColors';
import { borderRadius, spacing } from '@/design';
import type { ThemeColors } from '@/design';

const DOT_SIZE = 8;
const BOUNCE_HEIGHT = -6;
const DURATION = 400;

function useBounce(delay: number) {
  const y = useSharedValue(0);

  useEffect(() => {
    y.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(BOUNCE_HEIGHT, { duration: DURATION, easing: Easing.out(Easing.ease) }),
          withTiming(0, { duration: DURATION, easing: Easing.in(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, y]);

  return useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));
}

export function TypingIndicator() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const anim0 = useBounce(0);
  const anim1 = useBounce(150);
  const anim2 = useBounce(300);

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Animated.View style={[styles.dot, anim0]} />
        <Animated.View style={[styles.dot, anim1]} />
        <Animated.View style={[styles.dot, anim2]} />
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[1],
    },
    bubble: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[1],
      backgroundColor: colors.surfaceContainer,
      borderRadius: borderRadius.xl,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    dot: {
      width: DOT_SIZE,
      height: DOT_SIZE,
      borderRadius: DOT_SIZE / 2,
      backgroundColor: colors.onSurfaceVariant,
    },
  });
