import { Tabs } from 'expo-router';

import { TabBar } from '@/components/navigation/TabBar';
import { useRole } from '@/hooks/useRole';

/**
 * Main app layout — tab navigator with a custom BlurView tab bar.
 *
 * Role-conditional visibility:
 *   - `team`     → manager+ only  (href: null for agents)
 *   - `reports`  → manager+ only  (href: null for agents)
 *   - `settings` → admin only     (href: null for agent/manager)
 *
 * Hidden tabs are removed from the tab bar via `href: null` (Expo Router).
 * The screens remain navigable programmatically if needed.
 *
 * All screens suppress the default header — each screen manages its own header
 * or uses a custom navigation bar component.
 */
export default function AppLayout() {
  const isManager = useRole('manager');
  const isAdmin = useRole('admin');

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* ── Always visible ─────────────────────────────────────────────────── */}
      <Tabs.Screen
        name="home"
        options={{ title: 'Inicio' }}
      />
      <Tabs.Screen
        name="inbox"
        options={{ title: 'Mensajes' }}
      />
      <Tabs.Screen
        name="ai"
        options={{ title: 'IA' }}
      />

      {/* ── Manager+ only ──────────────────────────────────────────────────── */}
      <Tabs.Screen
        name="team"
        options={{
          title: 'Equipo',
          href: isManager ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reportes',
          href: isManager ? undefined : null,
        }}
      />

      {/* ── Always visible ─────────────────────────────────────────────────── */}
      <Tabs.Screen
        name="profile"
        options={{ title: 'Perfil' }}
      />

      {/* ── Admin only ─────────────────────────────────────────────────────── */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          href: isAdmin ? undefined : null,
        }}
      />
    </Tabs>
  );
}
