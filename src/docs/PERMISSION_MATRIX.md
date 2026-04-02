# Permission Matrix

## Role Definitions
- **Super Admin**: Full access to all modules.
- **Content Manager**: Access to Pages, Blogs, Media.
- **User Manager**: Access to User List, Roles.
- **Support Manager**: Access to Tickets, Messaging.
- **Finance Manager**: Access to Invoices, Plans.

## Permission Mapping

| Feature Category | Permission Key | Super Admin | Content Mgr | User Mgr | Support Mgr |
|------------------|----------------|-------------|-------------|----------|-------------|
| **Dashboard**    | `view:dashboard`| ✅ | ✅ | ✅ | ✅ |
| **Content**      | `manage:content`| ✅ | ✅ | ❌ | ❌ |
| **SEO**          | `manage:seo`    | ✅ | ✅ | ❌ | ❌ |
| **Users**        | `manage:users`  | ✅ | ❌ | ✅ | ❌ |
| **Roles**        | `manage:roles`  | ✅ | ❌ | ❌ | ❌ |
| **Settings**     | `manage:settings`| ✅ | ❌ | ❌ | ❌ |
| **Support**      | `manage:tickets`| ✅ | ❌ | ❌ | ✅ |

## Inheritance Rules
- Permissions are **additive**. A user with multiple roles gets the union of all permissions.
- `Super Admin` role bypasses all specific checks.