import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, spacing } from '../../../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function CheckoutScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [saveAddress, setSaveAddress] = useState(false);

  const handlePlaceOrder = async () => {
    try {
      // Get cart items and discount result
      const cartStore = require('../../../src/stores/cartStore').useCartStore.getState();
      const authStore = require('../../../src/stores/authStore').useAuthStore.getState();
      
      if (!authStore.user) {
        alert('Please sign in to place an order');
        return;
      }

      const { items, discountResult, getCartTotal } = cartStore;
      
      if (items.length === 0) {
        alert('Your cart is empty');
        return;
      }

      // Create order in Supabase
      const { data, error } = await require('../../../src/lib/supabase').supabase
        .from('orders')
        .insert({
          user_id: authStore.user.id,
          items: items,
          original_total: discountResult?.originalTotal || getCartTotal(),
          final_total: discountResult?.finalTotal || getCartTotal(),
          applied_promotions: discountResult?.appliedPromotions || [],
        })
        .select()
        .single();

      if (error) throw error;

      // Clear cart after successful order
      cartStore.clearCart();

      // Navigate to orders screen
      router.push('/(tabs)/orders');
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>DiscountPro</Text>
        </View>
        <Ionicons name="bag-outline" size={20} color={colors.primary} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Progress Steps */}
        <View style={styles.stepsContainer}>
          <View style={styles.stepsRow}>
            <StepCircle num={1} label="Shipping" active={currentStep === 1} />
            <View style={[styles.stepLine, currentStep > 1 && styles.stepLineActive]} />
            <StepCircle num={2} label="Payment" active={currentStep === 2} />
            <View style={[styles.stepLine, currentStep > 2 && styles.stepLineActive]} />
            <StepCircle num={3} label="Review" active={currentStep === 3} />
          </View>
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="car-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Shipping Address</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John"
                  placeholderTextColor={colors.outline}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Doe"
                  placeholderTextColor={colors.outline}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Street Address</Text>
              <TextInput
                style={styles.input}
                placeholder="123 Shopping Lane"
                placeholderTextColor={colors.outline}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.thirdInput}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  placeholder="New York"
                  placeholderTextColor={colors.outline}
                />
              </View>
              <View style={styles.thirdInput}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={styles.input}
                  placeholder="NY"
                  placeholderTextColor={colors.outline}
                />
              </View>
              <View style={styles.thirdInput}>
                <Text style={styles.label}>ZIP Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10001"
                  placeholderTextColor={colors.outline}
                />
              </View>
            </View>

            <View style={styles.checkboxRow}>
              <Switch
                value={saveAddress}
                onValueChange={setSaveAddress}
                trackColor={{ false: colors.surfaceContainerHighest, true: colors.primary }}
                thumbColor={colors.surfaceContainerLowest}
              />
              <Text style={styles.checkboxLabel}>Save this address for future orders</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>

          <View style={styles.paymentGrid}>
            <TouchableOpacity style={[styles.paymentCard, styles.paymentCardActive]}>
              <View style={styles.paymentHeader}>
                <Ionicons name="card-outline" size={20} color={colors.primary} />
                <View style={styles.paymentRadio}>
                  <View style={styles.paymentRadioInner} />
                </View>
              </View>
              <Text style={styles.paymentLabel}>Credit / Debit Card</Text>
              <Text style={styles.paymentSublabel}>Secure checkout with encryption</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                <Ionicons name="wallet-outline" size={20} color={colors.onSurfaceVariant} />
                <View style={styles.paymentRadio} />
              </View>
              <Text style={styles.paymentLabel}>Digital Wallet</Text>
              <Text style={styles.paymentSublabel}>Apple Pay, Google Pay, PayPal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderText}>Place Order</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.onPrimary} />
        </TouchableOpacity>
        <Text style={styles.secureText}>
          <Ionicons name="lock-closed" size={12} /> 100% Encrypted & Secure Payment
        </Text>
      </View>
    </View>
  );
}

