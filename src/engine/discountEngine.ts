/**
 * CORE DISCOUNT ENGINE - This is the graded algorithm for your capstone
 * 
 * Implements a rule-based discount system with:
 * - Priority queue for promotion ordering
 * - Greedy selection with mutual exclusivity handling
 * - Support for 5 promotion types
 * - Flash sale override capability
 * 
 * Algorithm Steps (memorize these for oral exam):
 * Step 1: Load active promotions into MAX priority queue (sorted by priority)
 * Step 2: Filter out promotions that don't meet conditions
 * Step 3: Greedy selection loop (dequeue, check conflicts, add if no conflict)
 * Step 4: Apply selected promotions and compute final price
 * Step 5: Return discount breakdown and final total
 */

import { Promotion, CartItem, DiscountResult, DiscountBreakdown } from '../types/index';
import { createMaxPriorityQueue, dequeue, isEmpty } from './priorityQueue';
import { isFlashSaleActive, getActiveFlashSales } from './flashSale';

// Named constant for flash sale time window (for easy modification)
const FLASH_SALE_START = '12:00';
const FLASH_SALE_END = '14:00';

/**
 * Main discount engine function
 * Takes cart items and available promotions, returns discounted total
 * 
 * @param cartItems - Array of items in the user's cart
 * @param allPromotions - Array of all active promotions from database
 * @param manualCouponCode - Optional coupon code entered by user
 * @returns DiscountResult with original total, breakdown, and final total
 */
export function calculateDiscount(
  cartItems: CartItem[],
  allPromotions: Promotion[],
  manualCouponCode?: string
): DiscountResult {
  
  // STEP 5 (return): Initialize result object
  const result: DiscountResult = {
    originalTotal: 0,
    discountBreakdown: [],
    finalTotal: 0,
    appliedPromotions: [],
  };

  // Handle empty cart edge case
  if (cartItems.length === 0) {
    return result; // Return zeros for empty cart
  }

  // Calculate original cart total
  const originalTotal = cartItems.reduce((sum, item) => {
    return sum + (item.price_at_add * item.quantity);
  }, 0);
  result.originalTotal = originalTotal;

  // STEP 1: Load active promotions into MAX priority queue
  // Filter to only active promotions first
  let activePromotions = allPromotions.filter(p => p.isActive);
  
  // Handle manual coupon code entry (edge case: coupon doesn't exist)
  if (manualCouponCode) {
    const couponPromo = allPromotions.find(
      p => p.code === manualCouponCode && p.isActive
    );
    // If coupon code doesn't exist, ignore it (don't crash)
    if (!couponPromo) {
      // Return original total with no discounts
      result.finalTotal = originalTotal;
      return result;
    }
    // Add the found coupon to active promotions
    activePromotions.push(couponPromo);
  }

  // Check for flash sale override (set overridesAll flag if active)
  const activeFlashSales = getActiveFlashSales(activePromotions);
  const flashSale = activeFlashSales.length > 0 ? activeFlashSales[0] : null;
  
  // If flash sale is active with overridesAll, ONLY apply flash sale
  if (flashSale && flashSale.overridesAll) {
    return applyFlashSaleOverride(flashSale, originalTotal, cartItems);
  }

  // Filter out inactive flash sales (outside time window)
  activePromotions = activePromotions.filter(p => {
    if (p.type === 'FLASH_SALE') {
      // Only keep flash sales that are currently active
      if (!p.startTime || !p.endTime) return true; // Keep if no time set
      return isFlashSaleActive(p.startTime, p.endTime);
    }
    return true; // Keep non-flash promotions
  });

  // Create MAX priority queue (sorted by priority descending)
  const priorityQueue = createMaxPriorityQueue(activePromotions);

  // STEP 2: Filter promotions that don't meet conditions
  const validPromotions = priorityQueue.filter(promo => 
    isPromotionValid(promo, cartItems, originalTotal)
  );

  // Re-create queue with only valid promotions
  const validQueue = createMaxPriorityQueue(validPromotions);

  // STEP 3: Greedy selection loop
  const selectedPromotions: Promotion[] = [];

  while (!isEmpty(validQueue)) {
    // Dequeue highest priority promotion
    const promo = dequeue(validQueue);
    if (!promo) break;

    // Check mutual exclusivity conflicts (both directions)
    const hasConflict = checkMutualExclusivity(promo, selectedPromotions);
    
    if (!hasConflict) {
      // No conflict, add to selected list
      selectedPromotions.push(promo);
    }
    // If conflict, skip this promotion (do not add)
  }

  // STEP 4: Apply selected promotions and compute final price
  let runningTotal = originalTotal;
  const breakdown: DiscountBreakdown[] = [];

  for (const promo of selectedPromotions) {
    const discount = applyPromotion(promo, cartItems, runningTotal);
    
    if (discount > 0) {
      breakdown.push({
        promotionId: promo.id,
        promotionType: promo.type,
        description: getPromotionDescription(promo),
        discountAmount: discount,
      });
      runningTotal -= discount;
    }
  }

  // Update result
  result.discountBreakdown = breakdown;
  result.finalTotal = Math.max(0, runningTotal); // Don't go below 0
  result.appliedPromotions = selectedPromotions;

  return result;
}

