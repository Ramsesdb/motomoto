import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Pressable } from '@/components/ui/Pressable';
import { GlassCard } from '@/components/ui/GlassCard';
import { useToast } from '@/components/ui/Toast';
import { useColors } from '@/hooks/useColors';
import { spacing, typography, borderRadius } from '@/design';
import type { ThemeColors } from '@/design';

export default function AIClassifyScreen() {
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
        <Text style={styles.title}>Clasificación IA</Text>
        <View style={styles.backButton} />
      </View>
      <View style={styles.body}>
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <LinearGradient
            colors={[colors.accent.warning + '15', 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.iconGradient}
          >
            <View style={[styles.iconCircle, { backgroundColor: colors.accent.warningMuted }]}>
              <MaterialCommunityIcons name="tag-multiple-outline" size={40} color={colors.accent.warning} />
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.textBlock}>
          <Text style={styles.featureTitle}>Clasificación automática</Text>
          <Text style={styles.featureDesc}>
            Cada mensaje entrante será clasificado automáticamente: consulta, queja, intención de compra o saludo, para priorizar tu atención.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(300)}>
          <GlassCard style={styles.features}>
            <FeatureRow icon="label-outline" text="Etiquetado automático de mensajes" colors={colors} styles={styles} />
            <FeatureRow icon="sort-ascending" text="Priorización inteligente de la bandeja" colors={colors} styles={styles} />
            <FeatureRow icon="chart-pie" text="Estadísticas de clasificación" colors={colors} styles={styles} />
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(400)}>
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
      </View>
    </SafeAreaView>
  );
}

function FeatureRow({ icon, text, colors, styles }: { icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; text: string; colors: ThemeColors; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.featureRow}>
      <MaterialCommunityIcons name={icon} size={16} color={colors.accent.warning} />
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
  body: { flex: 1, padding: spacing[6], alignItems: 'center', justifyContent: 'center', gap: spacing[6] },
  iconGradient: { width: 140, height: 140, borderRadius: borderRadius['3xl'], alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 80, height: 80, borderRadius: borderRadius.full, alignItems: 'center', justifyContent: 'center' },
  textBlock: { alignItems: 'center', gap: spacing[2] },
  featureTitle: { ...typography.title2, fontWeight: '700', color: colors.text.primary, textAlign: 'center' },
  featureDesc: { ...typography.subhead, color: colors.text.secondary, textAlign: 'center', lineHeight: 22 },
  features: { alignSelf: 'stretch', padding: spacing[4], gap: spacing[3] },
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
