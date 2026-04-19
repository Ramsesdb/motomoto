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
  withTiming,
} from 'react-native-reanimated';

type AnimatedPressableProps = Omit<PressableProps, 'style'> & {
  children: React.ReactNode;
  /** Style applied to the inner Animated.View (supports layout props like flexDirection). */
  style?: StyleProp<ViewStyle>;
};

/**
 * Drop-in replacement for RN `Pressable` with a Reanimated v4 opacity fade
 * feedback on press. Uses `withTiming` — never the legacy `Animated` API.
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
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <RNPressable
      onPressIn={(e) => {
        opacity.value = withTiming(0.7, { duration: 100 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        opacity.value = withTiming(1, { duration: 150 });
        onPressOut?.(e);
      }}
      {...rest}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </RNPressable>
  );
}