/**
 * Checks if a promotion is valid for the current cart
 * Filters out promotions that don't meet their conditions
 * 
 * @param promo - Promotion to check
 * @param cartItems - Current cart items
 * @param cartTotal - Total cart value
 * @returns True if promotion can be applied
 */
function isPromotionValid(
  promo: Promotion,
  cartItems: CartItem[],
  cartTotal: number
): boolean {
  // Check minimum cart total threshold
  if (promo.minCartTotal && cartTotal < promo.minCartTotal) {
    return false;
  }

  // Check if promotion applies to specific products
  if (promo.applicableProductIds && promo.applicableProductIds.length > 0) {
    // Check if cart contains any applicable products
    const hasApplicableProduct = cartItems.some(item =>
      promo.applicableProductIds!.includes(item.product_id)
    );
    if (!hasApplicableProduct) return false;
  }

  // For BUY_X_GET_Y_FREE, check if cart quantity meets X requirement
  if (promo.type === 'BUY_X_GET_Y_FREE') {
    // X is stored in value (e.g., value=2 means "buy 2")
    const buyQuantity = promo.value;
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Edge case: cart quantity less than X
    if (totalQuantity < buyQuantity) return false;
  }

  // For TIERED_SPEND, we handle it in applyPromotion (pick highest tier)
  // No early filtering needed here

  return true;
}

/**
 * Checks if a promotion conflicts with already-selected promotions
 * Uses the mutuallyExclusiveWith list (checks both directions)
 * 
 * @param promo - Promotion to check
 * @param selectedPromos - Array of already selected promotions
 * @returns True if there's a conflict (should skip this promotion)
 */
function checkMutualExclusivity(
  promo: Promotion,
  selectedPromos: Promotion[]
): boolean {
  // Check if this promo conflicts with any selected promo
  if (promo.mutuallyExclusiveWith && promo.mutuallyExclusiveWith.length > 0) {
    for (const excludedId of promo.mutuallyExclusiveWith) {
      if (selectedPromos.some(p => p.id === excludedId)) {
        return true; // Conflict: this promo excludes a selected one
      }
    }
  }

  // Check if any selected promo excludes this promo
  for (const selectedPromo of selectedPromos) {
    if (selectedPromo.mutuallyExclusiveWith && 
        selectedPromo.mutuallyExclusiveWith.includes(promo.id)) {
      return true; // Conflict: a selected promo excludes this one
    }
  }

  return false; // No conflict
}

/**
 * Applies a single promotion and returns the discount amount
 * 
 * @param promo - Promotion to apply
 * @param cartItems - Cart items (for BUY_X_GET_Y_FREE calculations)
 * @param currentTotal - Current running total before this promotion
 * @returns Discount amount (positive number)
 */
