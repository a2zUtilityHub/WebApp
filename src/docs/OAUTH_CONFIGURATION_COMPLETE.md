
# Complete OAuth Configuration Guide

This document details how to successfully configure, test, and troubleshoot Google OAuth in a Supabase frontend environment.

## 1. Prerequisites
- A Google Cloud Console account.
- A Supabase Project.
- Environment variables configured correctly:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_GOOGLE_CLIENT_ID` (Optional on client, required for manual PKCE, but standard Supabase config requires it only in Supabase Dashboard).

## 2. Google Cloud Console Setup
1. Navigate to the Google Cloud Console.
2. Create a new project or select an existing one.
3. Configure the **OAuth consent screen** (choose External if testing without Workspace).
4. Navigate to **Credentials** -> **Create Credentials** -> **OAuth client ID**.
5. Select **Web application**.
6. Set the **Authorized redirect URIs** to the exact callback URL.
   * *Local:* `http://localhost:3000/auth/callback` (or your exact localhost port)
   * *Production:* `https://yourdomain.com/auth/callback`
7. Click **Create** and save the **Client ID** and **Client Secret**.

## 3. Supabase Provider Configuration
1. Open your Supabase Dashboard.
2. Go to **Authentication** -> **Providers**.
3. Click on **Google** to expand its settings.
4. Toggle **Enable Google** ON.
5. Paste the **Client ID** and **Client Secret**.
6. Click **Save**.

## 4. App Implementation Details
- **Initiating Login:** Use `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '...' } })`.
- **Handling Callback:** The `/auth/callback` route renders the `OAuthCallbackHandler.jsx` component. It extracts any codes, exchanges them securely, checks the session, and redirects to the intended page.
- **Diagnostics:** Navigate to `/oauth-status` in the app to run diagnostics verifying that your provider config is active and your redirect URIs match.
- **Setup Guide UI:** Navigate to `/oauth-guide` for in-app configuration steps.

## 5. Testing Flow
1. Navigate to `/oauth-status` and check if all indicators are green.
2. Click **Test OAuth Flow** directly from the status page.
3. Complete the Google Consent screen.
4. Ensure you are redirected to `/auth/callback` and subsequently your dashboard.
5. Alternatively, run functions from `src/utils/oauthTestFlow.js` in the console to step through granular tests.

## 6. Troubleshooting
| Error | Cause | Solution |
|-------|-------|----------|
| `redirect_uri_mismatch` | The URI sent in the request doesn't match Google Console. | Add the EXACT current URL (including trailing slash/http) to Google Cloud Console. |
| `Provider not enabled` | Google provider toggle is OFF in Supabase. | Go to Supabase > Auth > Providers, enable Google and click Save. |
| `Session missing after callback` | Cookie limitations on non-HTTPS domains. | Use localhost or serve via HTTPS in development. |
| Button disabled in UI | Diagnostics detected the provider is off. | Enable the provider in Supabase to restore button functionality. |

For detailed logs, check your browser console during the OAuth redirect and callback phases.
