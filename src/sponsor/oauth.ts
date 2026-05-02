import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";

// Mirror of @octokit/auth-oauth-device's Verification — not re-exported from
// the package root, so we redeclare the shape we use.
export interface Verification {
  verification_uri: string;
  user_code: string;
  device_code: string;
  expires_in: number;
  interval: number;
}

export interface DeviceAuthResult {
  token: string;
}

// Runs the GitHub Device Flow. `onVerification` is called with the
// user-facing instructions (URL + code) — the caller is responsible for
// displaying them. Resolves with the access token once the user authorizes.
export async function deviceAuth(
  clientId: string,
  scopes: string[],
  onVerification: (v: Verification) => void,
): Promise<DeviceAuthResult> {
  const auth = createOAuthDeviceAuth({
    clientType: "oauth-app",
    clientId,
    scopes,
    onVerification,
  });
  const { token } = await auth({ type: "oauth" });
  return { token };
}