function StepCircle({ num, label, active }: { num: number; label: string; active: boolean }) {
  return (
    <View style={styles.stepContainer}>
      <View style={[styles.stepCircle, active && styles.stepCircleActive]}>
        <Text style={[styles.stepNumber, active && styles.stepNumberActive]}>{num}</Text>
      </View>
      <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: colors.surface,
  },
  header: {
    backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth:1,
    borderBottomColor: colors.surfaceContainer,
    shadowColor: '#000',
    shadowOffset: { width:0, height:1 },
    shadowOpacity:0.05,
    shadowRadius:2,
    elevation:2,
    zIndex:50,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    paddingHorizontal: spacing[4],
    height:56,
  },
  backButton: {
    padding: spacing[2],
    borderRadius:9999,
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.black,
    color: colors.primary,
    letterSpacing:-0.5,
  },
  scrollView: {
    flex:1,
  },
  stepsContainer: {
    paddingVertical: spacing[8],
    alignItems: 'center',
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth:768,
    width:'100%',
    paddingHorizontal: spacing[4],
  },
  stepContainer: {
    alignItems: 'center',
    flex:1,
  },
  stepCircle: {
    width:32,
    height:32,
    borderRadius:16,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:10,
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
  },
  stepNumber: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurfaceVariant,
  },
  stepNumberActive: {
    color: colors.onPrimary,
  },
  stepLabel: {
    fontSize:10,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurfaceVariant,
    marginTop: spacing[2],
  },
  stepLabelActive: {
    color: colors.primary,
  },
  stepLine: {
    flex:1,
    height:2,
    backgroundColor: colors.surfaceContainerHighest,
  },
  stepLineActive: {
    backgroundColor: colors.primaryContainer,
  },
  section: {
    padding: spacing[6],
    backgroundColor: colors.surfaceContainerLowest,
    marginHorizontal: spacing[4],
    marginBottom: spacing[4],
    borderRadius:12,
    shadowColor: '#000',
    shadowOffset: { width:0, height:1 },
    shadowOpacity:0.05,
    shadowRadius:2,
    elevation:2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
  },
  form: {
    gap: spacing[4],
  },
  inputGroup: {
    gap: spacing[1],
  },
  row: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  halfInput: {
    flex:1,
  },
  thirdInput: {
    flex:1,
  },
  label: {
    fontSize:10,
    fontWeight: typography.fontWeight.bold,
    color: colors.outline,
    textTransform: 'uppercase',
    letterSpacing:0.5,
    marginBottom: spacing[1],
  },
  input: {
    height:48,
    paddingHorizontal: spacing[4],
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth:1,
    borderColor: colors.outlineVariant,
    borderRadius:8,
    fontSize: typography.fontSize.base,
    color: colors.onSurface,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingTop: spacing[2],
  },
  checkboxLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.onSurfaceVariant,
  },
  paymentGrid: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  paymentCard: {
    flex:1,
    padding: spacing[4],
    borderWidth:1,
    borderColor: colors.outlineVariant,
    borderRadius:12,
    gap: spacing[4],
  },
  paymentCardActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0,88,188,0.05)',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  paymentRadio: {
    width:20,
    height:20,
    borderRadius:10,
    borderWidth:2,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentRadioInner: {
    width:8,
    height:8,
    borderRadius:4,
    backgroundColor: colors.primary,
  },
  paymentLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
  },
  paymentSublabel: {
    fontSize:10,
    color: colors.onSurfaceVariant,
  },
  footer: {
    padding: spacing[4],
    paddingBottom: spacing[8],
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth:1,
    borderTopColor: colors.surfaceContainer,
  },
  placeOrderButton: {
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
  placeOrderText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.onPrimary,
  },
  secureText: {
    textAlign: 'center',
    fontSize:10,
    color: colors.onSurfaceVariant,
    marginTop: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
