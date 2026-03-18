import { Stack } from 'expo-router';

/**
 * Auth group layout.
 * Wraps login + onboarding screens in a simple Stack with no visible header.
 * Header-less screens maintain a clean, immersive auth experience.
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Slide-up presentation for onboarding feel
        animation: 'slide_from_right',
      }}
    />
  );
}
