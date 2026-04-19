import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { Pressable } from '@/components/ui/Pressable';
import { GlassCard } from '@/components/ui/GlassCard';
import { Avatar } from '@/components/ui/Avatar';
import { useColors } from '@/hooks/useColors';
import { spacing, typography, borderRadius, type ThemeColors } from '@m2/design';
import type { UserRole } from '@m2/types';

const TOTAL_STEPS = 3;

interface RoleOption {
  role: UserRole;
  label: string;
  description: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  colorKey: 'success' | 'info' | 'purple';
  mutedKey: 'successMuted' | 'infoMuted' | 'purpleMuted';
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'agent',
    label: 'Agente',
    description: 'Atiendo clientes por mensajería',
    icon: 'headset',
    colorKey: 'success',
    mutedKey: 'successMuted',
  },
  {
    role: 'manager',
    label: 'Gerente',
    description: 'Superviso equipos y métricas',
    icon: 'chart-line',
    colorKey: 'info',
    mutedKey: 'infoMuted',
  },
  {
    role: 'admin',
    label: 'Administrador',
    description: 'Configuro la plataforma completa',
    icon: 'shield-account-outline',
    colorKey: 'purple',
    mutedKey: 'purpleMuted',
  },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>(undefined);

  function handleNext() {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      // TODO: persist name + role + avatar via user service
      router.replace('/(app)/home' as never);
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep(step - 1);
    }
  }

  const canContinue =
    step === 0 ||
    (step === 1 && selectedRole !== undefined) ||
    (step === 2 && name.trim().length >= 2);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.accent.primary + '18', 'transparent']}
        style={styles.bgGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          {/* -- Top bar --------------------------------------------------- */}
          <View style={styles.topBar}>
            {step > 0 ? (
              <Pressable onPress={handleBack} style={styles.backButton}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
              </Pressable>
            ) : (
              <View style={styles.backButton} />
            )}
            <StepIndicator current={step} total={TOTAL_STEPS} colors={colors} />
            <View style={styles.backButton} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {step === 0 && <WelcomeStep colors={colors} styles={styles} />}
            {step === 1 && (
              <RoleStep selected={selectedRole} onSelect={setSelectedRole} colors={colors} styles={styles} />
            )}
            {step === 2 && (
              <ProfileStep name={name} onChangeName={setName} selectedRole={selectedRole} colors={colors} styles={styles} />
            )}
          </ScrollView>

          {/* -- Continue button ------------------------------------------- */}
          <View style={styles.bottomBar}>
            <Pressable
              onPress={handleNext}
              style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
              disabled={!canContinue}
            >
              <Text style={[styles.continueLabel, !canContinue && styles.continueLabelDisabled]}>
                {step === TOTAL_STEPS - 1 ? 'Comenzar' : 'Continuar'}
              </Text>
              <MaterialCommunityIcons
                name={step === TOTAL_STEPS - 1 ? 'check' : 'arrow-right'}
                size={20}
                color={!canContinue ? colors.text.tertiary : colors.text.primary}
              />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// --- Step Indicator --------------------------------------------------------

function StepIndicator({ current, total, colors }: { current: number; total: number; colors: ThemeColors }) {
  const sStyles = useMemo(() => createStepStyles(colors), [colors]);

  return (
    <View style={sStyles.container}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            sStyles.dot,
            i === current ? sStyles.dotActive : sStyles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

// --- Step 0: Welcome -------------------------------------------------------

function WelcomeStep({ colors, styles }: { colors: ThemeColors; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.stepCenter}>
      <Animated.View entering={FadeInUp.duration(500).delay(100)} style={styles.welcomeIconWrap}>
        <LinearGradient
          colors={[colors.accent.primary, colors.accent.primary + 'AA']}
          style={styles.welcomeIconBg}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialCommunityIcons name="motorbike" size={56} color={colors.text.primary} />
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.welcomeText}>
        <Text style={styles.welcomeTitle}>¡Bienvenido a Motomoto!</Text>
        <Text style={styles.welcomeSubtitle}>
          Tu plataforma de CRM y mensajería unificada. Configuremos tu cuenta en solo 2 pasos.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.featureList}>
        <FeatureItem icon="message-text-outline" text="Todas tus conversaciones en un solo lugar" colors={colors} styles={styles} />
        <FeatureItem icon="robot-outline" text="Asistente IA para respuestas inteligentes" colors={colors} styles={styles} />
        <FeatureItem icon="chart-bar" text="Reportes y métricas en tiempo real" colors={colors} styles={styles} />
        <FeatureItem icon="account-group-outline" text="Colaboración en equipo integrada" colors={colors} styles={styles} />
      </Animated.View>
    </View>
  );
}

