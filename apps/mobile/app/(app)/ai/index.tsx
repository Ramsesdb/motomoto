import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { MeshGradient } from '@/components/ui/MeshGradient';
import { GlassCard } from '@/components/ui/GlassCard';
import { PerformanceMetric } from '@/components/ai/PerformanceMetric';
import { useColors } from '@/hooks/useColors';
import { fontFamily, typography } from '@m2/design';
import { borderRadius, spacing } from '@m2/design';
import type { ThemeColors } from '@m2/design';

// ─── Feature card data ────────────────────────────────────────────────────────

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface FeatureCard {
  id: string;
  icon: IconName;
  title: string;
  description: string;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    id: 'smart-replies',
    icon: 'comment-text-outline',
    title: 'Respuestas inteligentes',
    description: 'Genera respuestas contextuales basadas en el historial de conversación.',
  },
  {
    id: 'conversation-summary',
    icon: 'text-box-outline',
    title: 'Resumen conversación',
    description: 'Obtén un resumen ejecutivo de cualquier conversación en un clic.',
  },
  {
    id: 'message-classification',
    icon: 'tag-outline',
    title: 'Clasificación mensajes',
    description: 'Detecta intención automáticamente: pregunta, queja, compra.',
  },
  {
    id: 'chatbot-monitor',
    icon: 'robot-outline',
    title: 'Monitor chatbot',
    description: 'Monitorea el estado y rendimiento de canales automatizados.',
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AIScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <MeshGradient variant="ai">
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Header ─────────────────────────────────────────────────────────── */}
          <Animated.View entering={FadeInDown.duration(400).delay(50)} style={styles.header}>
            <Text style={styles.title}>Centro de Inteligencia Artificial</Text>
            <Text style={styles.subtitle}>
              Motomoto Core — Optimiza cada interaccion
            </Text>
          </Animated.View>

          {/* ── Feature cards grid (2x2) ───────────────────────────────────────── */}
          <View style={styles.featureGrid}>
            {FEATURE_CARDS.map((card, index) => (
              <Animated.View
                key={card.id}
                entering={FadeInDown.duration(400).delay(150 + index * 80)}
                style={styles.featureWrapper}
              >
                <GlassCard style={styles.featureCard}>
                  <View style={[styles.featureIcon, { backgroundColor: colors.secondaryContainer + '33' }]}>
                    <MaterialCommunityIcons
                      name={card.icon}
                      size={24}
                      color={colors.secondary}
                    />
                  </View>
                  <Text style={styles.featureTitle}>{card.title}</Text>
                  <Text style={styles.featureDesc} numberOfLines={3}>
                    {card.description}
                  </Text>
                </GlassCard>
              </Animated.View>
            ))}
          </View>

          {/* ── Performance section ────────────────────────────────────────────── */}
          <Animated.View entering={FadeInDown.duration(400).delay(500)} style={styles.performanceSection}>
            <Text style={styles.sectionTitle}>Rendimiento</Text>
            <View style={styles.metricsRow}>
              <View style={styles.metricWrapper}>
                <PerformanceMetric
                  label="Procesamiento"
                  value="84%"
                  progress={0.84}
                  tint={colors.primary}
                />
              </View>
              <View style={styles.metricWrapper}>
                <PerformanceMetric
                  label="Precisión"
                  value="98.2%"
                  progress={0.982}
                  tint={colors.tertiary}
                />
              </View>
              <View style={styles.metricWrapper}>
                <PerformanceMetric
                  label="Latencia"
                  value="140ms"
                  progress={0.14}
                  tint={colors.secondary}
                />
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </MeshGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[24],
    gap: spacing[6],
  },

  /* Header */
  header: {
    paddingTop: spacing[4],
    gap: spacing[1],
  },
  title: {
    fontFamily: fontFamily.displayBold,
    ...typography.headlineMedium,
    color: colors.onSurface,
  },
  subtitle: {
    fontFamily: fontFamily.bodyRegular,
    ...typography.bodyLarge,
    color: colors.onSurfaceVariant,
  },

  /* Feature grid */
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  featureWrapper: {
    width: '47%',
    flexGrow: 1,
  },
  featureCard: {
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    gap: spacing[2],
    minHeight: 160,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontFamily: fontFamily.bodySemiBold,
    ...typography.titleSmall,
    color: colors.onSurface,
    marginTop: spacing[1],
  },
  featureDesc: {
    fontFamily: fontFamily.bodyRegular,
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    flex: 1,
  },

  /* Performance section */
  performanceSection: {
    gap: spacing[3],
  },
  sectionTitle: {
    fontFamily: fontFamily.displaySemiBold,
    ...typography.titleLarge,
    color: colors.onSurface,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  metricWrapper: {
    flex: 1,
  },
});
