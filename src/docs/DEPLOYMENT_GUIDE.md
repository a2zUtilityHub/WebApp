# Deployment Guide

## Pre-Deployment Checklist
- [ ] Run `npm run lint` and fix errors.
- [ ] Run test suite `npm test`.
- [ ] Verify `adminPermissions.js` matches production DB permissions.
- [ ] Check `.env.production` variables.

## Deployment Steps
1. **Build**: `npm run build`.
2. **Database**: Apply any new SQL migrations via Supabase dashboard or CLI.
3. **Deploy**: Push to hosting provider (Vercel/Netlify/etc.).

## Post-Deployment
- [ ] Login as Super Admin.
- [ ] Verify critical paths (Dashboard load, User list).
- [ ] Check console for errors.

## Rollback
- If DB migrations were destructive, restore from backup.
- Revert frontend deployment to previous commit hash.