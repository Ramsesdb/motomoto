import { Tabs } from 'expo-router';

import { TabBar } from '@/components/navigation/TabBar';
import { useRole } from '@/hooks/useRole';
import { useColors } from '@/hooks/useColors';

export default function AppLayout() {
  const isManager = useRole('manager');
  const colors = useColors();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background.primary },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="inbox" options={{ title: 'Mensajes' }} />
      <Tabs.Screen name="ai" options={{ title: 'IA' }} />
      <Tabs.Screen
        name="team"
        options={{ title: 'Equipo', href: isManager ? undefined : null }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
      {/* Hidden from tab bar — accessible via navigation */}
      <Tabs.Screen name="reports" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}
