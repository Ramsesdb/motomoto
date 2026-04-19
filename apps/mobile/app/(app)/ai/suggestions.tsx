import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Pressable } from '@/components/ui/Pressable';
import { useToast } from '@/components/ui/Toast';
import { useColors } from '@/hooks/useColors';
import { spacing, typography, borderRadius } from '@/design';
import type { ThemeColors } from '@/design';

export default function AISuggestionsScreen() {
  const router = useRouter();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const toast = useToast();
  const [subscribed, setSubscribed] = useState(false);

  function handleNotify() {
    setSubscribed(true);
    toast.show('Te avisaremos cuando esté listo', 'success');
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.title}>Sugerencias IA</Text>
        <View style={styles.backButton} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(250).delay(0)}>
          <LinearGradient
            colors={[colors.accent.purple + '15', 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.iconGradient}
          >
            <View style={[styles.iconCircle, { backgroundColor: colors.accent.purpleMuted }]}>
              <MaterialCommunityIcons name="comment-text-multiple-outline" size={28} color={colors.accent.purple} />
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(250).delay(80)} style={styles.textBlock}>
          <Text style={styles.featureTitle}>Respuestas inteligentes</Text>
          <Text style={styles.featureDesc}>
            La IA analizará el contexto de cada conversación y sugerirá respuestas personalizadas en tiempo real, adaptadas al tono y estilo de tu marca.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(250).delay(160)} style={styles.features}>
          <FeatureRow icon="lightning-bolt" text="Sugerencias en menos de 2 segundos" colors={colors} styles={styles} />
          <FeatureRow icon="account-heart-outline" text="Adaptadas al perfil del cliente" colors={colors} styles={styles} />
          <FeatureRow icon="translate" text="Soporte multiidioma automático" colors={colors} styles={styles} />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(250).delay(240)}>
          <Pressable
            onPress={handleNotify}
            disabled={subscribed}
            style={[styles.notifyButton, subscribed && styles.notifyButtonDone]}
          >
            <MaterialCommunityIcons
              name={subscribed ? 'check-circle' : 'bell-ring-outline'}
              size={18}
              color={subscribed ? colors.accent.success : colors.text.primary}
            />
            <Text style={[styles.notifyLabel, subscribed && { color: colors.accent.success }]}>
              {subscribed ? 'Suscrito' : 'Notificarme'}
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureRow({ icon, text, colors, styles }: { icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; text: string; colors: ThemeColors; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.featureRow}>
      <MaterialCommunityIcons name={icon} size={16} color={colors.accent.purple} />
      <Text style={styles.featureRowText}>{text}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing[2], paddingVertical: spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.separator.transparent,
  },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, ...typography.headline, color: colors.text.primary, textAlign: 'center' },
  scrollContent: { alignItems: 'center', padding: spacing[6], paddingTop: spacing[8], gap: spacing[5] },
  iconGradient: { width: 100, height: 100, borderRadius: borderRadius['2xl'], alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: borderRadius.full, alignItems: 'center', justifyContent: 'center' },
  textBlock: { alignItems: 'center', gap: spacing[2] },
  featureTitle: { ...typography.title3, fontWeight: '700', color: colors.text.primary, textAlign: 'center' },
  featureDesc: { ...typography.subhead, color: colors.text.secondary, textAlign: 'center', lineHeight: 22 },
  features: {
    alignSelf: 'stretch',
    padding: spacing[4],
    gap: spacing[3],
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator.transparent,
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  featureRowText: { flex: 1, ...typography.subhead, color: colors.text.secondary },
  notifyButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[2],
    backgroundColor: colors.accent.primary, borderRadius: borderRadius.lg,
    paddingVertical: spacing[3], paddingHorizontal: spacing[6], minHeight: 48,
  },
  notifyButtonDone: { backgroundColor: colors.accent.successMuted },
  notifyLabel: { ...typography.headline, color: colors.text.primary },
});
