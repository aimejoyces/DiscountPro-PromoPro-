/**
 * Flash Sale utilities
 * Pure functions for checking flash sale time windows
 * These functions are independent and easily unit-testable
 */

import { Promotion } from '../types/index';

/**
 * Checks if the current device time falls within a flash sale time window
 * 
 * @param startTime - Start time in 24-hour format (e.g., "12:00")
 * @param endTime - End time in 24-hour format (e.g., "14:00")
 * @returns True if current time is within the window (inclusive of start, exclusive of end)
 * 
 * Note: Uses device local time, not server time
 * Boundary: At exactly endTime, returns false (window closed)
 */
export function isFlashSaleActive(startTime: string, endTime: string): boolean {
  // Get current device time
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  
  // Convert current time to minutes since midnight for easy comparison
  const currentTotalMinutes = currentHours * 60 + currentMinutes;
  
  // Parse start and end times into minutes since midnight
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  
  // Check if current time is within the window
  // Inclusive of start time, exclusive of end time
  return currentTotalMinutes >= startTotalMinutes && 
         currentTotalMinutes < endTotalMinutes;
}

/**
 * Filters out flash sale promotions that are not currently active
 * Used before the greedy selection loop runs
 * 
 * @param promotions - Array of all active promotions
 * @returns Only flash sale promotions that are currently within their time window
 */
export function getActiveFlashSales(promotions: Promotion[]): Promotion[] {
  return promotions.filter(promo => {
    // Only check flash sales
    if (promo.type !== 'FLASH_SALE') return false;
    
    // Must have start and end times
    if (!promo.startTime || !promo.endTime) return false;
    
    // Check if currently active
    return isFlashSaleActive(promo.startTime, promo.endTime);
  });
}
