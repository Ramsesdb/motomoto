import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useColors } from '@/hooks/useColors';
import { spacing, typography, borderRadius } from '@/design';
import type { ThemeColors } from '@/design';
import { Pressable } from '@/components/ui/Pressable';

interface ChatInputProps {
  onSend: (text: string) => void;
  onAttachment?: () => void;
  onAISuggestion?: () => void;
  value?: string;
  onChangeText?: TextInputProps['onChangeText'];
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onAttachment,
  onAISuggestion,
  value,
  onChangeText,
  placeholder = 'Escribe un mensaje…',
}: ChatInputProps) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isControlled = value !== undefined;
  const [localText, setLocalText] = useState('');
  const currentText = isControlled ? value : localText;

  function handleChangeText(text: string) {
    if (!isControlled) setLocalText(text);
    onChangeText?.(text);
  }

  function handleSend() {
    const trimmed = currentText.trim();
    if (trimmed.length === 0) return;
    onSend(trimmed);
    if (!isControlled) setLocalText('');
  }

  const canSend = currentText.trim().length > 0;

  return (
    <View style={styles.container}>
      <Pressable onPress={onAttachment} style={styles.iconButton}>
        <MaterialCommunityIcons name="plus-circle-outline" size={24} color={colors.text.secondary} />
      </Pressable>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={currentText}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.placeholder}
          multiline
          returnKeyType="default"
          blurOnSubmit={false}
        />
        {onAISuggestion !== undefined && (
          <Pressable onPress={onAISuggestion} style={styles.aiButton}>
            <MaterialCommunityIcons name="robot-outline" size={18} color={colors.accent.purple} />
          </Pressable>
        )}
      </View>
      <Pressable
        onPress={handleSend}
        style={[styles.sendButton, canSend && styles.sendButtonActive]}
        disabled={!canSend}
      >
        <MaterialCommunityIcons
          name="send"
          size={18}
          color={canSend ? '#FFFFFF' : colors.text.tertiary}
        />
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      backgroundColor: colors.background.secondary,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.separator.transparent,
      gap: spacing[2],
    },
    iconButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
    inputWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      backgroundColor: colors.background.tertiary,
      borderRadius: borderRadius.xl,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.separator.transparent,
      paddingLeft: spacing[3],
      paddingRight: spacing[1],
      paddingVertical: spacing[2],
      minHeight: 40,
      maxHeight: 120,
    },
    input: { flex: 1, ...typography.body, color: colors.text.primary, padding: 0, margin: 0 },
    aiButton: {
      width: 32,
      height: 32,
      borderRadius: borderRadius.full,
      backgroundColor: colors.accent.purpleMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: spacing[1],
    },
    sendButton: {
      width: 38,
      height: 38,
      borderRadius: borderRadius.full,
      backgroundColor: colors.background.tertiary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonActive: { backgroundColor: colors.accent.primary },
  });
