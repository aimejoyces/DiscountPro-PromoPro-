/**
 * Zustand store for favorites/wishlist management
 * Uses SQLite for local persistence
 */

import { create } from 'zustand';
import { getFavorites, addFavorite, removeFavorite, initDatabase } from '../lib/sqlite';
import { Product } from '../types';

// Initialize SQLite database
initDatabase();

interface FavoritesState {
  favorites: Product[];
  loading: boolean;
  error: string | null;

  loadFavorites: () => void;
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  loading: false,
  error: null,

  loadFavorites: () => {
    try {
      const items = getFavorites();
      set({ favorites: items, error: null });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load favorites',
      });
    }
  },

  addToFavorites: (product: Product) => {
    try {
      addFavorite(product);
      get().loadFavorites();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add to favorites',
      });
    }
  },

  removeFromFavorites: (productId: string) => {
    try {
      removeFavorite(productId);
      get().loadFavorites();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to remove from favorites',
      });
    }
  },

  isFavorite: (productId: string) => {
    const { favorites } = get();
    return favorites.some(item => item.id === productId);
  },
}));
