import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '@/design';

// ─── Types ────────────────────────────────────────────────────────────────────

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface TabMeta {
  icon: IconName;
  activeIcon: IconName;
  label: string;
}

// ─── Tab configuration ────────────────────────────────────────────────────────

const SPRING = { damping: 15, stiffness: 400 } as const;

const TAB_META: Record<string, TabMeta> = {
  home: { icon: 'home-outline', activeIcon: 'home', label: 'Inicio' },
  inbox: { icon: 'message-outline', activeIcon: 'message', label: 'Mensajes' },
  ai: { icon: 'robot-outline', activeIcon: 'robot', label: 'IA' },
  team: {
    icon: 'account-group-outline',
    activeIcon: 'account-group',
    label: 'Equipo',
  },
  reports: { icon: 'chart-bar', activeIcon: 'chart-bar', label: 'Reportes' },
  profile: {
    icon: 'account-circle-outline',
    activeIcon: 'account-circle',
    label: 'Perfil',
  },
  settings: { icon: 'cog-outline', activeIcon: 'cog', label: 'Ajustes' },
};

// ─── TabItem ──────────────────────────────────────────────────────────────────

interface TabItemProps {
  routeName: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

function TabItem({ routeName, isFocused, onPress, onLongPress }: TabItemProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const meta: TabMeta = TAB_META[routeName] ?? {
    icon: 'circle-outline' as IconName,
    activeIcon: 'circle' as IconName,
    label: routeName,
  };

  const activeColor = isFocused ? colors.accent.primary : colors.text.tertiary;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        scale.value = withSpring(0.82, SPRING);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, SPRING);
      }}
      style={styles.tabItem}
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
    >
      <Animated.View style={[styles.tabInner, animStyle]}>
        <MaterialCommunityIcons
          name={isFocused ? meta.activeIcon : meta.icon}
          size={24}
          color={activeColor}
        />
        <Text style={[styles.label, { color: activeColor }]} numberOfLines={1}>
          {meta.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ─── TabBar ───────────────────────────────────────────────────────────────────

/**
 * Custom bottom tab bar with:
 * - iOS: BlurView (intensity 80, dark tint) background
 * - Android: solid `background.secondary` surface
 * - Per-tab spring scale animation via Reanimated v4 withSpring
 * - Respects safe area insets for bottom padding
 */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const paddingBottom = Math.max(insets.bottom, spacing[2]);

  const content = (
    <View style={[styles.inner, { paddingBottom }]}>
      {state.routes.map((route) => {
        const isFocused = state.routes[state.index]?.key === route.key;

        function onPress() {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
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
          />
        );
      })}
    </View>
  );

  if (Platform.OS !== 'android') {
    return (
      <BlurView intensity={80} tint="dark" style={styles.container}>
        <View style={styles.borderTop} />
        {content}
      </BlurView>
    );
  }

  return (
    <View style={[styles.container, styles.androidBg]}>
      <View style={styles.borderTop} />
      {content}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  androidBg: {
    backgroundColor: colors.background.secondary,
  },
  borderTop: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator.transparent,
  },
  inner: {
    flexDirection: 'row',
    paddingTop: spacing[2],
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    gap: spacing[1],
  },
  label: {
    ...typography.caption2,
  },
});
