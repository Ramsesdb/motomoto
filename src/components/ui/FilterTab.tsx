import React from 'react';
import { Text, View, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Pressable } from '@/components/ui/Pressable';
import { useColors } from '@/hooks/useColors';
import { fontFamily } from '@/design/typography';
import { borderRadius, spacing } from '@/design/spacing';

// ─── Props ──────────────────────────────────────────────────────────────────

export interface FilterTabProps {
  label: string;
  active: boolean;
  onPress: () => void;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  tint?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Returns `color` at the given opacity (0–1) as an rgba string. */
function withOpacity(color: string, opacity: number): string {
  // Handle hex colors (#RRGGBB or #RGB)
  const hex = color.replace('#', '');
  const fullHex =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex;

  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function FilterTab({ label, active, onPress, icon, tint }: FilterTabProps) {
  const colors = useColors();

  const activeBg =
    tint !== undefined ? withOpacity(tint, 0.15) : colors.surfaceContainerHigh;
  const activeTextColor = tint ?? colors.primary;

  const backgroundColor = active ? activeBg : colors.surfaceContainer;
  const textColor = active ? activeTextColor : colors.onSurfaceVariant;
  const fontWeight = active ? '600' : '500';
  const fontFamilyValue = active ? fontFamily.bodySemiBold : fontFamily.bodyMedium;

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active }}>
      <View style={[styles.pill, { backgroundColor }]}>
        {icon !== undefined && (
          <MaterialCommunityIcons
            name={icon}
            size={14}
            color={textColor}
            style={styles.icon}
          />
        )}
        <Text
          style={[
            styles.label,
            {
              color: textColor,
              fontWeight,
              fontFamily: fontFamilyValue,
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    paddingVertical: spacing[2], // 8
    paddingHorizontal: spacing[3], // 12
  } satisfies ViewStyle,

  icon: {
    marginRight: spacing[1], // 4
  } satisfies TextStyle,

  label: {
    fontSize: 14,
    lineHeight: 20,
  } satisfies TextStyle,
});
