import React, { useMemo } from 'react';
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
import { useColors, useIsDark } from '@/hooks/useColors';
import { triggerHaptic } from '@/hooks/useHaptics';
import { spacing, typography, borderRadius } from '@/design';
import type { ThemeColors } from '@/design';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface TabMeta {
  icon: IconName;
  activeIcon: IconName;
  label: string;
}

const SPRING = { damping: 15, stiffness: 400 } as const;

const TAB_META: Record<string, TabMeta> = {
  home: { icon: 'home-outline', activeIcon: 'home', label: 'Inicio' },
  inbox: { icon: 'message-outline', activeIcon: 'message', label: 'Mensajes' },
  ai: { icon: 'robot-outline', activeIcon: 'robot', label: 'IA' },
  reports: { icon: 'chart-bar', activeIcon: 'chart-bar', label: 'Reportes' },
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
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const meta: TabMeta = TAB_META[routeName] ?? {
    icon: 'circle-outline' as IconName,
    activeIcon: 'circle' as IconName,
    label: routeName,
  };

  const activeColor = isFocused ? colors.accent.primary : colors.text.tertiary;

  return (
    <Pressable
      onPress={() => {
        triggerHaptic();
        onPress();
      }}
      onLongPress={onLongPress}
      onPressIn={() => { scale.value = withSpring(0.85, SPRING); }}
      onPressOut={() => { scale.value = withSpring(1, SPRING); }}
      style={styles.tabItem}
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
    >
      <Animated.View style={[styles.tabInner, animStyle]}>
        {isFocused && <View style={styles.activePill} />}
        <MaterialCommunityIcons
          name={isFocused ? meta.activeIcon : meta.icon}
          size={22}
          color={activeColor}
        />
        <Text style={[styles.label, { color: activeColor }, isFocused && styles.labelActive]} numberOfLines={1}>
          {meta.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const HIDDEN_TABS = new Set(['team', 'settings']);

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
        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.container}>
          {content}
        </BlurView>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.container, styles.androidBg]}>{content}</View>
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
      paddingHorizontal: spacing[3],
      paddingBottom: spacing[1],
    },
    container: {
      borderRadius: borderRadius['2xl'],
      overflow: 'hidden',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.separator.transparent,
    },
    androidBg: { backgroundColor: colors.background.secondary },
    inner: { flexDirection: 'row', paddingTop: spacing[2] },
    tabItem: { flex: 1, alignItems: 'center' },
    tabInner: { alignItems: 'center', gap: spacing[1], position: 'relative' },
    activePill: {
      position: 'absolute',
      top: -spacing[2],
      width: 20,
      height: 3,
      borderRadius: borderRadius.full,
      backgroundColor: colors.accent.primary,
    },
    label: { ...typography.caption2 },
    labelActive: { fontWeight: '600' },
  });
