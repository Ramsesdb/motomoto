# @m2/mobile

The Motomoto Expo app — Expo SDK 55 · React Native 0.83 · Expo Router v55.

## Quick start

```bash
# From the repo root:
pnpm install                         # installs all workspace deps
pnpm --filter @m2/mobile start       # start Metro
pnpm mobile android                  # open Android dev client
pnpm mobile ios                      # open iOS simulator
```

Expo Go does **not** support Google Sign-In. Use `expo-dev-client` (already a dep) for native builds via EAS.

## Type-checking

```bash
pnpm -w typecheck                    # fans out to mobile + packages
pnpm --filter @m2/mobile typecheck   # mobile only
```

## Shared code

- **Types**: `import { User } from '@m2/types'` → `packages/types/src/`
- **Design tokens**: `import { colors, spacing } from '@m2/design'` → `packages/design/src/`
- **In-app**: `import { ChatInput } from '@/components/...'` — `@/` still maps to `apps/mobile/src/`.

## Layout

```
app/      — Expo Router screens (thin)
src/
  components/  ui/, messaging/, ai/, navigation/
  hooks/, services/, store/, mock/, constants.ts
```

See root `README.md` for full monorepo overview.
