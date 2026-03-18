import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { colors, typography } from '@/design';
import type { UserStatus } from '@/types';

interface AvatarProps {
  /** Full name — used to derive 1–2 letter initials when no URI is available. */
  name: string;
  /** Remote or local image URI. When absent, initials are shown. */
  uri?: string;
  /** Diameter in logical pixels. Defaults to 40. */
  size?: number;
  /** When provided, a coloured dot is rendered at the bottom-right corner. */
  status?: UserStatus;
}

/** Extract up to two initials (first + last word) from a full name. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

/**
 * Circular user avatar.
 * Shows `uri` via expo-image if supplied; otherwise renders initials on a
 * dark surface. An optional presence dot maps `UserStatus` → design token colour.
 */
export function Avatar({ name, uri, size = 40, status }: AvatarProps) {
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

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
  },
  initialsContainer: {
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.text.secondary,
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
