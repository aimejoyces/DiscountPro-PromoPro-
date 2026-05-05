/**
 * Zustand store for cart state management
 * 
 * Handles:
 * - Cart items (stored locally in SQLite)
 * - Coupon code input
 * - Running the discount engine
 * - Discount breakdown display
 */

import { create } from 'zustand';
import { 
  CartItem, 
  Promotion, 
  DiscountResult 
} from '../types/index';
import { 
  getCartItems, 
  addCartItem, 
  updateCartItemQuantity, 
  removeCartItem, 
  clearCart,
  initDatabase,
  getCartItemCount 
} from '../lib/sqlite';
import { calculateDiscount } from '../engine/discountEngine';
import { supabase } from '../lib/supabase';

// Initialize SQLite database when store is first imported
initDatabase();

// Define the shape of our cart store state
interface CartState {
  // State
  items: CartItem[]; // Cart items loaded from SQLite
  couponCode: string; // Manual coupon code entered by user
  appliedPromotions: Promotion[]; // Promotions applied after running engine
  discountResult: DiscountResult | null; // Full result from discount engine
  loading: boolean; // True when fetching/saving cart
  error: string | null; // Error message

  // Actions
  loadCart: () => void;
  addItem: (productId: string, quantity: number, price: number, name?: string, imageUrl?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  applyCoupon: (code: string) => Promise<void>;
  runDiscountEngine: () => Promise<void>;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

// Create the cart store
export const useCartStore = create<CartState>((set, get) => ({
  // Initial state
  items: [],
  couponCode: '',
  appliedPromotions: [],
  discountResult: null,
  loading: false,
  error: null,

  /**
   * Load cart items from SQLite database
   * Called on app start and after cart modifications
   */
  loadCart: () => {
    try {
      const items = getCartItems();
      set({ items, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load cart' 
      });
    }
  },

  /**
   * Add an item to the cart
   * Saves to SQLite and reloads cart state
   */
  addItem: (productId: string, quantity: number, price: number, name?: string, imageUrl?: string) => {
    try {
      addCartItem(productId, quantity, price, name, imageUrl);
      get().loadCart(); // Reload cart from SQLite
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add item' 
      });
    }
  },

  /**
   * Remove an item from the cart by local item ID
   */
  removeItem: (itemId: string) => {
    try {
      removeCartItem(itemId);
      get().loadCart();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to remove item' 
      });
    }
  },

  /**
   * Update quantity of a cart item
   */
  updateQuantity: (itemId: string, newQuantity: number) => {
    try {
      updateCartItemQuantity(itemId, newQuantity);
      get().loadCart();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update quantity' 
      });
    }
  },

  /**
   * Apply a coupon code entered by the user
   * Runs the discount engine with the coupon code
   */
  applyCoupon: async (code: string) => {
    set({ couponCode: code, loading: true, error: null });

    try {
      // Fetch active promotions from Supabase (needed for engine)
      const { data: promotions, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      // Run discount engine with coupon code
      const result = calculateDiscount(
        get().items,
        promotions || [],
        code
      );

      set({
        discountResult: result,
        appliedPromotions: result.appliedPromotions,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to apply coupon',
        loading: false,
      });
    }
  },

  /**
   * Run the discount engine to calculate discounts
   * Called when cart changes or promotions are updated
   */
  runDiscountEngine: async () => {
    set({ loading: true, error: null });

    try {
      // Fetch active promotions from Supabase
      const { data: promotions, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      // Run discount engine
      const result = calculateDiscount(
        get().items,
        promotions || [],
        get().couponCode || undefined
      );

      set({
        discountResult: result,
        appliedPromotions: result.appliedPromotions,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to run discount engine',
        loading: false,
      });
    }
  },

  /**
   * Clear all items from cart
   */
  clearCart: () => {
    try {
      clearCart(); // Clear SQLite
      set({
        items: [],
        discountResult: null,
        appliedPromotions: [],
        couponCode: '',
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to clear cart' 
      });
    }
  },

  /**
   * Calculate the original cart total (before discounts)
   * @returns Total price of all items in cart
   */
  getCartTotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => {
      return sum + (item.price_at_add * item.quantity);
    }, 0);
  },

  /**
   * Get total number of items in cart (sum of quantities)
   * @returns Total item count
   */
  getItemCount: () => {
    return getCartItemCount();
  },
}));
