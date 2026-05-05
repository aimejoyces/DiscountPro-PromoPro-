import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { colors, typography, spacing } from '../../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { StitchOrderCard } from '../../../src/components/StitchOrderCard';
import { useAuthStore } from '../../../src/stores/authStore';
import { supabase } from '../../../src/lib/supabase';
import { Order } from '../../../src/types';

export default function OrdersScreen() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const totalSavings = orders.reduce((sum, o) => sum + (o.original_total - o.final_total), 0);
  const activeShipments = orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Orders</Text>
        {orders.length > 0 && (
          <View style={styles.recentBadge}>
            <Text style={styles.recentText}>{orders.length} Recent</Text>
          </View>
        )}
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.primaryStat]}>
          <Ionicons name="trending-up" size={24} color={colors.onPrimary} style={styles.statIcon} />
          <View>
            <Text style={styles.statLabel}>Total Lifetime Savings</Text>
            <Text style={styles.statValue}>₱{totalSavings.toLocaleString()}</Text>
          </View>
        </View>
        <View style={[styles.statCard, styles.secondaryStat]}>
          <Ionicons name="car-outline" size={24} color={colors.onPrimary} style={styles.statIcon} />
          <View>
            <Text style={styles.statLabel}>Active Shipments</Text>
            <Text style={styles.statValue}>0{activeShipments}</Text>
            {activeShipments > 0 && (
              <View style={styles.statTrend}>
                <Ionicons name="calendar-outline" size={12} color={colors.onPrimary} />
                <Text style={styles.trendText}>Estimated delivery soon</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.ordersList}>
        {orders.map((order) => (
          <StitchOrderCard key={order.id} order={order} />
        ))}
      </View>

      {orders.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={48} color={colors.outline} />
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptySubtitle}>Your completed orders will appear here</Text>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.loadMoreButton}>
          <Text style={styles.loadMoreText}>Load Order History</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: colors.surface,
    paddingBottom:80,
  },
  centered: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[6],
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
  },
  recentBadge: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius:9999,
  },
  recentText: {
    fontSize:10,
    fontWeight: typography.fontWeight.bold,
    color: colors.onPrimary,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    gap: spacing[4],
    marginBottom: spacing[6],
  },
  statCard: {
    flex:1,
    padding: spacing[6],
    borderRadius:16,
    gap: spacing[4],
  },
  primaryStat: {
    backgroundColor: colors.primary,
  },
  secondaryStat: {
    backgroundColor: colors.secondary,
  },
  statIcon: {
    marginBottom: spacing[4],
    opacity:0.8,
  },
  statLabel: {
    fontSize:10,
    fontWeight: typography.fontWeight.bold,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing:1,
  },
  statValue: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.black,
    color: colors.onPrimary,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginTop: spacing[1],
  },
  trendText: {
    fontSize:10,
    fontWeight: typography.fontWeight.bold,
    color: colors.onPrimary,
  },
  ordersList: {
    paddingHorizontal: spacing[4],
    gap: spacing[4],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[12],
    gap: spacing[2],
  },
  emptyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.outline,
  },
  footer: {
    padding: spacing[8],
    alignItems: 'center',
  },
  loadMoreButton: {
    borderWidth:1,
    borderColor: colors.outline,
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[3],
    borderRadius:8,
  },
  loadMoreText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.outline,
  },
});
