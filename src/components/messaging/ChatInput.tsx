import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing, typography, borderRadius } from '@/design';
import { Pressable } from '@/components/ui/Pressable';

interface ChatInputProps {
  /** Called when the user taps Send with non-empty text. Clears the input. */
  onSend: (text: string) => void;
  /** Called when the user taps the attachment icon. */
  onAttachment?: () => void;
  /**
   * When supplied, an AI-suggestion indicator is shown.
   * Tapping it triggers this callback (e.g. open AISuggestionPill).
   */
  onAISuggestion?: () => void;
  /** Pre-fill the input (e.g. from an AISuggestionPill tap). */
  value?: string;
  /** Controlled-mode change handler. When omitted the input is uncontrolled. */
  onChangeText?: TextInputProps['onChangeText'];
  placeholder?: string;
}

/**
 * Chat toolbar: attachment icon | multiline text field | (AI button?) | send button.
 *
 * Supports both controlled (value + onChangeText) and uncontrolled modes.
 * In uncontrolled mode the input manages its own text and clears on send.
 */
export function ChatInput({
  onSend,
  onAttachment,
  onAISuggestion,
  value,
  onChangeText,
  placeholder = 'Escribe un mensaje…',
}: ChatInputProps) {
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
      {/* Attachment */}
      <Pressable onPress={onAttachment} style={styles.iconButton}>
        <MaterialCommunityIcons
          name="paperclip"
          size={22}
          color={colors.text.secondary}
        />
      </Pressable>

      {/* Text field */}
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
      </View>

      {/* AI suggestion indicator — only shown when prop is provided */}
      {onAISuggestion !== undefined && (
        <Pressable onPress={onAISuggestion} style={styles.iconButton}>
          <MaterialCommunityIcons
            name="robot-outline"
            size={22}
            color={colors.accent.purple}
          />
        </Pressable>
      )}

      {/* Send */}
      <Pressable
        onPress={handleSend}
        style={[styles.sendButton, canSend && styles.sendButtonActive]}
        disabled={!canSend}
      >
        <MaterialCommunityIcons
          name="send"
          size={20}
          color={canSend ? colors.text.primary : colors.text.tertiary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    minHeight: 36,
    maxHeight: 120,
    justifyContent: 'center',
  },
  input: {
    ...typography.body,
    color: colors.text.primary,
    padding: 0,
    margin: 0,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.accent.primary,
  },
});
