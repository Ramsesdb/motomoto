import React from 'react';
import {
  Pressable as RNPressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const SPRING_CONFIG = { damping: 15, stiffness: 400 } as const;
const SCALE_PRESSED = 0.96;
const SCALE_RESTING = 1;

type AnimatedPressableProps = Omit<PressableProps, 'style'> & {
  children: React.ReactNode;
  /** Style applied to the inner Animated.View (supports layout props like flexDirection). */
  style?: StyleProp<ViewStyle>;
};

/**
 * Drop-in replacement for RN `Pressable` with a Reanimated v4 spring scale
 * feedback on press. Uses `withSpring` — never the legacy `Animated` API.
 *
 * The `style` prop is applied to the inner `Animated.View` so that layout
 * properties (flexDirection, gap, padding, etc.) correctly affect children.
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
      {...rest}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </RNPressable>
  );
}
