# API Reference

## Services

### `permissionService`
- `getUserPermissions(userId)`: Returns `{ permissions: string[], role: string }`.
- `hasPermission(userPerms, role, requiredPerm)`: Returns `boolean`.

### `auditLogService`
- `logAdminAction(action, details)`: Void. Inserts into `audit_logs`.
- `getAuditLogs(filters)`: Returns `Promise<LogEntry[]>`.

## Hooks

### `usePermission()`
Returns: