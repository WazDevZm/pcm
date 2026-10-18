import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

import { useCart } from '@/providers/CartProvider';
import { colors, fonts } from '@/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const icon = (name: IconName, active: IconName) => {
  const TabIcon = ({ color, focused }: { color: import('react-native').ColorValue; focused: boolean }) => (
    <Ionicons name={focused ? active : name} size={24} color={color as string} />
  );
  return TabIcon;
};

export default function TabLayout() {
  const { itemCount } = useCart();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerTintColor: colors.navy,
        headerTitleStyle: { fontFamily: fonts.serifBold, color: colors.text },
        headerStyle: { backgroundColor: colors.light },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false, tabBarIcon: icon('home-outline', 'home') }} />
      <Tabs.Screen name="events" options={{ title: 'Events', tabBarIcon: icon('calendar-outline', 'calendar') }} />
      <Tabs.Screen name="bands" options={{ title: 'Bands', tabBarIcon: icon('people-outline', 'people') }} />
      <Tabs.Screen
        name="merch"
        options={{
          title: 'Merch',
          tabBarIcon: icon('bag-handle-outline', 'bag-handle'),
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.gold, color: colors.dark },
        }}
      />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: icon('menu-outline', 'menu') }} />
    </Tabs>
  );
}
