/**
 * SQLite helper for local cart persistence
 * Uses expo-sqlite to store cart items locally (not synced to Supabase)
 * 
 * Schema is whiteboard-explainable:
 * - id: local unique ID (integer primary key)
 * - product_id: references products.id in Supabase (for lookup)
 * - quantity: how many of this product in cart
 * - price_at_add: price when added (for historical accuracy)
 */

import * as SQLite from 'expo-sqlite';
import { CartItem, Product } from '../types/index';

// Open (or create) the local SQLite database
const db = SQLite.openDatabaseSync('discountpro.db');

/**
 * Initializes the database by creating the cart_items table if it doesn't exist
 * Should be called once when the app starts
 */
export function initDatabase(): void {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      price_at_add REAL NOT NULL,
      name TEXT,
      image_url TEXT
    );
    
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL UNIQUE,
      name TEXT,
      price REAL,
      image_url TEXT,
      category TEXT
    );
  `);
}

/**
 * Adds an item to the cart or updates quantity if it already exists
 * 
 * @param productId - UUID of the product
 * @param quantity - Quantity to add (default 1)
 * @param price - Price at time of adding
 * @param name - Product name (optional, for display)
 * @param imageUrl - Product image (optional, for display)
 */
export function addCartItem(
  productId: string,
  quantity: number,
  price: number,
  name?: string,
  imageUrl?: string
): void {
  // Check if item already exists in cart
  const existing = db.getFirstSync<{ id: number; quantity: number }>(
    'SELECT id, quantity FROM cart_items WHERE product_id = ?',
    [productId]
  );

  if (existing) {
    // Update quantity of existing item
    const newQuantity = existing.quantity + quantity;
    db.runSync('UPDATE cart_items SET quantity = ? WHERE id = ?', [
      newQuantity,
      existing.id,
    ]);
  } else {
    // Insert new item
    db.runSync(
      'INSERT INTO cart_items (product_id, quantity, price_at_add, name, image_url) VALUES (?, ?, ?, ?, ?)',
      [productId, quantity, price, name || null, imageUrl || null]
    );
  }
}

/**
 * Retrieves all items from the cart
 * @returns Array of CartItem objects
 */
export function getCartItems(): CartItem[] {
  const rows = db.getAllSync<{
    id: number;
    product_id: string;
    quantity: number;
    price_at_add: number;
    name: string | null;
    image_url: string | null;
  }>('SELECT * FROM cart_items', []);

  // Map SQLite rows to CartItem interface
  return rows.map((row) => ({
    id: row.id.toString(), // Convert to string for consistency
    product_id: row.product_id,
    quantity: row.quantity,
    price_at_add: row.price_at_add,
    name: row.name || undefined,
    image_url: row.image_url || undefined,
  }));
}

/**
 * Updates the quantity of a specific cart item
 * 
 * @param itemId - Local cart item ID
 * @param newQuantity - New quantity (if 0 or less, removes item)
 */
export function updateCartItemQuantity(
  itemId: string,
  newQuantity: number
): void {
  if (newQuantity <= 0) {
    // Remove item if quantity is 0 or less
    removeCartItem(itemId);
    return;
  }

  db.runSync('UPDATE cart_items SET quantity = ? WHERE id = ?', [
    newQuantity,
    parseInt(itemId),
  ]);
}

/**
 * Removes an item from the cart
 * 
 * @param itemId - Local cart item ID to remove
 */
export function removeCartItem(itemId: string): void {
  db.runSync('DELETE FROM cart_items WHERE id = ?', [parseInt(itemId)]);
}

/**
 * Clears all items from the cart
 * Used after checkout or manual clear
 */
export function clearCart(): void {
  db.runSync('DELETE FROM cart_items', []);
}

/**
 * Gets the total count of items in the cart
 * @returns Total quantity across all items
 */
export function getCartItemCount(): number {
  const result = db.getFirstSync<{ total: number }>(
    'SELECT SUM(quantity) as total FROM cart_items',
    []
  );
  return result?.total || 0;
}

/**
 * Favorites functions
 */
export function getFavorites(): Product[] {
  const rows = db.getAllSync<{
    id: number;
    product_id: string;
    name: string | null;
    price: number | null;
    image_url: string | null;
    category: string | null;
  }>('SELECT * FROM favorites', []);
  
  return rows.map((row) => ({
    id: row.product_id,
    name: row.name || 'Product',
    price: row.price || 0,
    stock: 0,
    image_url: row.image_url || '',
    category: row.category || '',
    created_at: '',
  }));
}

export function addFavorite(product: Product): void {
  db.runSync(
    'INSERT OR REPLACE INTO favorites (product_id, name, price, image_url, category) VALUES (?, ?, ?, ?, ?)',
    [product.id, product.name, product.price, product.image_url, product.category]
  );
}

export function removeFavorite(productId: string): void {
  db.runSync('DELETE FROM favorites WHERE product_id = ?', [productId]);
}

export function isFavorite(productId: string): boolean {
  const result = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM favorites WHERE product_id = ?',
    [productId]
  );
  return (result?.count || 0) > 0;
}
