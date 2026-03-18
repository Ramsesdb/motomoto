import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';

import { useAuthStore } from '@/store/useAuthStore';
import { Pressable } from '@/components/ui/Pressable';
import { GlassCard } from '@/components/ui/GlassCard';
import { useColors } from '@/hooks/useColors';
import { spacing, typography, borderRadius, type ThemeColors } from '@/design';

export default function LoginScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const signIn = useAuthStore((s) => s.signIn);
  const signInWithEmail = useAuthStore((s) => s.signInWithEmail);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.length >= 6;

  async function handleEmailSignIn() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      await signInWithEmail(email.trim(), password);
    } catch {
      setError('No se pudo iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setLoadingGoogle(true);
    setError(null);
    try {
      await signIn();
    } catch {
      setError('No se pudo iniciar sesión con Google. Intenta de nuevo.');
    } finally {
      setLoadingGoogle(false);
    }
  }

  const isLoading = loading || loadingGoogle;

  return (
    <View style={styles.root}>
      {/* Background gradient accent */}
      <LinearGradient
        colors={[colors.accent.primary + '18', 'transparent']}
        style={styles.bgGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* -- Hero ---------------------------------------- */}
            <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.hero}>
              <View style={styles.iconWrapper}>
                <LinearGradient
                  colors={[colors.accent.primary, colors.accent.primary + 'AA']}
                  style={styles.iconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MaterialCommunityIcons
                    name="motorbike"
                    size={48}
                    color={colors.text.primary}
                  />
                </LinearGradient>
              </View>
              <Text style={styles.appName}>Motomoto</Text>
              <Text style={styles.tagline}>CRM & Mensajería Unificada</Text>
            </Animated.View>

            {/* -- Login Form ---------------------------------- */}
            <Animated.View entering={FadeInDown.duration(600).delay(300)}>
              <GlassCard style={styles.formCard}>
                <Text style={styles.formTitle}>Iniciar sesión</Text>

                {error !== null && (
                  <View style={styles.errorContainer}>
                    <MaterialCommunityIcons
                      name="alert-circle-outline"
                      size={16}
                      color={colors.accent.error}
                    />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                {/* Email input */}
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={20}
                    color={colors.text.tertiary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor={colors.text.placeholder}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>

                {/* Password input */}
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={20}
                    color={colors.text.tertiary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Contraseña"
                    placeholderTextColor={colors.text.placeholder}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                    editable={!isLoading}
                  />
                  <Pressable
                    onPress={() => setShowPassword((v) => !v)}
                    style={styles.eyeButton}
                    disabled={isLoading}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.text.tertiary}
                    />
                  </Pressable>
                </View>

                {/* Sign in button */}
                <Pressable
                  onPress={handleEmailSignIn}
                  style={[
                    styles.primaryButton,
                    !canSubmit && styles.primaryButtonDisabled,
                  ]}
                  disabled={!canSubmit || isLoading}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.text.primary} size="small" />
                  ) : (
                    <Text style={styles.primaryButtonLabel}>Iniciar sesión</Text>
                  )}
                </Pressable>

                {/* Forgot password */}
                <Pressable onPress={() => {}} style={styles.forgotButton}>
                  <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                </Pressable>
              </GlassCard>
            </Animated.View>

            {/* -- Divider ------------------------------------- */}
            <Animated.View entering={FadeInDown.duration(600).delay(450)} style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o continúa con</Text>
              <View style={styles.dividerLine} />
            </Animated.View>

            {/* -- Social Sign-In ------------------------------ */}
            <Animated.View entering={FadeInDown.duration(600).delay(550)}>
              <Pressable
                onPress={handleGoogleSignIn}
                style={styles.googleButton}
                disabled={isLoading}
              >
                {loadingGoogle ? (
                  <ActivityIndicator color={colors.text.primary} size="small" />
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="google"
                      size={22}
                      color={colors.text.primary}
                    />
                    <Text style={styles.googleButtonLabel}>Google</Text>
                  </>
                )}
              </Pressable>
            </Animated.View>

            {/* -- Legal --------------------------------------- */}
            <Animated.View entering={FadeInDown.duration(600).delay(650)}>
              <Text style={styles.legal}>
                Al continuar aceptas los{' '}
                <Text style={styles.legalLink}>Términos de Servicio</Text>
                {' '}y la{' '}
                <Text style={styles.legalLink}>Política de Privacidad</Text>.
              </Text>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  bgGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 320,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[8],
    justifyContent: 'center',
  },

  /* Hero */
  hero: {
    alignItems: 'center',
    marginBottom: spacing[10],
  },
  iconWrapper: {
    marginBottom: spacing[4],
  },
  iconGradient: {
    width: 88,
    height: 88,
    borderRadius: borderRadius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  tagline: {
    ...typography.callout,
    color: colors.text.secondary,
  },

  /* Form card */
  formCard: {
    padding: spacing[6],
    gap: spacing[4],
  },
  formTitle: {
    ...typography.title3,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[1],
  },

  /* Error */
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.accent.errorMuted,
    borderRadius: borderRadius.md,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
  },
  errorText: {
    ...typography.footnote,
    color: colors.accent.error,
    flex: 1,
  },

  /* Inputs */
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator.transparent,
    minHeight: 52,
  },
  inputIcon: {
    marginLeft: spacing[4],
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
  },
  passwordInput: {
    paddingRight: spacing[12],
  },
  eyeButton: {
    position: 'absolute',
    right: spacing[3],
    padding: spacing[2],
  },

  /* Primary button */
  primaryButton: {
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    marginTop: spacing[1],
  },
  primaryButtonDisabled: {
    opacity: 0.45,
  },
  primaryButtonLabel: {
    ...typography.headline,
    color: colors.text.primary,
  },

  /* Forgot password */
  forgotButton: {
    alignSelf: 'center',
  },
  forgotText: {
    ...typography.footnote,
    color: colors.text.link,
  },

  /* Divider */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing[6],
    gap: spacing[3],
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator.transparent,
  },
  dividerText: {
    ...typography.caption1,
    color: colors.text.tertiary,
  },

  /* Google button */
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator.transparent,
    paddingVertical: spacing[4],
    minHeight: 52,
  },
  googleButtonLabel: {
    ...typography.headline,
    color: colors.text.primary,
  },

  /* Legal */
  legal: {
    ...typography.caption1,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing[6],
  },
  legalLink: {
    color: colors.text.link,
  },
});
