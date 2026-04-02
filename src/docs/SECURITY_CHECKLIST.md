# Security Checklist

## Access Control
- [ ] **RLS Policies**: Ensure Row Level Security is enabled on ALL tables.
- [ ] **Backend Validation**: Do not rely solely on frontend permission checks.
- [ ] **Super Admin**: Limit usage of Super Admin accounts.

## Authentication
- [ ] **Session Timeout**: Enforce re-login after inactivity (e.g., 24h).
- [ ] **MFA**: Enable Multi-Factor Authentication for admin accounts.
- [ ] **Strong Passwords**: Enforce complexity requirements.

## Data Protection
- [ ] **Input Sanitization**: Validate all form inputs.
- [ ] **Audit Logging**: Log critical actions (Delete, Role Change).
- [ ] **Backup**: Regular automated backups of database.

## Network
- [ ] **HTTPS**: Enforce SSL for all admin connections.
- [ ] **CORS**: Restrict API access to allowed domains.

## Vulnerability Prevention
- [ ] **XSS**: Use React's default escaping; avoid `dangerouslySetInnerHTML`.
- [ ] **CSRF**: Verify Supabase token handling.
- [ ] **Dependencies**: Regularly audit `npm` packages for vulnerabilities.