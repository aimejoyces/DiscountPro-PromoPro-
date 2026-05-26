-- =====================================================
-- SUPABASE DATABASE SCHEMA FOR DISCOUNT ENGINE APP
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: products
-- Stores all products available in the shop
-- =====================================================
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: profiles
-- Stores user profile information (linked to auth.users)
-- =====================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view and update their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- =====================================================
-- TABLE: promotions
-- Stores all discount promotions and coupon codes
-- =====================================================
CREATE TABLE promotions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('PERCENTAGE_OFF', 'FIXED_AMOUNT_OFF', 'BUY_X_GET_Y_FREE', 'TIERED_SPEND', 'FLASH_SALE')),
  value NUMERIC NOT NULL CHECK (value >= 0),
  min_cart_total NUMERIC DEFAULT 0,
  applicable_product_ids UUID[] DEFAULT '{}',
  mutually_exclusive_with UUID[] DEFAULT '{}',
  priority INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  start_time TIME,
  end_time TIME,
  overrides_all BOOLEAN DEFAULT FALSE,
  code TEXT, -- Nullable: for manual coupon code entry
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: orders
-- Stores completed orders
-- =====================================================
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  items JSONB NOT NULL, -- Array of CartItem objects
  original_total NUMERIC NOT NULL CHECK (original_total >= 0),
  final_total NUMERIC NOT NULL CHECK (final_total >= 0),
  applied_promotions JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own orders
CREATE POLICY "Users can view own orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- SAMPLE DATA: Insert sample products
-- =====================================================
INSERT INTO products (name, price, stock, image_url, category) VALUES
  ('Wireless Headphones', 1299.00, 50, 'https://example.com/headphones.jpg', 'Electronics'),
  ('Cotton T-Shirt', 349.00, 100, 'https://example.com/tshirt.jpg', 'Clothing'),
  ('Coffee Mug', 199.00, 200, 'https://example.com/mug.jpg', 'Home'),
  ('Notebook', 89.00, 150, 'https://example.com/notebook.jpg', 'Stationery'),
  ('Desk Lamp', 899.00, 30, 'https://example.com/lamp.jpg', 'Home');

-- =====================================================
-- SAMPLE DATA: Insert sample promotions
-- =====================================================
INSERT INTO promotions (type, value, min_cart_total, priority, is_active) VALUES
  ('PERCENTAGE_OFF', 10, 500, 1, TRUE),
  ('FIXED_AMOUNT_OFF', 50, 500, 2, TRUE);

-- =====================================================
-- FUNCTION: Auto-create profile on user signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
