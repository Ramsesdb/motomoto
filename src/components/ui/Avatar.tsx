import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { useColors } from '@/hooks/useColors';
import { typography } from '@/design';
import type { ThemeColors } from '@/design';
import type { UserStatus } from '@/types';

interface AvatarProps {
  name: string;
  uri?: string;
  size?: number;
  status?: UserStatus;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

export function Avatar({ name, uri, size = 40, status }: AvatarProps) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const dotSize = Math.round(size * 0.275);
  const fontSize = Math.round(size * 0.375);

  return (
    <View style={{ width: size, height: size }}>
      {uri !== undefined ? (
        <Image
          source={uri}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
          contentFit="cover"
        />
      ) : (
        <View
          style={[
            styles.initialsContainer,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={[styles.initials, { fontSize }]} numberOfLines={1}>
            {getInitials(name)}
          </Text>
        </View>
      )}
      {status !== undefined && (
        <View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: colors.status[status],
            },
          ]}
        />
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    image: {
      position: 'absolute',
    },
    initialsContainer: {
      backgroundColor: colors.surfaceContainerHigh,
      alignItems: 'center',
      justifyContent: 'center',
    },
    initials: {
      color: colors.onSurfaceVariant,
      fontWeight: typography.headline.fontWeight,
    },
    dot: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      borderWidth: 2,
      borderColor: colors.background.primary,
    },
  });
