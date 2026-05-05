/**
 * TypeScript interfaces for the Discount Engine app
 * These types define the shape of our data across the entire application
 */

// Promotion type enum - the 5 types of promotions our engine supports
export type PromotionType = 
  | 'PERCENTAGE_OFF'
  | 'FIXED_AMOUNT_OFF'
  | 'BUY_X_GET_Y_FREE'
  | 'TIERED_SPEND'
  | 'FLASH_SALE';

// Promotion interface - represents a discount promotion in our system
export interface Promotion {
  id: string;
  type: PromotionType;
  value: number; // percentage or fixed amount discount
  minCartTotal?: number; // minimum cart total to qualify
  applicableProductIds?: string[]; // empty or undefined = applies to all products
  mutuallyExclusiveWith?: string[]; // list of promotion IDs that can't stack with this
  priority: number; // higher number = evaluated first
  isActive: boolean;
  startTime?: string; // ISO time string for flash sales (e.g., "12:00")
  endTime?: string; // ISO time string (e.g., "14:00")
  overridesAll?: boolean; // true = this promotion disables all others
  code?: string | null; // coupon code for manual entry (nullable for DB)
}

// Product interface - represents a product in our shop
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url: string;
  category: string;
  created_at: string;
}

// Cart item interface - represents an item in the user's cart
export interface CartItem {
  id: string; // local SQLite ID (integer in DB, but string for consistency)
  product_id: string; // references products.id
  quantity: number;
  price_at_add: number; // price when added to cart (for historical accuracy)
  name?: string; // optional product name for display
  image_url?: string; // optional image for display
}

// Discount breakdown item - shows how each promotion affected the price
export interface DiscountBreakdown {
  promotionId: string;
  promotionType: PromotionType;
  description: string;
  discountAmount: number;
}

// Result of running the discount engine
export interface DiscountResult {
  originalTotal: number;
  discountBreakdown: DiscountBreakdown[];
  finalTotal: number;
  appliedPromotions: Promotion[];
}

// Order interface - represents a completed order
export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  original_total: number;
  final_total: number;
  applied_promotions: Promotion[];
  status: 'Processing' | 'Shipped' | 'Delivered';
  created_at: string;
}

// User profile interface - extends Supabase auth user
export interface UserProfile {
  id: string; // FK to auth.users
  display_name: string;
  email: string;
}

// Supabase Auth types (simplified)
export interface AuthUser {
  id: string;
  email?: string;
}

export interface AuthSession {
  access_token: string;
  user: AuthUser;
}
