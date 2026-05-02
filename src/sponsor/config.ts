// GitHub OAuth App for `familiar`.
//
// Set up by the maintainer at https://github.com/settings/developers
//   - Application name: familiar
//   - Homepage URL: https://github.com/LIAlia111/familiar
//   - "Enable Device Flow": yes
//
// Client ID is public — embedding it in source is fine. There is NO client
// secret in device flow.
//
// Until the OAuth app is registered, set FAMILIAR_GITHUB_CLIENT_ID to override.
export const GITHUB_CLIENT_ID =
  process.env.FAMILIAR_GITHUB_CLIENT_ID ?? "Iv1.placeholder-replace-me";

// Maintainer to check sponsorship against. Forks should override.
export const SPONSOR_MAINTAINER =
  process.env.FAMILIAR_SPONSOR_TARGET ?? "LIAlia111";

// Sponsorship status cache duration (30 days).
export const SPONSOR_CACHE_MS = 30 * 24 * 60 * 60 * 1000;
