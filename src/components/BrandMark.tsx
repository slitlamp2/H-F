import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../theme';

interface Props {
  compact?: boolean;
}

/** 앱 워드마크. 애터미 전용 로고를 복제하지 않고 브랜드 블루만 쓴다. */
export default function BrandMark({ compact = false }: Props) {
  return (
    <View style={styles.row}>
      <View style={[styles.badge, compact && styles.badgeCompact]}>
        <View style={styles.wing} />
        <Text style={[styles.letter, compact && styles.letterCompact]}>A</Text>
      </View>
      <View>
        <Text style={[styles.name, compact && styles.nameCompact]}>H&F</Text>
        {!compact ? <Text style={styles.tagline}>정직한 피부 · 두피 케어</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCompact: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  wing: {
    position: 'absolute',
    top: 7,
    width: 18,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  letter: {
    color: colors.onPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  letterCompact: {
    fontSize: 14,
    marginTop: 3,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.4,
  },
  nameCompact: {
    fontSize: 15,
  },
  tagline: {
    marginTop: 1,
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: -0.2,
  },
});