function applyPromotion(
  promo: Promotion,
  cartItems: CartItem[],
  currentTotal: number
): number {
  let discount = 0;

  switch (promo.type) {
    case 'PERCENTAGE_OFF':
      // Apply percentage discount (e.g., 10% off)
      discount = currentTotal * (promo.value / 100);
      break;

    case 'FIXED_AMOUNT_OFF':
      // Apply fixed amount discount (e.g., ₱50 off)
      discount = Math.min(promo.value, currentTotal); // Don't exceed total
      break;

    case 'BUY_X_GET_Y_FREE':
      // Calculate free items (value = X, Y is always 1 for simplicity)
      // For each X items, get 1 free (cheapest item)
      discount = calculateBuyXGetYFree(promo, cartItems);
      break;

    case 'TIERED_SPEND':
      // Pick highest qualifying tier (value = percentage discount)
      // For simplicity, treat value as the discount percentage
      discount = currentTotal * (promo.value / 100);
      break;

    case 'FLASH_SALE':
      // Flash sale treated as percentage off
      discount = currentTotal * (promo.value / 100);
      break;
  }

  return Math.min(discount, currentTotal); // Don't discount more than total
}

/**
 * Calculates BUY_X_GET_Y_FREE discount
 * For every X items purchased, get the cheapest 1 free
 * 
 * @param promo - Promotion with value = X (buy quantity)
 * @param cartItems - Cart items
 * @returns Total discount amount from free items
 */
function calculateBuyXGetYFree(
  promo: Promotion,
  cartItems: CartItem[]
): number {
  const buyQuantity = promo.value; // X in "Buy X Get Y"
  let totalDiscount = 0;

  // If promotion applies to specific products, only count those
  let applicableItems = cartItems;
  if (promo.applicableProductIds && promo.applicableProductIds.length > 0) {
    applicableItems = cartItems.filter(item =>
      promo.applicableProductIds!.includes(item.product_id)
    );
  }

  // Calculate total quantity of applicable items
  const totalQuantity = applicableItems.reduce(
    (sum, item) => sum + item.quantity, 
    0
  );

  // Edge case: quantity less than X (already filtered, but double-check)
  if (totalQuantity < buyQuantity) return 0;

  // Calculate how many free items (1 free per X purchased)
  const freeItemCount = Math.floor(totalQuantity / buyQuantity);

  // Sort items by price (cheapest first) to maximize discount
  const sortedItems = [...applicableItems].sort(
    (a, b) => a.price_at_add - b.price_at_add
  );

  // Apply free items to cheapest products first
  let remainingFree = freeItemCount;
  for (const item of sortedItems) {
    if (remainingFree <= 0) break;
    
    const freeFromThisItem = Math.min(item.quantity, remainingFree);
    totalDiscount += freeFromThisItem * item.price_at_add;
    remainingFree -= freeFromThisItem;
  }

  return totalDiscount;
}

/**
 * Handles flash sale override: clears all other promotions
 * 
 * @param flashSale - The active flash sale promotion
 * @param originalTotal - Original cart total
 * @returns DiscountResult with only flash sale applied
 */
function applyFlashSaleOverride(
  flashSale: Promotion,
  originalTotal: number,
  cartItems: CartItem[]
): DiscountResult {
  const discount = originalTotal * (flashSale.value / 100);
  
  return {
    originalTotal,
    discountBreakdown: [{
      promotionId: flashSale.id,
      promotionType: flashSale.type,
      description: `Flash Sale: ${flashSale.value}% off`,
      discountAmount: discount,
    }],
    finalTotal: Math.max(0, originalTotal - discount),
    appliedPromotions: [flashSale],
  };
}

/**
 * Generates a human-readable description for a promotion
 * 
 * @param promo - Promotion to describe
 * @returns Description string for UI display
 */
function getPromotionDescription(promo: Promotion): string {
  switch (promo.type) {
    case 'PERCENTAGE_OFF':
      return `${promo.value}% off`;
    case 'FIXED_AMOUNT_OFF':
      return `₱${promo.value} off`;
    case 'BUY_X_GET_Y_FREE':
      return `Buy ${promo.value} Get 1 Free`;
    case 'TIERED_SPEND':
      return `Tiered: ${promo.value}% off`;
    case 'FLASH_SALE':
      return `Flash Sale: ${promo.value}% off`;
    default:
      return 'Discount applied';
  }
}
