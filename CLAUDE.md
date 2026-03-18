# Motomoto — Claude Code Context

Mobile CRM and unified messaging platform.
**Stack:** Expo SDK 55 · React Native 0.83 · TypeScript strict · Expo Router v55 · Zustand v5 · New Architecture (Fabric)

---

## Project Structure

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

Path alias: `@/` → `src/`. Always use `@/`, never relative paths.

---

## Phases Status

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Project initialization | ✅ Done |
| 1 | TypeScript types | ✅ Done |
| 2 | Design system | ⬜ Next |
| 3 | Mock data | ⬜ |
| 4 | Service stubs | ⬜ |
| 5 | Zustand stores | ⬜ |
| 6 | Base UI components | ⬜ |
| 7 | Messaging components | ⬜ |
| 8 | Navigation shell | ⬜ |
| 9 | Screens | ⬜ |

---

## Phase 1 — Types (Done)

All files in `src/types/`:

| File | Key exports |
|------|-------------|
| `user.ts` | `UserRole`, `UserStatus`, `User`, `AuthUser`, `ROLE_HIERARCHY` |
| `channel.ts` | `ChannelType`, `Channel` |
| `message.ts` | `Message`, `MessageStatus`, `MessageRole`, `MessageClassification`, `MessageAttachment` |
| `conversation.ts` | `Conversation`, `Contact`, `AIContext`, `ConversationStatus`, `ConversationPriority` |
| `api.ts` | `ApiResponse<T>`, `ApiError`, `PaginationParams`, `PaginatedResponse<T>` |
| `websocket.ts` | `WebSocketEvent`, `WebSocketMessage` (discriminated union), 12 payload types |
| `index.ts` | re-exports all |

---

## Non-Negotiable Rules

### TypeScript
- `strict: true` — zero errors always
- No `any` — use `unknown` + type guards
- No `!` non-null assertions — use `?.` or explicit checks
- AI fields are **always optional**: `aiContext?`, `suggestedReply?`, `classification?`
- Run `npx tsc --noEmit` before marking any phase complete

### Architecture
- **Role checks** — always `hasMinRole('manager')` via `ROLE_HIERARCHY`, never `user.role === 'manager'`
- **Zustand selectors** — wrap object/array selectors with `useShallow` from `zustand/react/shallow`
- **AI calls** — only through `src/services/ai.ts` (never direct from components)
- **WebSocket events** — dispatch to Zustand store actions directly, never through React Context
- **Auth tokens** — `expo-secure-store` only, never `AsyncStorage`
- **Images** — `expo-image` only, never RN's built-in `<Image>`
- **Screens are thin** — all logic lives in stores and hooks

### Styling
- No hardcoded colors, spacing, or radii — all values from `src/design/`
- Blur/glass → `GlassCard` component (wraps `expo-blur`)
- Animations → `react-native-reanimated` v4 with `withSpring`, never `Animated` from RN
- Keyboard → `<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>`

### Mock Data
- All mock objects must satisfy interfaces exactly — no `any`, no `Partial<>`
- Names and messages in **Spanish** (Latin American)
- `MOCK_CURRENT_USER` defaults to `role: 'manager'`

---

## Key Dependencies

```json
"expo": "~55.0.7"
"react-native": "0.83.2"
"expo-router": "~55.0.6"
"zustand": "^5.0.12"
"react-native-reanimated": "4.2.1"
"expo-secure-store": "~55.0.9"
"expo-image": "~55.0.6"
"expo-blur": "~55.0.10"
"axios": "^1.13.6"
"immer": "^11.1.4"
```

Node: **20.19.4** (`nvm use` reads `.nvmrc` automatically)

---

## App Config Highlights

- `scheme: "motomoto"` — deep links use `motomoto://`
- `newArchEnabled: true` — do not disable
- `typedRoutes: true` — use typed `href` props, not raw strings
- Expo Go won't work for Google Sign-In → use `expo-dev-client`
- `USE_NATIVE_GOOGLE_SIGNIN` flag in `src/constants.ts` controls auth flow
