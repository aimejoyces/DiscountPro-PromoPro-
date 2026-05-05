import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useCartStore } from '../../../src/stores/cartStore';
import { useAuthStore } from '../../../src/stores/authStore';
import { useRouter } from 'expo-router';
import StitchCartItem from '../../../src/components/StitchCartItem';
import { colors, typography, spacing } from '../../../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    items,
    couponCode,
    discountResult,
    loading,
    loadCart,
    removeItem,
    updateQuantity,
    applyCoupon,
    runDiscountEngine,
    getCartTotal,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [showCouponSuccess, setShowCouponSuccess] = useState(false);

  useEffect(() => {
    loadCart();
  }, [user]);

  useEffect(() => {
    if (items.length > 0) {
      runDiscountEngine();
    }
  }, [items]);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    await applyCoupon(couponInput.trim());
    setCouponInput('');
    if (discountResult && discountResult.appliedPromotions.length > 0) {
      setShowCouponSuccess(true);
      setTimeout(() => setShowCouponSuccess(false), 3000);
    }
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    const newQty = item.quantity + change;
    updateQuantity(itemId, newQty);
  };

  const originalTotal = getCartTotal();
  const finalTotal = discountResult?.finalTotal || originalTotal;
  const hasDiscount = discountResult && discountResult.discountBreakdown.length > 0;

  if (loading && items.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading cart...</Text>
      </View>
    );
  }

  if (items.length === 0 && !loading) {
    return (
      <View style={styles.centered}>
        <View style={styles.emptyIcon}>
          <Ionicons name="bag-outline" size={48} color={colors.outline} />
        </View>
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptySubtitle}>Add some products to get started</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => router.push('/(tabs)/shop')}
        >
          <Text style={styles.shopButtonText}>Go Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <Text style={styles.headerCount}>{items.length} ITEMS</Text>
      </View>

      <FlatList
        data={items}
        renderItem={({ item }) => (
          <StitchCartItem
            item={item}
            onUpdateQuantity={handleQuantityChange}
            onRemove={removeItem}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.couponSection}>
        <Text style={styles.sectionLabel}>PROMOTION CODE</Text>
        <View style={styles.couponRow}>
          <View style={styles.couponInputContainer}>
            <TextInput
              style={styles.couponInput}
              placeholder="Enter code"
              value={couponInput}
              onChangeText={setCouponInput}
              autoCapitalize="characters"
              placeholderTextColor={colors.outline}
            />
            {couponCode && (
              <Ionicons name="checkmark-circle" size={18} color={colors.onSecondaryContainer} style={styles.couponCheck} />
            )}
          </View>
          <TouchableOpacity
            style={[styles.applyButton, (!couponInput.trim()) && styles.disabledButton]}
            onPress={handleApplyCoupon}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
        {showCouponSuccess && (
          <Text style={styles.successText}>✓ Coupon applied!</Text>
        )}
      </View>

      <View style={styles.summarySection}>
        <View style={styles.summaryHeader}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <TouchableOpacity style={styles.viewPromotionsButton}>
            <Ionicons name="options-outline" size={14} color={colors.primary} />
            <Text style={styles.viewPromotionsText}>View All Promotions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal ({items.length} items)</Text>
          <Text style={styles.summaryValue}>₱{originalTotal.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping Fee</Text>
          <Text style={styles.freeShipping}>FREE</Text>
        </View>

        {hasDiscount && discountResult && (
          <View style={styles.discountSection}>
            {discountResult.discountBreakdown.map((item, index) => (
              <View key={index} style={styles.discountRow}>
                <View style={styles.discountLabelRow}>
                  <Ionicons name="pricetag-outline" size={12} style={styles.discountIcon} />
                  <Text style={styles.discountLabel}>{item.description}</Text>
                </View>
                <Text style={styles.discountValue}>- ₱{item.discountAmount.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <View style={styles.totalRight}>
              <Text style={styles.totalValue}>₱{finalTotal.toLocaleString()}</Text>
              <Text style={styles.vatText}>VAT Included</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => router.push('/(tabs)/checkout' as any)}
        >
          <Text style={styles.checkoutButtonText}>Secure Checkout</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.onPrimary} />
        </TouchableOpacity>
        <Text style={styles.secureText}>
          <Ionicons name="lock-closed-outline" size={14} /> 100% Encrypted & Secure Payment
        </Text>
      </View>
    </View>
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
    paddingHorizontal: spacing[6],
    backgroundColor: colors.surface,
  },
  emptyIcon: {
    width:96,
    height:96,
    backgroundColor: colors.surfaceContainer,
    borderRadius:48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  emptyTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
    marginBottom: spacing[1],
  },
  emptySubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.outline,
    marginBottom: spacing[6],
  },
  shopButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[3],
    borderRadius:8,
  },
  shopButtonText: {
    color: colors.onPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  loadingText: {
    marginTop: spacing[3],
    fontSize: typography.fontSize.base,
    color: colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[6],
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
  },
  headerCount: {
    fontSize:10,
    fontWeight: typography.fontWeight.bold,
    color: colors.outline,
    letterSpacing:1,
    textTransform: 'uppercase',
  },
  listContent: {
    padding: spacing[4],
    gap: spacing[4],
  },
  couponSection: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing[4],
    borderWidth:1,
    borderColor: colors.outlineVariant,
    borderRadius:12,
    marginHorizontal: spacing[4],
  },
  sectionLabel: {
    fontSize:10,
    fontWeight: typography.fontWeight.bold,
    color: colors.outline,
    letterSpacing:1,
    marginBottom: spacing[1],
  },
  couponRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  couponInputContainer: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth:1,
    borderColor: colors.outlineVariant,
    borderRadius:8,
    paddingHorizontal: spacing[3],
    height:48,
  },
  couponInput: {
    flex:1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.onSurface,
  },
  couponCheck: {
    marginLeft: spacing[2],
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[6],
    borderRadius:8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: colors.onPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  disabledButton: {
    opacity:0.5,
  },
  successText: {
    color: colors.onSecondaryContainer,
    fontSize: typography.fontSize.xs,
    marginTop: spacing[2],
    fontWeight: typography.fontWeight.medium,
  },
  summarySection: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing[4],
    margin: spacing[4],
    borderRadius:12,
    gap: spacing[4],
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
  },
  viewPromotionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  viewPromotionsText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
  },
  summaryLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.outline,
  },
  summaryValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.onSurface,
  },
  freeShipping: {
    fontSize:9,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSecondaryContainer,
    textTransform: 'uppercase',
    letterSpacing:0.5,
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: spacing[2],
    paddingVertical:2,
    borderRadius:4,
  },
  discountSection: {
    gap: spacing[2],
    paddingVertical: spacing[2],
    borderTopWidth:1,
    borderTopColor: colors.outlineVariant,
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  discountIcon: {
    color: colors.onSecondaryContainer,
  },
  discountLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.onSecondaryContainer,
  },
  discountValue: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSecondaryContainer,
  },
  totalSection: {
    borderTopWidth:1,
    borderTopColor: colors.outlineVariant,
    paddingTop: spacing[2],
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
  },
  totalRight: {
    alignItems: 'flex-end',
  },
  totalValue: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  vatText: {
    fontSize:9,
    color: colors.outline,
    letterSpacing:0.5,
    textTransform: 'uppercase',
  },
  checkoutContainer: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing[3],
    borderRadius:12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
    shadowColor: colors.primary,
    shadowOffset: { width:0, height:2 },
    shadowOpacity:0.2,
    shadowRadius:4,
    elevation:4,
  },
  checkoutButtonText: {
    color: colors.onPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  secureText: {
    textAlign: 'center',
    fontSize: typography.fontSize.xs,
    color: colors.outline,
    marginTop: spacing[4],
  },
});
