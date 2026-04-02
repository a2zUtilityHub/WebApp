# Testing Strategy

## Levels of Testing

### 1. Unit Tests
- **Target**: Utility functions, Services, Hooks.
- **Tool**: Vitest / Jest.
- **Example**: Testing `hasPermission()` logic with various input arrays.

### 2. Integration Tests
- **Target**: Component interactions (e.g., PermissionGuard rendering children).
- **Tool**: React Testing Library.
- **Example**: Verify `<PermissionGuard>` hides content when mock user lacks permission.

### 3. E2E Tests
- **Target**: Full user flows.
- **Tool**: Playwright / Cypress.
- **Flows**:
  - Login as Admin.
  - Navigate to Settings.
  - Change a setting.
  - Logout.

## Best Practices
- **Mocking**: Mock Supabase client responses to avoid hitting real DB during tests.
- **Coverage**: Aim for 80% coverage on core logic (Auth, Permissions).