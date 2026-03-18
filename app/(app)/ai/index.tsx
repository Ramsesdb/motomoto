import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Pressable } from '@/components/ui/Pressable';
import { useColors } from '@/hooks/useColors';
import { spacing, typography, borderRadius, type ThemeColors } from '@/design';

// ─── Feature card data ────────────────────────────────────────────────────────

interface AIFeature {
  id: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  description: string;
  tint: string;
  gradientEnd: string;
  route: string;
}

function getAIFeatures(colors: ThemeColors): AIFeature[] {
  return [
    {
      id: 'suggestions',
      icon: 'comment-text-outline',
      title: 'Sugerencias de Respuesta',
      description: 'Respuestas generadas por IA basadas en el historial.',
      tint: colors.accent.purple,
      gradientEnd: colors.accent.primary,
      route: '/ai/suggestions',
    },
    {
      id: 'summary',
      icon: 'text-box-outline',
      title: 'Resumen de Conversación',
      description: 'Genera un resumen ejecutivo en un clic.',
      tint: colors.accent.info,
      gradientEnd: colors.accent.primary,
      route: '/ai/summary',
    },
    {
      id: 'classify',
      icon: 'tag-outline',
      title: 'Clasificación de Mensajes',
      description: 'Detecta intención: pregunta, queja, compra.',
      tint: colors.accent.warning,
      gradientEnd: colors.accent.error,
      route: '/ai/classify',
    },
    {
      id: 'chatbot',
      icon: 'robot',
      title: 'Estado del Chatbot',
      description: 'Monitorea canales automatizados por chatbot.',
      tint: colors.accent.success,
      gradientEnd: colors.accent.info,
      route: '/ai/chatbot',
    },
  ];
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AIScreen() {
  const router = useRouter();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const aiFeatures = useMemo(() => getAIFeatures(colors), [colors]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(400).delay(50)} style={styles.header}>
          <LinearGradient
            colors={[colors.accent.purple + '25', colors.accent.purple + '08']}
            style={styles.headerIconBg}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialCommunityIcons name="robot" size={28} color={colors.accent.purple} />
          </LinearGradient>
          <View style={styles.headerText}>
            <Text style={styles.title}>Centro IA</Text>
            <Text style={styles.subtitle}>
              Potencia tu CRM con inteligencia artificial
            </Text>
          </View>
        </Animated.View>

        {/* ── Feature cards ──────────────────────────────────────────────────── */}
        <View style={styles.featureGrid}>
          {aiFeatures.map((feature, index) => (
            <Animated.View
              key={feature.id}
              entering={FadeInDown.duration(400).delay(150 + index * 80)}
              style={styles.featureWrapper}
            >
              <Pressable
                onPress={() => router.push(feature.route as never)}
                style={styles.featurePressable}
              >
                <LinearGradient
                  colors={[feature.tint + '15', feature.gradientEnd + '06']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.featureGradient}
                >
                  <View style={[styles.featureIcon, { backgroundColor: feature.tint + '20' }]}>
                    <MaterialCommunityIcons
                      name={feature.icon}
                      size={24}
                      color={feature.tint}
                    />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc} numberOfLines={2}>
                    {feature.description}
                  </Text>
                  <View style={styles.featureArrow}>
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={16}
                      color={feature.tint}
                    />
                  </View>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[24],
    gap: spacing[5],
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingTop: spacing[4],
  },
  headerIconBg: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
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
  featurePressable: {
    flex: 1,
  },
  featureGradient: {
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator.transparent,
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
    ...typography.subhead,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing[1],
  },
  featureDesc: {
    ...typography.caption1,
    color: colors.text.secondary,
    flex: 1,
  },
  featureArrow: {
    alignSelf: 'flex-end',
  },
});
