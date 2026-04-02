# Performance Guide

## Frontend Optimization
- **Lazy Loading**: Admin routes are heavy. Ensure all top-level admin pages are `React.lazy()` imported.
- **Memoization**: Use `useMemo` for complex permission calculations or filtering large lists.
- **Virtualization**: Use `react-window` or similar for rendering User Lists or Audit Logs with >100 rows.

## Data Fetching
- **Pagination**: Never fetch `select *` for tables like `audit_logs`. Always use `range()` in Supabase.
- **Caching**: `usePermission` caches results in memory/session to avoid repeated DB calls on every render.
- **Debouncing**: Search inputs must be debounced to prevent API flooding.

## Bundle Size
- **Icon Imports**: Import specific icons from `lucide-react` (e.g., `import { User } ...`) rather than the whole library.
- **Tree Shaking**: Ensure build process removes unused Shadcn components.