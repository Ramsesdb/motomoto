# Motomoto

Mobile CRM and unified messaging platform for managing customer conversations across WhatsApp, Instagram, Facebook, SMS, and Email — all in one place.

## Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 55 + React Native 0.83 |
| Language | TypeScript (strict) |
| Navigation | Expo Router v55 (typed routes) |
| State | Zustand v5 |
| Architecture | New Architecture (Fabric enabled) |
| Animations | react-native-reanimated v4 |
| Auth tokens | expo-secure-store |
| Images | expo-image |
| UI effects | expo-blur (glassmorphism) |
| HTTP | Axios |

## Project Structure

```
src/
  types/        — shared TypeScript interfaces (no logic)
  design/       — visual tokens only (colors, spacing, typography)
  mock/         — typed mock data in Spanish for development
  services/     — API + external service layer
  store/        — Zustand stores (global state)
  hooks/        — custom React hooks
  components/
    ui/         — primitive components (GlassCard, Avatar, etc.)
    messaging/  — chat/inbox-specific components
    ai/         — AI feature components
    navigation/ — TabBar and navigation chrome
app/            — Expo Router screens (thin — logic in hooks/stores)
```

Path alias: `@/` → `src/`

## Getting Started

```bash
nvm use          # sets Node 20.19.4 via .nvmrc
npm install
npx expo start
```

> Expo Go does **not** support Google Sign-In. Use `expo-dev-client` for full native builds.

## Build Phases

| Phase | Description | Status |
|---|---|---|
| 0 | Project initialization | ✅ Done |
| 1 | TypeScript types | ✅ Done |
| 2 | Design system | ✅ Done |
| 3 | Mock data | ✅ Done |
| 4 | Service stubs | ✅ Done |
| 5 | Zustand stores | ✅ Done |
| 6 | Base UI components | ⬜ |
| 7 | Messaging components | ⬜ |
| 8 | Navigation shell | ⬜ |
| 9 | Screens | ⬜ |

## Key Rules

- **No hardcoded values** — all colors/spacing from `src/design/`
- **Role checks** — always `hasMinRole('manager')` via `ROLE_HIERARCHY`, never `=== 'manager'`
- **Zustand selectors** — wrap object/array selectors with `useShallow`
- **AI calls** — only through `src/services/ai.ts`
- **Auth tokens** — `expo-secure-store` only, never `AsyncStorage`
- **Images** — `expo-image` only, never RN `<Image>`
- **Animations** — `react-native-reanimated` v4 `withSpring`, never `Animated` from RN
- **TypeScript** — `strict: true`, zero errors, no `any`, no `!` assertions

## Deep Links

Scheme: `motomoto://`
