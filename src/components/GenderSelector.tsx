import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GENDER_LABELS, type Gender } from '../types';
import { colors, spacing } from '../theme';

const GENDERS = Object.keys(GENDER_LABELS) as Gender[];

interface Props {
  value: Gender | null;
  onChange: (gender: Gender) => void;
}

export default function GenderSelector({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {GENDERS.map((gender) => {
        const selected = value === gender;
        return (
          <TouchableOpacity
            key={gender}
            style={[styles.chip, selected && styles.chipSelected]}
            onPress={() => onChange(gender)}
          >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
              {GENDER_LABELS[gender]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 15,
    color: colors.text,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
