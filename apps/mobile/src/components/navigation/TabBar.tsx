import React, { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors, useIsDark } from '@/hooks/useColors';
import { triggerHaptic } from '@/hooks/useHaptics';
import { spacing, typography, borderRadius, fontFamily } from '@m2/design';
import type { ThemeColors } from '@m2/design';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface TabMeta {
  icon: IconName;
  activeIcon: IconName;
  label: string;
}

const TIMING_CONFIG = { duration: 150 } as const;

const TAB_META: Record<string, TabMeta> = {
  home: { icon: 'home-outline', activeIcon: 'home', label: 'Inicio' },
  inbox: { icon: 'message-outline', activeIcon: 'message', label: 'Mensajes' },
  ai: { icon: 'robot-outline', activeIcon: 'robot', label: 'IA' },
  team: { icon: 'account-group-outline', activeIcon: 'account-group', label: 'Equipo' },
  profile: { icon: 'account-circle-outline', activeIcon: 'account-circle', label: 'Perfil' },
};

interface TabItemProps {
  routeName: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  colors: ThemeColors;
  styles: ReturnType<typeof createStyles>;
}

function TabItem({ routeName, isFocused, onPress, onLongPress, colors, styles }: TabItemProps) {
  const opacity = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const meta: TabMeta = TAB_META[routeName] ?? {
    icon: 'circle-outline' as IconName,
    activeIcon: 'circle' as IconName,
    label: routeName,
  };

  const activeColor = isFocused ? colors.primary : colors.onSurfaceVariant;

  const iconGlowStyle = isFocused && Platform.OS === 'ios'
    ? {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 4,
        shadowOpacity: 0.6,
      }
    : undefined;

  return (
    <Pressable
      onPress={() => {
        triggerHaptic();
        onPress();
      }}
      onLongPress={onLongPress}
      onPressIn={() => { opacity.value = withTiming(0.7, TIMING_CONFIG); }}
      onPressOut={() => { opacity.value = withTiming(1, TIMING_CONFIG); }}
      style={styles.tabItem}
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
    >
      <Animated.View style={[styles.tabInner, animStyle]}>
        <View style={iconGlowStyle}>
          <MaterialCommunityIcons
            name={isFocused ? meta.activeIcon : meta.icon}
            size={22}
            color={activeColor}
          />
        </View>
        <Text style={[styles.label, { color: activeColor }, isFocused && styles.labelActive]} numberOfLines={1}>
          {meta.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const HIDDEN_TABS = new Set(['reports', 'settings']);

export function TabBar({ state, navigation, descriptors }: BottomTabBarProps) {
  const colors = useColors();
  const isDark = useIsDark();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const paddingBottom = Math.max(insets.bottom, spacing[2]);

  // Filter out routes hidden via href: null or in the HIDDEN_TABS set
  const visibleRoutes = state.routes.filter((route) => {
    if (HIDDEN_TABS.has(route.name)) return false;
    const descriptor = descriptors[route.key];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const href = (descriptor?.options as any)?.href;
    return href !== null;
  });

  const content = (
    <View style={[styles.inner, { paddingBottom }]}>
      {visibleRoutes.map((route) => {
        const isFocused = state.routes[state.index]?.key === route.key;
        function onPress() {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            navigation.navigate(route.name as any, route.params as any);
          }
        }
        function onLongPress() {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        }
        return (
          <TabItem
            key={route.key}
            routeName={route.name}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            colors={colors}
            styles={styles}
          />
        );
      })}
    </View>
  );

  if (Platform.OS !== 'android') {
    return (
      <View style={styles.outerContainer}>
        <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.container}>
          <View style={styles.backgroundOverlay} />
          {content}
        </BlurView>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.container, styles.androidBg]}>
        <View style={styles.backgroundOverlay} />
        {content}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    outerContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: spacing[4],
      paddingBottom: spacing[2],
    },
    container: {
      borderRadius: borderRadius['2xl'],
      overflow: 'hidden',
    },
    backgroundOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.surfaceContainer,
      opacity: 0.7,
    },
    androidBg: { backgroundColor: colors.background.secondary },
    inner: { flexDirection: 'row', paddingTop: spacing[2] },
    tabItem: { flex: 1, alignItems: 'center' },
    tabInner: { alignItems: 'center', gap: spacing[1], position: 'relative' },
    label: {
      ...typography.labelSmall,
      fontFamily: fontFamily.bodyRegular,
    },
    labelActive: {
      fontFamily: fontFamily.bodyMedium,
    },
  });
