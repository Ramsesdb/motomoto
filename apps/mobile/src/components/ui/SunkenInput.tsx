import React from 'react';
import {
  View,
  TextInput,
  Platform,
  StyleSheet,
  type KeyboardTypeOptions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useColors } from '@/hooks/useColors';
import { fontFamily } from '@/design/typography';
import { borderRadius } from '@/design/spacing';

// ─── Props ──────────────────────────────────────────────────────────────────

export interface SunkenInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: React.ComponentProps<typeof TextInput>['autoComplete'];
  editable?: boolean;
  leftIcon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  rightAccessory?: React.ReactNode;
  testID?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function SunkenInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoComplete,
  editable,
  leftIcon,
  rightAccessory,
  testID,
}: SunkenInputProps) {
  const colors = useColors();

  const containerBg =
    Platform.OS === 'android' ? colors.surfaceBackground : colors.surfaceContainerLowest;

  const hasLeftIcon = leftIcon !== undefined;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: containerBg },
        Platform.OS === 'ios' && styles.iosOverflow,
      ]}
      testID={testID}
    >
      {/* iOS inset shadow overlay */}
      {Platform.OS === 'ios' && (
        <View style={styles.insetShadow} pointerEvents="none" />
      )}

      {hasLeftIcon && (
        <View style={styles.leftIconContainer}>
          <MaterialCommunityIcons
            name={leftIcon}
            size={20}
            color={colors.onSurfaceVariant}
          />
        </View>
      )}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        editable={editable}
        style={[
          styles.input,
          {
            color: colors.onSurface,
            fontFamily: fontFamily.bodyRegular,
            paddingLeft: hasLeftIcon ? 44 : 16,
          },
        ]}
      />

      {rightAccessory !== undefined && (
        <View style={styles.rightAccessory}>{rightAccessory}</View>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.sm,
    minHeight: 52,
    justifyContent: 'center',
  } satisfies ViewStyle,

  iosOverflow: {
    overflow: 'hidden',
  } satisfies ViewStyle,

  insetShadow: {
    ...StyleSheet.absoluteFillObject,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    backgroundColor: 'transparent',
  } as StyleProp<ViewStyle> as ViewStyle,

  leftIconContainer: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    zIndex: 1,
  } satisfies ViewStyle,

  input: {
    fontSize: 16,
    minHeight: 52,
    paddingRight: 16,
    paddingVertical: 0,
  },

  rightAccessory: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  } satisfies ViewStyle,
});