function FeatureItem({
  icon,
  text,
  colors,
  styles,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  text: string;
  colors: ThemeColors;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIcon}>
        <MaterialCommunityIcons name={icon} size={18} color={colors.accent.primary} />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

// --- Step 1: Role ----------------------------------------------------------

function RoleStep({
  selected,
  onSelect,
  colors,
  styles,
}: {
  selected?: UserRole;
  onSelect: (r: UserRole) => void;
  colors: ThemeColors;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.stepTop}>
      <Animated.View entering={FadeInDown.duration(400).delay(50)}>
        <Text style={styles.stepTitle}>¿Cuál es tu rol?</Text>
        <Text style={styles.stepSubtitle}>
          Esto personaliza tu experiencia. Puedes cambiarlo después.
        </Text>
      </Animated.View>

      <View style={styles.roleList}>
        {ROLE_OPTIONS.map((option, i) => {
          const optionColor = colors.accent[option.colorKey];
          const optionBgColor = colors.accent[option.mutedKey];

          return (
            <Animated.View key={option.role} entering={FadeInDown.duration(400).delay(120 + i * 80)}>
              <Pressable
                onPress={() => onSelect(option.role)}
                style={[
                  styles.roleCard,
                  selected === option.role && {
                    borderColor: optionColor,
                    backgroundColor: optionBgColor,
                  },
                ]}
              >
                <View style={[styles.roleIconCircle, { backgroundColor: optionBgColor }]}>
                  <MaterialCommunityIcons name={option.icon} size={24} color={optionColor} />
                </View>
                <View style={styles.roleInfo}>
                  <Text style={styles.roleLabel}>{option.label}</Text>
                  <Text style={styles.roleDesc}>{option.description}</Text>
                </View>
                {selected === option.role && (
                  <MaterialCommunityIcons name="check-circle" size={22} color={optionColor} />
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

// --- Step 2: Profile -------------------------------------------------------

function ProfileStep({
  name,
  onChangeName,
  selectedRole,
  colors,
  styles,
}: {
  name: string;
  onChangeName: (v: string) => void;
  selectedRole?: UserRole;
  colors: ThemeColors;
  styles: ReturnType<typeof createStyles>;
}) {
  const matchedRole = ROLE_OPTIONS.find((r) => r.role === selectedRole);

  return (
    <View style={styles.stepTop}>
      <Animated.View entering={FadeInDown.duration(400).delay(50)}>
        <Text style={styles.stepTitle}>Configura tu perfil</Text>
        <Text style={styles.stepSubtitle}>
          Así te verán tus compañeros de equipo.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(150)} style={styles.avatarSection}>
        <View style={styles.avatarWrapper}>
          <Avatar name={name.length >= 2 ? name : '?'} size={96} />
          <View style={styles.cameraOverlay}>
            <MaterialCommunityIcons name="camera" size={16} color={colors.text.primary} />
          </View>
        </View>
        <Text style={styles.avatarHint}>Toca para cambiar foto</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(250)}>
        <GlassCard style={styles.inputCard}>
          <Text style={styles.inputLabel}>Nombre de pantalla</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={onChangeName}
            placeholder="Ej. Ana García"
            placeholderTextColor={colors.text.placeholder}
            returnKeyType="done"
            autoFocus
            maxLength={50}
          />
        </GlassCard>
      </Animated.View>

      {selectedRole !== undefined && (
        <Animated.View entering={FadeInDown.duration(400).delay(350)}>
          <GlassCard style={styles.inputCard}>
            <Text style={styles.inputLabel}>Rol seleccionado</Text>
            <View style={styles.selectedRoleRow}>
              <MaterialCommunityIcons
                name={matchedRole?.icon ?? 'account'}
                size={18}
                color={matchedRole != null ? colors.accent[matchedRole.colorKey] : colors.text.primary}
              />
              <Text style={styles.selectedRoleText}>
                {matchedRole?.label ?? selectedRole}
              </Text>
            </View>
          </GlassCard>
        </Animated.View>
      )}
    </View>
  );
}

// --- Styles ----------------------------------------------------------------

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
  flex: {
    flex: 1,
  },

  /* Top bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Scroll */
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[4],
  },

  /* Step layouts */
  stepCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing[8],
  },
  stepTop: {
    flex: 1,
    gap: spacing[6],
    paddingTop: spacing[4],
  },

  /* Welcome step */
  welcomeIconWrap: {
    alignItems: 'center',
  },
  welcomeIconBg: {
    width: 104,
    height: 104,
    borderRadius: borderRadius['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
  },
  welcomeTitle: {
    ...typography.title1,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  featureList: {
    alignSelf: 'stretch',
    gap: spacing[3],
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    ...typography.subhead,
    color: colors.text.secondary,
  },

  /* Step headers */
  stepTitle: {
    ...typography.title1,
    fontWeight: '700',
    color: colors.text.primary,
  },
  stepSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },

  /* Role step */
  roleList: {
    gap: spacing[3],
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: colors.separator.transparent,
    backgroundColor: colors.background.secondary,
  },
  roleIconCircle: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleInfo: {
    flex: 1,
    gap: 2,
  },
  roleLabel: {
    ...typography.headline,
    color: colors.text.primary,
  },
  roleDesc: {
    ...typography.footnote,
    color: colors.text.secondary,
  },

  /* Profile step */
  avatarSection: {
    alignItems: 'center',
    gap: spacing[2],
  },
  avatarWrapper: {
    position: 'relative',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background.primary,
  },
  avatarHint: {
    ...typography.caption1,
    color: colors.text.tertiary,
  },
  inputCard: {
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
  selectedRoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  selectedRoleText: {
    ...typography.body,
    color: colors.text.primary,
  },

  /* Bottom bar */
  bottomBar: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[4],
    paddingTop: spacing[2],
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
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

const createStepStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  dot: {
    height: 4,
    borderRadius: borderRadius.full,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.accent.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: colors.background.elevated,
  },
});
