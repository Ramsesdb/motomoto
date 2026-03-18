import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { GlassCard } from '@/components/ui/GlassCard';
import { Pressable } from '@/components/ui/Pressable';
import { colors, spacing, typography, borderRadius } from '@/design';

// ─── Feature card data ────────────────────────────────────────────────────────

interface AIFeature {
  id: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  description: string;
  tint: string;
  route: string;
}

const AI_FEATURES: AIFeature[] = [
  {
    id: 'suggestions',
    icon: 'comment-text-outline',
    title: 'Sugerencias de Respuesta',
    description: 'Respuestas generadas por IA basadas en el historial de la conversación.',
    tint: colors.accent.purple,
    route: '/ai/suggestions',
  },
  {
    id: 'summary',
    icon: 'text-box-outline',
    title: 'Resumen de Conversación',
    description: 'Genera un resumen ejecutivo de cualquier conversación en un clic.',
    tint: colors.accent.info,
    route: '/ai/summary',
  },
  {
    id: 'classify',
    icon: 'tag-outline',
    title: 'Clasificación de Mensajes',
    description: 'Detecta la intención del cliente: pregunta, queja, intención de compra.',
    tint: colors.accent.warning,
    route: '/ai/classify',
  },
  {
    id: 'chatbot',
    icon: 'robot',
    title: 'Estado del Chatbot',
    description: 'Monitorea y configura los canales automatizados por chatbot.',
    tint: colors.accent.success,
    route: '/ai/chatbot',
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AIScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="robot"
            size={32}
            color={colors.accent.purple}
          />
          <View style={styles.headerText}>
            <Text style={styles.title}>Centro IA</Text>
            <Text style={styles.subtitle}>
              Potencia tu CRM con inteligencia artificial
            </Text>
          </View>
        </View>

        {/* ── Feature cards ──────────────────────────────────────────────────── */}
        <View style={styles.featureList}>
          {AI_FEATURES.map((feature) => (
            <Pressable
              key={feature.id}
              onPress={() => router.push(feature.route as never)}
            >
              <GlassCard style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: feature.tint + '22' }]}>
                  <MaterialCommunityIcons
                    name={feature.icon}
                    size={28}
                    color={feature.tint}
                  />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc} numberOfLines={2}>
                    {feature.description}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={colors.text.tertiary}
                />
              </GlassCard>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[20],
    gap: spacing[5],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingTop: spacing[2],
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...typography.largeTitle,
    fontWeight: '700',
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.subhead,
    color: colors.text.secondary,
  },
  featureList: {
    gap: spacing[3],
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    gap: spacing[3],
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureText: {
    flex: 1,
    gap: spacing[1],
  },
  featureTitle: {
    ...typography.headline,
    color: colors.text.primary,
  },
  featureDesc: {
    ...typography.subhead,
    color: colors.text.secondary,
  },
});
