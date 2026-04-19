# m2-front (Motomoto)

Monorepo for the Motomoto mobile CRM and unified messaging platform. Manages customer conversations across WhatsApp, Instagram, Facebook, SMS, and Email — all in one place.

## Monorepo Layout

```
m2-front/
├── apps/
│   └── mobile/          — @m2/mobile : Expo SDK 55 + React Native 0.83 app
├── packages/
│   ├── types/           — @m2/types  : shared TypeScript interfaces
│   └── design/          — @m2/design : design tokens (colors, spacing, typography)
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
└── package.json         — workspace runner (pnpm + Turborepo)
```

| Package | Description |
|---|---|
| `@m2/mobile` | Expo/React Native app — the phone client |
| `@m2/types` | Pure TypeScript interfaces consumed by mobile (and future web apps) |
| `@m2/design` | Design tokens (color palettes, spacing scale, typography) |

## Stack

| Layer | Technology |
|---|---|
| Package manager | **pnpm 9.x** (via Corepack) |
| Task runner | **Turborepo v2** |
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

## Getting Started

```bash
# 1. Node 20.19.4 (nvm reads .nvmrc)
nvm use

# 2. Enable pnpm via Corepack (once per machine)
corepack enable
corepack prepare pnpm@9.15.0 --activate

# 3. Install dependencies at the workspace root
pnpm install

# 4. Start Metro for the mobile app
pnpm --filter @m2/mobile start
#  or equivalently:
pnpm mobile:start
```

> Expo Go does **not** support Google Sign-In. Use `expo-dev-client` for full native builds.

### Windows long paths

pnpm's hoisted tree plus nested monorepo paths can hit Windows' 260-char limit. If `pnpm install` fails with path errors:

```bash
git config --global core.longpaths true
# pnpm 9.x additional knob (optional):
pnpm config set long-paths true
```

## Common Commands

```bash
pnpm install                         # install all workspace deps
pnpm --filter @m2/mobile start       # start Metro for mobile
pnpm -w typecheck                    # typecheck all workspaces via Turbo
pnpm -w build                        # build all workspaces (no-op for mobile)
pnpm -w lint                         # lint all workspaces (once configured)
pnpm mobile android                  # open Android dev client
pnpm mobile ios                      # open iOS simulator
```

## Path Aliases

- Inside `apps/mobile/`: `@/*` resolves to `apps/mobile/src/*` (screens, components, hooks, stores, services, mocks).
- Across the workspace: `@m2/types` and `@m2/design` resolve to `packages/*/src/index.ts` via pnpm's `workspace:*` protocol.

## Key Rules

- **No hardcoded values** — all colors/spacing from `@m2/design`
- **Role checks** — always `hasMinRole('manager')` via `ROLE_HIERARCHY`, never `=== 'manager'`
- **Zustand selectors** — wrap object/array selectors with `useShallow`
- **AI calls** — only through `apps/mobile/src/services/ai.ts`
- **Auth tokens** — `expo-secure-store` only, never `AsyncStorage`
- **Images** — `expo-image` only, never RN `<Image>`
- **Animations** — `react-native-reanimated` v4 `withSpring`, never `Animated` from RN
- **TypeScript** — `strict: true`, zero errors, no `any`, no `!` assertions
- **Typecheck cadence** — run `pnpm -w typecheck` before marking any phase complete

## Deep Links

Scheme: `motomoto://`

## Remotes

This repo is pushed to two GitHub remotes via dual-URL `origin`:

- `Ramsesdb/motomoto` (original mirror)
- `raoole20/m2-front` (authoritative — PRs target this)

A single `git push origin <branch>` fans out to both.
