import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { GlassCard } from '@/components/ui/GlassCard';
import { useColors } from '@/hooks/useColors';
import { spacing, typography } from '@/design';
import type { ThemeColors } from '@/design';

export default function AISummaryScreen() {
  const router = useRouter();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Resumen de Conversación</Text>
        <View style={styles.backButton} />
      </View>
      <View style={styles.body}>
        <GlassCard style={styles.comingSoon}>
          <MaterialCommunityIcons name="text-box-outline" size={48} color={colors.accent.info} />
          <Text style={styles.comingSoonTitle}>Próximamente</Text>
          <Text style={styles.comingSoonDesc}>
            El resumen automático de conversaciones estará disponible en la próxima versión.
          </Text>
        </GlassCard>
      </View>
    </SafeAreaView>
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
  body: { flex: 1, padding: spacing[4], justifyContent: 'center' },
  comingSoon: { alignItems: 'center', padding: spacing[8], gap: spacing[3] },
  comingSoonTitle: { ...typography.title3, fontWeight: '600', color: colors.text.primary },
  comingSoonDesc: { ...typography.subhead, color: colors.text.secondary, textAlign: 'center', lineHeight: 20 },
});
