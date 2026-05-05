/**
 * Priority Queue implementation for promotions
 * Sorts promotions by priority (higher number = higher priority = first to dequeue)
 * 
 * Uses a simple sorted array approach for clarity (beginner-friendly)
 * In production, you'd use a MaxHeap, but sorted array is easier to understand
 */

import { Promotion } from '../types/index';

/**
 * Creates a max priority queue from an array of promotions
 * Sorts by priority descending (highest priority first)
 * 
 * @param promotions - Array of promotions to add to queue
 * @returns Sorted array with highest priority promotions first
 */
export function createMaxPriorityQueue(promotions: Promotion[]): Promotion[] {
  // Create a copy to avoid mutating original array
  const queue = [...promotions];
  
  // Sort by priority descending (higher number = higher priority = first)
  queue.sort((a, b) => b.priority - a.priority);
  
  return queue;
}

/**
 * Dequeues (removes and returns) the highest priority promotion
 * 
 * @param queue - The priority queue array (modified in place)
 * @returns The highest priority promotion, or null if queue is empty
 */
export function dequeue(queue: Promotion[]): Promotion | null {
  // Remove and return the first item (highest priority)
  return queue.shift() || null;
}

/**
 * Checks if the priority queue is empty
 * 
 * @param queue - The priority queue array
 * @returns True if queue has no items
 */
export function isEmpty(queue: Promotion[]): boolean {
  return queue.length === 0;
}
