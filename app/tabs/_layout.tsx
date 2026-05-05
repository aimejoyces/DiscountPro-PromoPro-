import { Tabs } from 'expo-router';
import { StitchBottomNav } from '../../src/components/StitchBottomNav';
import { colors } from '../../src/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Hide default tab bar
      }}
      tabBar={(props) => <StitchBottomNav />}
    >
      <Tabs.Screen name="shop" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
