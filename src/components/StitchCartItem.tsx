import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { CartItem as CartItemType } from '../types';
import { colors, typography, spacing } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface StitchCartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, change: number) => void;
  onRemove: (id: string) => void;
}

export default function StitchCartItem({ item, onUpdateQuantity, onRemove }: StitchCartItemProps) {
  const subtotal = item.price_at_add * item.quantity;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image_url || 'https://via.placeholder.com/120' }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.details}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name || 'Product'}
          </Text>
          <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeButton}>
            <Ionicons name="close" size={18} color={colors.outline} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => onUpdateQuantity(item.id, -1)}
            >
              <Ionicons name="remove" size={14} color={colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => onUpdateQuantity(item.id, 1)}
            >
              <Ionicons name="add" size={14} color={colors.onSurface} />
            </TouchableOpacity>
          </View>

          <View style={styles.priceSection}>
            {item.price_at_add < item.price_at_add * 1.2 && (
              <Text style={styles.originalPrice}>₱{(item.price_at_add * 1.2).toFixed(2)}</Text>
            )}
            <Text style={styles.price}>₱{subtotal.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius:12,
    padding: spacing[4],
    gap: spacing[4],
    borderWidth:1,
    borderColor: colors.outlineVariant,
    shadowColor: '#000',
    shadowOffset: { width:0, height:1 },
    shadowOpacity:0.05,
    shadowRadius:2,
    elevation:2,
  },
  imageContainer: {
    width:96,
    height:96,
    borderRadius:8,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerLow,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    flex:1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.onSurface,
    flex:1,
    lineHeight:20,
    marginRight: spacing[2],
  },
  removeButton: {
    padding: spacing[1],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainer,
    borderRadius:8,
    padding: spacing[1],
    borderWidth:1,
    borderColor: colors.outlineVariant,
  },
  qtyButton: {
    width:32,
    height:32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    width:40,
    textAlign: 'center',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.onSurface,
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize:10,
    color: colors.outline,
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});
