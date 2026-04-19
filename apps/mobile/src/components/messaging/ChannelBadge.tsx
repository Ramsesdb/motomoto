import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useColors } from '@/hooks/useColors';
import { borderRadius, spacing } from '@/design';
import type { ChannelType } from '@/types';

interface ChannelBadgeProps {
  channel: ChannelType;
  size?: number;
}

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const CHANNEL_ICON: Record<ChannelType, IconName> = {
  whatsapp: 'whatsapp',
  instagram: 'instagram',
  facebook: 'facebook',
  sms: 'message-text',
  email: 'email',
};

export function ChannelBadge({ channel, size = 28 }: ChannelBadgeProps) {
  const colors = useColors();
  const iconSize = Math.round(size * 0.57);
  const brandColor = colors.channel[channel];

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: borderRadius.full,
          backgroundColor: `${brandColor}26`,
          borderWidth: 2,
          borderColor: brandColor,
        },
      ]}
    >
      <MaterialCommunityIcons name={CHANNEL_ICON[channel]} size={iconSize} color={brandColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[1],
  },
});
