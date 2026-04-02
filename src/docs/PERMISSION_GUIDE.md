# Permission System Guide

## Overview
The permission system controls access to resources and actions within the Admin Panel. It is based on **Permissions** assigned to **Roles**, which are then assigned to **Users**.

## Permission Categories

### Dashboard
- `view:dashboard`: Access to the main dashboard stats.
- `read:analytics`: View detailed analytics reports.

### Content
- `manage:content`: General CMS access.
- `manage:blogs`: Create/Edit/Delete blog posts.
- `manage:coupons`: Manage coupons and deals.
- `manage:seo`: Access SEO settings and tools.

### Users
- `manage:users`: Create/Edit/Delete users.
- `manage:roles`: Modify role definitions.
- `manage:permissions`: specific permission assignment (Super Admin only).

### Settings
- `manage:settings`: Global system settings.
- `manage:legal`: Edit Terms, Privacy Policy.

## Role Matrix (Default)

| Role | Dashboard | Content | Users | Settings | Support |
|------|-----------|---------|-------|----------|---------|
| Super Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| Content Manager | ✅ | ✅ | ❌ | ❌ | ❌ |
| User Manager | ✅ | ❌ | ✅ | ❌ | ❌ |
| Support Lead | ✅ | ❌ | ❌ | ❌ | ✅ |

## Implementation Guide

### 1. Checking Permissions in Code
Use the `usePermission` hook.