import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAuthStore } from '@/store/useAuthStore';
import { Pressable } from '@/components/ui/Pressable';
import { colors, spacing, typography, borderRadius } from '@/design';

export default function LoginScreen() {
  const signIn = useAuthStore((s) => s.signIn);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);
    try {
      await signIn();
    } catch {
      setError('No se pudo iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <View style={styles.hero}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="motorbike"
            size={64}
            color={colors.accent.primary}
          />
        </View>
        <Text style={styles.appName}>Motomoto</Text>
        <Text style={styles.tagline}>CRM & Mensajería Unificada</Text>
      </View>

      {/* ── Actions ──────────────────────────────────────────────────────────── */}
      <View style={styles.actions}>
        {error !== null && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {/* Google Sign-In */}
        <Pressable
          onPress={handleGoogleSignIn}
          style={styles.googleButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.text.primary} size="small" />
          ) : (
            <>
              <MaterialCommunityIcons
                name="google"
                size={20}
                color={colors.text.primary}
              />
              <Text style={styles.googleButtonLabel}>
                Continuar con Google
              </Text>
            </>
          )}
        </Pressable>

        {/* Apple Sign-In — slot reserved for iOS dev-client build */}
        {/* Platform.OS === 'ios' &&
          <AppleAuthenticationButton
            onPress={handleAppleSignIn}
            buttonType={AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={borderRadius.lg}
            style={styles.appleButton}
          />
        */}
      </View>

      {/* ── Legal ────────────────────────────────────────────────────────────── */}
      <Text style={styles.legal}>
        Al continuar aceptas los{' '}
        <Text style={styles.legalLink}>Términos de Servicio</Text>
        {' '}y la{' '}
        <Text style={styles.legalLink}>Política de Privacidad</Text>.
      </Text>
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
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: borderRadius['2xl'],
    backgroundColor: colors.accent.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  appName: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: 0.36,
    color: colors.text.primary,
  },
  tagline: {
    ...typography.callout,
    color: colors.text.secondary,
  },
  actions: {
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  errorText: {
    ...typography.footnote,
    color: colors.accent.error,
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    minHeight: 52,
  },
  googleButtonLabel: {
    ...typography.headline,
    color: colors.text.primary,
  },
  legal: {
    ...typography.caption1,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  legalLink: {
    color: colors.text.link,
  },
});
