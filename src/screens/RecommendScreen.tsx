import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useRequiredProfile } from '../context/ProfileContext';
import { getGuides, getProductReviewLabel, getRecommendedProducts } from '../core/recommend';
import { AGE_GROUP_LABELS, CONCERN_LABELS, GENDER_LABELS } from '../types';
import { colors, radius, shadows, spacing } from '../theme';

export default function RecommendScreen() {
  const { profile } = useRequiredProfile();
  const guides = getGuides(profile);
  const products = getRecommendedProducts(profile);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.headline}>
        {profile.gender ? `${GENDER_LABELS[profile.gender]} ` : ''}
        {AGE_GROUP_LABELS[profile.ageGroup]} 맞춤 가이드
      </Text>

      {guides.map((guide) => (
        <View key={guide.id} style={styles.guideCard}>
          <Text style={styles.guideConcern}>{CONCERN_LABELS[guide.concern]}</Text>
          <Text style={styles.guideTitle}>{guide.title}</Text>
          <Text style={styles.guideBody}>{guide.body}</Text>
        </View>
      ))}

      <Text style={styles.headline}>추천 제품·성분</Text>
      <Text style={styles.disclaimer}>
        {getProductReviewLabel()}. 애터미몰에서 구할 수 있는 제품 기준이에요.
        의약품이 필요하면 전문가와 상담하세요.
      </Text>

      {products.map((product) => (
        <View key={product.id} style={styles.productCard}>
          <View style={styles.productHeader}>
            <Text style={styles.productName}>
              {product.name} ({product.brand})
            </Text>
            <Text style={styles.productCategory}>{product.category}</Text>
          </View>
          {product.keyIngredients.length > 0 && (
            <View style={styles.ingredientRow}>
              {product.keyIngredients.map((ingredient) => (
                <Text key={ingredient} style={styles.ingredientChip}>
                  {ingredient}
                </Text>
              ))}
            </View>
          )}
          <Text style={styles.productDescription}>{product.description}</Text>
          <View style={styles.atomyBox}>
            <Text style={styles.atomyBadge}>애터미몰</Text>
            <View style={styles.atomyCopy}>
              <Text style={styles.atomyName}>{product.atomy.name}</Text>
              {product.atomy.note ? (
                <Text style={styles.atomyNote}>{product.atomy.note}</Text>
              ) : null}
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.sm + 4,
  },
  headline: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.sm,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
  },
  guideCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  guideConcern: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  guideBody: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 21,
  },
  productCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.card,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  productName: {
    flex: 1,
    marginRight: spacing.sm,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  productCategory: {
    fontSize: 12,
    color: colors.textMuted,
    flexShrink: 0,
    marginTop: 2,
  },
  ingredientRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
  },
  ingredientChip: {
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  productDescription: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 19,
  },
  atomyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  atomyBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.onPrimary,
    backgroundColor: colors.primary,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 1,
  },
  atomyCopy: {
    flex: 1,
    gap: 2,
  },
  atomyName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 18,
  },
  atomyNote: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
  },
});
