import React from 'react';
import { Pressable as RNPressable, type PressableProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const SPRING_CONFIG = { damping: 15, stiffness: 400 } as const;
const SCALE_PRESSED = 0.96;
const SCALE_RESTING = 1;

type AnimatedPressableProps = PressableProps & {
  children: React.ReactNode;
};

/**
 * Drop-in replacement for RN `Pressable` with a Reanimated v4 spring scale
 * feedback on press. Uses `withSpring` — never the legacy `Animated` API.
 *
 * All standard `PressableProps` are forwarded to the underlying `Pressable`.
 */
export function Pressable({
  children,
  onPressIn,
  onPressOut,
  style,
  ...rest
}: AnimatedPressableProps) {
  const scale = useSharedValue(SCALE_RESTING);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <RNPressable
      onPressIn={(e) => {
        scale.value = withSpring(SCALE_PRESSED, SPRING_CONFIG);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(SCALE_RESTING, SPRING_CONFIG);
        onPressOut?.(e);
      }}
      style={style}
      {...rest}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </RNPressable>
  );
}
