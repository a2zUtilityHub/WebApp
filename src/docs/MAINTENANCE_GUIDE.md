# Maintenance Guide

## Routine Tasks

### Weekly
- **Review Audit Logs**: Check for suspicious admin activity.
- **Monitor Performance**: Check slow query logs in Supabase.

### Monthly
- **Rotate Secrets**: Update API keys if necessary.
- **Clean Up**: Archive old audit logs (> 6 months) to cold storage if DB size is an issue.
- **Updates**: Update NPM dependencies.

## User Management
- **Deactivate Stale Accounts**: Remove access for admins who haven't logged in for 90 days.
- **Role Review**: Audit user roles to ensure Principle of Least Privilege.

## Documentation
- Keep `PERMISSION_MATRIX.md` updated whenever new features are added.