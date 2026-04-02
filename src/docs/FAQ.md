# Frequently Asked Questions

## 1. How do I add a new menu item?
1. Open `src/config/adminNavigation.js`.
2. Add an object to the array with `label`, `path`, `icon`, and `permission`.
3. Create the corresponding page component.
4. Add the route in `App.jsx`.

## 2. How do I make a user a Super Admin?
Update the `profiles` table in Supabase. Set their `role_id` to the ID corresponding to 'Super Admin' in the `roles` table.

## 3. Why are changes to permissions not reflecting immediately?
Permissions are cached in the `usePermission` hook for the session. The user may need to refresh the page or logout/login to see changes if they were modified in the DB.

## 4. Can I delete the Super Admin role?
No. The system relies on this role for failsafe access.