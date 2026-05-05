import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { colors, typography, spacing } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const tabs = [
  { id: 'shop', label: 'Shop', icon: 'storefront-outline', activeIcon: 'storefront' },
  { id: 'cart', label: 'Cart', icon: 'bag-outline', activeIcon: 'bag' },
  { id: 'orders', label: 'Orders', icon: 'receipt-outline', activeIcon: 'receipt' },
  { id: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

export function StitchBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const getCurrentTab = () => {
    if (pathname.includes('/cart')) return 'cart';
    if (pathname.includes('/orders')) return 'orders';
    if (pathname.includes('/profile')) return 'profile';
    return 'shop';
  };

  const currentTab = getCurrentTab();

  const handleTabPress = (tabId: string) => {
    switch (tabId) {
      case 'shop':
        router.push('/(tabs)/shop');
        break;
      case 'cart':
        router.push('/(tabs)/cart');
        break;
      case 'orders':
        router.push('/(tabs)/orders');
        break;
      case 'profile':
        router.push('/(tabs)/profile');
        break;
    }
  };

  return (
    <View style={styles.nav}>
      <View style={styles.navContent}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => handleTabPress(tab.id)}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? tab.activeIcon as any : tab.icon as any}
                size={24}
                color={isActive ? colors.primary : colors.outline}
              />
              <Text style={[
                styles.tabLabel,
                isActive && styles.tabLabelActive
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainer,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 50,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[1],
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    color: colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing[1],
  },
  tabLabelActive: {
    color: colors.primary,
  },
});
