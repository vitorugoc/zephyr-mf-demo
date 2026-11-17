/**
 * Shared dependencies for every app in the portal. Kept in one place so the
 * host and remotes can't drift apart and load two copies of React or the UI kit.
 * requiredVersion is explicit because MF can't infer it from `workspace:*`.
 * Each app's config checks this object with `satisfies ModuleFederationOptions`.
 */
export const shared = {
  react: { singleton: true, requiredVersion: '^19.3.0' },
  'react-dom': { singleton: true, requiredVersion: '^19.3.0' },
  '@portal/ui': { singleton: true, requiredVersion: '^1.0.0' },
} as const;
