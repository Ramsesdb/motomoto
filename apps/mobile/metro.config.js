// Expo SDK 55 + pnpm workspace Metro config.
// Derived from @expo/metro-config's getDefaultConfig().
// Critical knobs:
//   - watchFolders: so Metro rebuilds when @m2/types or @m2/design source edits
//   - resolver.nodeModulesPaths: so Metro finds hoisted deps in the root node_modules
//   - resolver.unstable_enableSymlinks: required for pnpm's symlinked layout
//   - resolver.disableHierarchicalLookup: false (default) — we still want walking

const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;                        // apps/mobile
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch the two shared packages so edits trigger a hot reload (REQ-G-001).
config.watchFolders = [
  path.resolve(workspaceRoot, 'packages/types'),
  path.resolve(workspaceRoot, 'packages/design'),
];

// 2. Tell Metro to search both the app's node_modules AND the workspace root's (REQ-G-002).
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. pnpm ships symlinked deps — Metro needs this flag to follow them.
config.resolver.unstable_enableSymlinks = true;

// 4. Keep hierarchical lookup enabled — Metro still walks up for normal deps.
config.resolver.disableHierarchicalLookup = false;

// 5. Ensure .ts / .tsx extensions are respected for workspace packages that ship source.
config.resolver.sourceExts = Array.from(
  new Set([...(config.resolver.sourceExts ?? []), 'ts', 'tsx', 'cjs', 'mjs'])
);

module.exports = config;
