import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../types';
import { colors, typography, spacing } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface StitchProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export function StitchProductCard({ product, onPress }: StitchProductCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(product)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image_url || 'https://via.placeholder.com/300' }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₱{product.price.toLocaleString()}</Text>
        </View>
        <View style={styles.stockRow}>
          <Ionicons
            name="checkmark-circle"
            size={12}
            color={colors.secondary}
          />
          <Text style={styles.stockText}>
            {product.stock > 0
              ? product.stock <= 12
                ? `Only ${product.stock} left`
                : 'In Stock'
              : 'Out of Stock'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surfaceContainer,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    aspectRatio: 1,
    backgroundColor: colors.surfaceContainerLow,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: 4,
  },
  hotBadge: {
    backgroundColor: colors.tertiary,
  },
  discountText: {
    color: colors.onPrimary,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  info: {
    padding: spacing[3],
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.onSurface,
    marginBottom: spacing[1],
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[2],
  },
  price: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  originalPrice: {
    fontSize: typography.fontSize.xs,
    color: colors.outline,
    textDecorationLine: 'line-through',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginTop: spacing[2],
  },
  stockText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.secondary,
  },
});
