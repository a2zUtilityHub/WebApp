# Store Page Troubleshooting Guide

This guide outlines common issues, debugging steps, and solutions for the `StorePage` and `ProductsList` components.

## Architecture Overview
The Store functionality uses a 3rd party Ecommerce API (`EcommerceApi.js`) rather than direct Supabase database calls. 
- API Base URL: `https://api-ecommerce.hostinger.com`
- Fetch requests are wrapped in `fetchErrorHandler.js` which provides exponential backoff retry logic.

## Common Errors & Solutions

### 1. `Failed to fetch` or `Network Error`
**Symptoms:** Products fail to load, console shows `TypeError: Failed to fetch`.
**Root Causes:**
- User's internet connection is offline.
- Browser ad-blockers or privacy extensions (e.g., Brave Shields, uBlock) blocking the API domain.
- Ecommerce API server is temporarily down.
**Resolution:**
- The UI automatically checks `navigator.onLine` via `networkCheck.js`.
- If offline, the UI shows a "Connection Lost" message.
- The `retryWithBackoff` utility automatically attempts 3 retries. Ask the user to disable ad-blockers for testing.

### 2. `FunctionsFetchError` / Supabase Edge Functions
**Symptoms:** "Service temporarily unavailable: Failed to connect to backend functions."
**Root Causes:**
- Supabase Edge Functions are offline or have reached limits.
- Attempting to use Edge Functions without starting them (if local).
**Resolution:** 
- The `fetchErrorHandler.js` interprets this and shows a friendly message. 
- Check Edge Function logs in the Supabase Dashboard.

### 3. RLS Policy Errors (If migrating to DB)
*Note: Currently, products use external API. If you migrate products to Supabase, watch for this.*
**Symptoms:** HTTP 403 or PostgREST `PGRST116`, `42501`. 
**Root Causes:** Row Level Security (RLS) restricts access.
**Resolution:**
- Go to Supabase Dashboard -> Authentication -> Policies.
- Verify `products` table has a `SELECT` policy allowing `anon` (Public) access:
  `CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);`

## Testing Steps
1. **Anon User Test:** Open an Incognito window and visit `/store`. Products should load fully without login.
2. **Offline Test:** Open Chrome DevTools -> Network tab -> Change throttling to "Offline". Reload page. The UI should display the "Connection Lost" offline state instead of infinite spinners.
3. **Slow Network Test:** Change throttling to "Slow 3G". Verify skeleton loaders appear and stay until data is fully downloaded.
4. **Retry Logic Test:** Temporarily block the request URL in Chrome Network tab. Observe the console logs detailing `[RETRY] Attempt 1`, `Attempt 2`, etc.

## How to Read Error Logs
All errors are centrally logged via `logError` in `src/utils/fetchErrorHandler.js`.
In the browser console, filter by `[ERROR]` or `[RETRY]`.
Logs include:
- Timestamp (ISO format)
- Context (e.g., `[StorePage.getProducts]`)
- HTTP Status Code & Stack Trace

**Example Log:**
`[2026-02-24T12:00:00Z] [ERROR] [StorePage.getProducts (Attempt 1)] { message: "Failed to fetch", status: undefined }`

## Escalation
If the Ecommerce API returns 5xx errors persistently and retries fail:
1. Verify API status at Hostinger Ecommerce.
2. Verify `ECOMMERCE_STORE_ID` inside `src/api/EcommerceApi.js` is correct. (Note: `EcommerceApi.js` is a Read-Only file in this environment).