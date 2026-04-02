# Chatbot Settings Error Handling & Best Practices

## Overview of the PGRST116 Issue
The `PGRST116` error code from Supabase/PostgREST indicates that a query expecting a single row returned no rows (or multiple rows, but usually 0 when using `.single()`). 

Previously, `chatbotAdminService` used `.select().single()` to fetch settings. When a chatbot was newly created but hadn't been configured yet, the `chatbot_settings` table would have no matching record, causing the app to crash or display an error state.

## The Solution: `maybeSingle()` and Default Initialization

### 1. Robust Querying
We replaced `.single()` with `.maybeSingle()` in all fetch operations where data might optionally be missing. 
- **Old:** `supabase.from('...').select().single()` -> Throws error if 0 rows.
- **New:** `supabase.from('...').select().maybeSingle()` -> Returns `null` data and `null` error if 0 rows.

### 2. Service Layer Handling (`chatbotAdminService.js`)
The service layer now explicitly checks for this `null` return and handles it gracefully, returning `null` to the caller instead of letting an exception propagate.

### 3. Defensive Hook Logic (`useChatbotAdmin.js`)
The hook now:
- Checks if the returned settings are null.
- If null, it falls back to a default settings object defined in `chatbotSettingsService`.
- Uses `ensureSettingsExist()` to attempt lazy creation of settings if they are missing.

### 4. Initialization Script
A seeding script `seedChatbotSettings.js` runs on app startup (non-blocking) to ensure all chatbots have a corresponding settings record, preventing the "missing settings" state from persisting.

## Best Practices for Future Development

1. **Use `maybeSingle()` for optional 1:1 relationships**:
   Whenever fetching a related record that might not exist yet (like profile settings, preferences), prefer `maybeSingle()`.

2. **Null Checks are Mandatory**:
   Never assume data exists.