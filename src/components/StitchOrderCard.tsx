import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Order } from '../types/index';
import { colors, typography, spacing } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface StitchOrderCardProps {
  order: Order;
  onPress?: () => void;
}

export function StitchOrderCard({ order, onPress }: StitchOrderCardProps) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    'Processing': { bg: 'rgba(0,88,188,0.1)', text: colors.primary },
    'Delivered': { bg: 'rgba(1,110,0,0.1)', text: colors.secondary },
    'Shipped': { bg: 'rgba(0,123,255,0.1)', text: '#007BFF' },
  };

  const statusStyle = statusColors[order.status] || statusColors['Processing'];

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.orderId}>Order #{order.id}</Text>
          <Text style={styles.orderDate}>Placed on {new Date(order.created_at).toLocaleDateString()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          {order.status === 'Processing' && (
            <View style={[styles.statusDot, { backgroundColor: colors.primary }]} />
          )}
          {order.status === 'Delivered' && (
            <Ionicons name="checkmark-circle" size={12} color={statusStyle.text} />
          )}
          <Text style={[styles.statusText, { color: statusStyle.text }]}>{order.status}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={24} color={colors.outline} />
          </View>
        </View>
        <View style={styles.details}>
          <Text style={styles.items} numberOfLines={1}>
            {order.items?.map((item: any) => item.name).join(', ') || 'Order items'}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.total}>₱{order.final_total.toLocaleString()}</Text>
            {order.original_total > order.final_total && (
              <View style={styles.savingsBadge}>
                <Ionicons name="flash" size={10} color={colors.onPrimary} />
                <Text style={styles.savingsText}>Saved ₱{(order.original_total - order.final_total).toLocaleString()}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {order.status === 'Delivered' && (
        <View style={styles.actions}>
          <TouchableOpacity>
            <Text style={styles.actionText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.actionText}>Buy Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius:12,
    shadowColor: '#000',
    shadowOffset: { width:0, height:1 },
    shadowOpacity:0.05,
    shadowRadius:2,
    elevation:2,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing[4],
  },
  orderId: {
    fontSize:10,
    fontWeight: typography.fontWeight.bold,
    color: colors.outline,
    textTransform: 'uppercase',
    letterSpacing:0.5,
  },
  orderDate: {
    fontSize: typography.fontSize.sm,
    color: colors.onSurfaceVariant,
    fontWeight: typography.fontWeight.medium,
    marginTop:2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius:9999,
    fontSize:10,
    fontWeight: typography.fontWeight.bold,
  },
  statusDot: {
    width:6,
    height:6,
    borderRadius:3,
  },
  statusText: {
    fontSize:10,
    fontWeight: typography.fontWeight.bold,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    gap: spacing[4],
  },
  imageContainer: {
    width:64,
    height:64,
    borderRadius:8,
    backgroundColor: colors.surfaceContainer,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex:1,
  },
  items: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
    marginBottom: spacing[1],
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  total: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:2,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing[2],
    paddingVertical:2,
    borderRadius:6,
  },
  savingsText: {
    fontSize:10,
    fontWeight: typography.fontWeight.bold,
    color: colors.onPrimary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[4],
    padding: spacing[2],
    paddingHorizontal: spacing[4],
    borderTopWidth:1,
    borderTopColor: colors.surfaceContainer,
  },
  actionText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing:0.5,
  },
});
