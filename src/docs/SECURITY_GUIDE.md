# Security Best Practices

## 1. Access Control
- **Principle of Least Privilege**: Users should only have the permissions strictly necessary for their role.
- **Double Validation**: Client-side checks (UI hiding) must ALWAYS be backed by RLS policies on Supabase.
- **Super Admin**: Limit the number of users with `Super Admin` role to the absolute minimum (ideally 1-2).

## 2. Data Protection
- **RLS Policies**: Ensure every table has RLS enabled.
  - Example: `CREATE POLICY "Admins only" ON users FOR ALL USING (auth.jwt()->>'role' = 'admin');`
- **Sensitive Data**: Never store sensitive keys or passwords in local storage or client-side code.

## 3. Audit Logging
- **What to Log**:
  - Login/Logout events.
  - Data modification (Create, Update, Delete).
  - Permission changes.
  - Sensitive view access (e.g., viewing PII).
- **Implementation**: Use `auditLogService.logAdminAction(action, details)`.

## 4. Frontend Security
- **XSS Prevention**: React automatically escapes content. Avoid using `dangerouslySetInnerHTML` unless absolutely necessary and sanitized.
- **CSRF**: Supabase handles token management securely via HttpOnly cookies (if configured) or secure local storage handling.

## 5. Deployment Checklist
- [ ] Environment variables are set (Supabase keys).
- [ ] Console logs with sensitive info are removed.
- [ ] RLS policies are active and tested.
- [ ] Default admin passwords are changed.
- [ ] Backup system is operational.