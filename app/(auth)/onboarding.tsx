import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Pressable } from '@/components/ui/Pressable';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, typography, borderRadius } from '@/design';

/**
 * Onboarding screen — stub.
 * Collects display name and avatar (avatar picker TBD).
 * On completion, navigates to the main app.
 */
export default function OnboardingScreen() {
  const router = useRouter();
  const [name, setName] = useState('');

  function handleContinue() {
    // TODO: persist name + avatar via user service
    router.replace('/(app)/home' as never);
  }

  const canContinue = name.trim().length >= 2;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configura tu perfil</Text>
        <Text style={styles.subtitle}>
          Así te verán tus compañeros de equipo.
        </Text>
      </View>

      <View style={styles.body}>
        {/* Avatar placeholder */}
        <View style={styles.avatarPlaceholder}>
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={80}
            color={colors.text.tertiary}
          />
          <Text style={styles.avatarHint}>Foto de perfil (próximamente)</Text>
        </View>

        {/* Display name input */}
        <GlassCard style={styles.inputCard}>
          <Text style={styles.inputLabel}>Nombre de pantalla</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej. Ana García"
            placeholderTextColor={colors.text.placeholder}
            returnKeyType="done"
            autoFocus
            maxLength={50}
          />
        </GlassCard>
      </View>

      <Pressable
        onPress={handleContinue}
        style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
        disabled={!canContinue}
      >
        <Text style={[styles.continueLabel, !canContinue && styles.continueLabelDisabled]}>
          Continuar
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[8],
  },
  header: {
    marginTop: spacing[8],
    marginBottom: spacing[8],
    gap: spacing[2],
  },
  title: {
    ...typography.largeTitle,
    color: colors.text.primary,
    fontWeight: '700',
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  body: {
    flex: 1,
    gap: spacing[8],
    alignItems: 'center',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    gap: spacing[2],
  },
  avatarHint: {
    ...typography.caption1,
    color: colors.text.tertiary,
  },
  inputCard: {
    alignSelf: 'stretch',
    padding: spacing[4],
    gap: spacing[2],
  },
  inputLabel: {
    ...typography.footnote,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  input: {
    ...typography.body,
    color: colors.text.primary,
    padding: 0,
  },
  continueButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[4],
    minHeight: 52,
  },
  continueButtonDisabled: {
    backgroundColor: colors.background.elevated,
  },
  continueLabel: {
    ...typography.headline,
    color: colors.text.primary,
  },
  continueLabelDisabled: {
    color: colors.text.tertiary,
  },
});
