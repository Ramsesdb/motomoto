# Motomoto — Project Best Practices

Guidelines every developer (and AI assistant) must follow in this codebase.

---

## Node.js Version

Always use Node **20.19.4** (the minimum required by Expo SDK 55 + React Native 0.83).

```bash
nvm use   # reads .nvmrc automatically
```

The `.nvmrc` file is set to `20.19.4`. Never run npm install with a lower Node version.

---

## Architecture Rules

### 1. Path Aliases — always use `@/`
Never use relative paths (`../../components`). Always use the `@/` alias:

```ts
// ✅ correct
import { colors } from '@/design';
import { useAuthStore } from '@/store/useAuthStore';

// ❌ wrong
import { colors } from '../../design';
```

The alias maps `@/` → `src/` (configured in `tsconfig.json` + `babel.config.js`).

### 2. Design tokens — never hardcode values
All colors, font sizes, spacing, border radii, and shadows come from `src/design/`.
Never hardcode `#ffffff`, `16`, or `borderRadius: 12` directly in a component.

```ts
// ✅ correct
style={{ backgroundColor: colors.background.primary, padding: spacing[4] }}

// ❌ wrong
style={{ backgroundColor: '#0A0A0A', padding: 16 }}
```

### 3. AI calls — only through `src/services/ai.ts`
Never call AI endpoints directly from components or stores. All AI logic routes through:
- `getSuggestion(conversationId)`
- `summarizeConversation(id)`
- `classifyMessage(messageId)`
- `getChatbotStatus(channelId)`

### 4. Role checks — always use `hasMinRole`
Never hardcode role equality checks. Always use the `hasMinRole` function from `useAuthStore`
which uses `ROLE_HIERARCHY` for `>=` comparison:

```ts
// ✅ correct
const canManage = useAuthStore(s => s.hasMinRole('manager'));

// ❌ wrong
const canManage = user?.role === 'manager';
```

### 5. Zustand selectors — use `useShallow` for objects/arrays
Zustand v5 returns new references for object selectors, causing infinite re-renders.
Always wrap non-primitive selectors with `useShallow`:

```ts
import { useShallow } from 'zustand/react/shallow';

// ✅ correct — object selector
const { user, isAuthenticated } = useAuthStore(
  useShallow(s => ({ user: s.user, isAuthenticated: s.isAuthenticated }))
);

// ✅ ok — primitive selector (no useShallow needed)
const isAuthenticated = useAuthStore(s => s.isAuthenticated);

// ❌ wrong — will cause render loop
const { user, isAuthenticated } = useAuthStore(s => ({ user: s.user, isAuthenticated: s.isAuthenticated }));
```

### 6. WebSocket — dispatch to Zustand, not React Context
WS events update store state directly via store actions. Never route WS events through
React Context (too expensive for high-frequency message events).

```ts
// In WebSocketService:
wsService.onEvent('message.new', (payload) => {
  useInboxStore.getState().appendMessage(payload.message); // ✅
});
```

### 7. Token storage — expo-secure-store only
Auth tokens must be stored in `expo-secure-store`, never `AsyncStorage`.
AsyncStorage is unencrypted. `expo-secure-store` uses iOS Keychain / Android Keystore.

### 8. Images — expo-image only
Never use React Native's built-in `<Image>`. Always use `expo-image` `<Image>` for:
- Disk caching (automatic)
- Progressive loading
- Better performance via SDWebImage (iOS) / Glide (Android)

---

## Styling Rules

### Glassmorphism
Use `GlassCard` component which wraps `expo-blur` `BlurView`. Never implement blur manually.
Android needs `BlurTargetView` wrapper (handled inside `GlassCard`).

### Animations
All animations use `react-native-reanimated` v4 with spring physics:
```ts
import { withSpring } from 'react-native-reanimated';
// Use withSpring, never Animated.spring from react-native
```

### Platform-specific keyboard behavior
In every screen with a text input:
```tsx
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
```

---

## TypeScript Rules

- **`strict: true`** — all code must pass with zero TypeScript errors
- **No `any`** — use `unknown` + type guards instead
- **No non-null assertions (`!`)** — use optional chaining `?.` or explicit null checks
- **AI fields are optional** — `aiContext?: AIContext`, `suggestedReply?: string` — never required
- Run `npx tsc --noEmit` before marking any phase complete

---

## File Organization

```
src/
  types/        ← shared TypeScript interfaces (no logic)
  design/       ← visual tokens only (no components)
  mock/         ← typed mock data (no real API calls)
  services/     ← API + external service layer
  store/        ← Zustand stores (global state)
  hooks/        ← custom React hooks
  components/
    ui/         ← primitive components (GlassCard, Avatar, etc.)
    messaging/  ← chat/inbox-specific components
    ai/         ← AI feature components
    navigation/ ← TabBar and navigation chrome
app/            ← Expo Router screens (thin — logic in hooks/stores)
```

**Screens are thin.** Logic lives in stores and hooks. Screens only render and wire up events.

---

## Mock Data Rules

- All mock objects must satisfy their TypeScript interfaces exactly (no `any`, no `Partial<>`)
- Names and messages are in **Spanish** (Latin American)
- `MOCK_CURRENT_USER` defaults to `role: 'manager'` so all role-gated screens render during dev
- To test agent-only view: change `MOCK_CURRENT_USER` to the agent user temporarily

---

## Commit / PR Guidelines

- Never commit `node_modules`
- One phase = one PR ideally
- Run `npx tsc --noEmit` before every commit
- Test on both iOS and Android simulators before marking a phase done

---

## Expo-Specific Rules

- **New Architecture is enabled** (`newArchEnabled: true` in `app.json`) — do not disable
- **Expo Go won't work** for Google Sign-In — use `expo-dev-client` for real builds
- **`USE_NATIVE_GOOGLE_SIGNIN`** flag in `src/constants.ts` controls which auth flow is active
- Deep links use `motomoto://` scheme — always pass `href` as typed Expo Router paths
- `typedRoutes: true` is enabled — use typed `href` props, not raw strings
