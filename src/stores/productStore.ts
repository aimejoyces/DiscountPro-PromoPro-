/**
 * Zustand store for product state management
 * Handles paginated product fetching, single product lookup, and state resets
 */

import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

// Number of products to fetch per page (pagination constant)
const PRODUCTS_PER_PAGE = 10;

// Define the shape of our product store state
interface ProductState {
  products: Product[]; // List of products fetched so far
  page: number; // Current pagination page (starts at 1)
  loading: boolean; // True when fetching products
  error: string | null; // Error message if fetch fails
  hasMore: boolean; // True if more products exist in DB

  // Actions
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  searchProducts: (query: string) => Promise<void>;
  resetProducts: () => void;
}

// Create the product store
export const useProductStore = create<ProductState>((set, get) => ({
  // Initial state
  products: [],
  page: 1,
  loading: false,
  error: null,
  hasMore: true,

  /**
   * Fetch products from Supabase with pagination
   * Appends new products to existing list, increments page
   * Sets hasMore to false if fewer than PRODUCTS_PER_PAGE items returned
   */
  fetchProducts: async () => {
    const { page, loading, hasMore } = get();

    // Prevent duplicate fetches or fetching when no more products exist
    if (loading || !hasMore) return;

    set({ loading: true, error: null });

    try {
      // Calculate range for Supabase query (0-indexed)
      const from = (page - 1) * PRODUCTS_PER_PAGE;
      const to = page * PRODUCTS_PER_PAGE - 1;

      // Fetch products from Supabase with pagination range
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      // Update state with new products
      set((state) => ({
        products: [...state.products, ...(data || [])],
        page: page + 1,
        // If we got fewer items than requested, no more products exist
        hasMore: (data?.length || 0) >= PRODUCTS_PER_PAGE,
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        loading: false,
      });
    }
  },

  /**
   * Fetch a single product by its ID from Supabase
   * @param id - UUID of the product to fetch
   * @returns Product object or null if not found
   */
  fetchProductById: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      set({ loading: false });
      return data as Product | null;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch product',
        loading: false,
      });
      return null;
    }
  },

  /**
   * Search products by name with debounced input
   * Clears existing products and shows search results
   */
  searchProducts: async (query: string) => {
    if (!query.trim()) {
      // If search is cleared, reload normal products
      set({ products: [], page: 1, hasMore: true, loading: false });
      get().fetchProducts();
      return;
    }

    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      set({
        products: data || [],
        hasMore: false, // No pagination for search results
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to search products',
        loading: false,
      });
    }
  },

  /**
   * Reset product list and pagination state
   * Used for pull-to-refresh to start from page 1 again
   */
  resetProducts: () => {
    set({
      products: [],
      page: 1,
      hasMore: true,
      error: null,
    });
  },
}));
