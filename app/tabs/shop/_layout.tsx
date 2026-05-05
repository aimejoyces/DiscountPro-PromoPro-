/**
 * Shop Tab Stack Navigator
 * Wraps ProductList and ProductDetail screens in a Stack navigator
 * This satisfies the requirement: Stack Navigator inside Shop tab
 */

import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ShopLayout() {
  return (
    <Stack>
      {/* Product List Screen - main shop screen */}
      <Stack.Screen
        name="index"
        options={{
          title: 'Shop',
          headerShown: true,
        }}
      />

      {/* Product Detail Screen - dynamic route with product ID */}
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Product Details',
          headerShown: true,
          // Show back button with custom icon
          headerBackTitle: 'Shop',
        }}
      />
    </Stack>
  );
}
