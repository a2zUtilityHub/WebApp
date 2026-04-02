# Troubleshooting Guide

## Common Issues

### 1. "Access Denied" on a Route
- **Cause**: User lacks the specific permission key required by `ProtectedAdminRoute`.
- **Solution**: Check `adminPermissions.js` for the required key, then verify user's role in Database.

### 2. Sidebar Menu Item Missing
- **Cause**: `PermissionGuard` is hiding the item because the user lacks permission.
- **Solution**: Grant the required permission to the user's role.

### 3. White Screen / Crash
- **Cause**: Uncaught exception in component.
- **Solution**: Check Browser Console. Use `AdminErrorBoundary` to catch UI errors.

### 4. Audit Logs Not Showing
- **Cause**: RLS policy preventing view or `audit_logs` table empty.
- **Solution**: Verify `auditLogService` is called on actions. Check RLS policies for `audit_logs`.

## Debugging Tips
- **Console Logging**: Check for "Permission missing: [key]" warnings.
- **Network Tab**: Verify Supabase API calls are returning 200 OK.
- **Local Storage**: Clear local storage to reset cached permissions.