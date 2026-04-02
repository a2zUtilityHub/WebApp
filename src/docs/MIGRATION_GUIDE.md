# Migration Guide

## Overview
Moving from the legacy hardcoded admin checks to the new RBAC system.

## Step-by-Step

### 1. Database Migration
Run the SQL script `01-schema-and-seed.sql` (or equivalent) to create `roles`, `permissions`, and `role_permissions` tables.

### 2. Data Seeding
Execute `npm run seed:permissions` and `npm run seed:roles` to populate the initial security matrix.

### 3. User Migration
- Identify existing admin users.
- Manually assign them the `Super Admin` or `Admin` role in the `profiles` table (`role_id` column).

### 4. Code Updates
- Replace manual `if (user.role === 'admin')` checks with `usePermission()` hook.
- Wrap admin routes in `App.jsx` with `<ProtectedAdminRoute>`.

## Rollback Plan
If issues arise:
1. Revert `App.jsx` to previous routing.
2. The database schema changes (adding tables) are generally non-breaking for old logic if old logic ignores them.