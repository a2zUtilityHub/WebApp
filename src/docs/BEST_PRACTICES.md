# Best Practices

## Security
- **Never Trust Client**: Frontend permission checks are for UX only. Always enforce RLS or backend logic.
- **Sensitive Data**: Don't expose user emails or PII in API responses unless necessary.

## Coding Standards
- **Components**: Keep components small (< 200 lines). Break large pages into sub-components.
- **Imports**: Use absolute imports `@/components/...`.
- **Constants**: Define permission keys in `adminPermissions.js`, don't hardcode strings.

## UX
- **Feedback**: Always show Toast notifications for success/error.
- **Loading**: Use Skeletons or Spinners while fetching data.
- **Empty States**: Show helpful messages when lists are empty.