/**
 * Zustand store for promotion management
 * 
 * Handles:
 * - Fetching active promotions from Supabase
 * - Adding new promotions (admin)
 * - Toggling promotion active status
 */

import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Promotion } from '../types';

// Define the shape of our promotion store state
interface PromotionState {
  // State
  promotions: Promotion[]; // List of all promotions
  loading: boolean; // True when fetching
  error: string | null; // Error message

  // Actions
  fetchActivePromotions: () => Promise<void>;
  addPromotion: (promotion: Omit<Promotion, 'id' | 'created_at'>) => Promise<void>;
  togglePromotion: (id: string, isActive: boolean) => Promise<void>;
}

// Create the promotion store
export const usePromotionStore = create<PromotionState>((set, get) => ({
  // Initial state
  promotions: [],
  loading: false,
  error: null,

  /**
   * Fetch all active promotions from Supabase
   * Used in coupon modal and admin screen
   */
  fetchActivePromotions: async () => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (error) throw error;

      set({
        promotions: data as Promotion[] || [],
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch promotions',
        loading: false,
      });
    }
  },

  /**
   * Add a new promotion to Supabase (admin function)
   * 
   * @param promotion - Promotion data without id and created_at
   */
  addPromotion: async (promotion) => {
    set({ loading: true, error: null });

    try {
      const { error } = await supabase
        .from('promotions')
        .insert([promotion]);

      if (error) throw error;

      // Refresh the list
      await get().fetchActivePromotions();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add promotion',
        loading: false,
      });
    }
  },

  /**
   * Toggle a promotion's active status
   * 
   * @param id - Promotion ID to toggle
   * @param isActive - New active status
   */
  togglePromotion: async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      set((state) => ({
        promotions: state.promotions.map(p =>
          p.id === id ? { ...p, isActive } : p
        ),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to toggle promotion',
      });
    }
  },
}));
