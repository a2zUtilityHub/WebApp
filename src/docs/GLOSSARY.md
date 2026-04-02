# Glossary

- **RBAC (Role-Based Access Control)**: Restricting access based on the roles of individual users within an enterprise.
- **Permission**: A granular claim (e.g., `manage:users`) representing the ability to perform a specific action.
- **Role**: A collection of permissions (e.g., `Content Manager`).
- **Claim**: Another term for permission in Auth contexts.
- **RLS (Row Level Security)**: PostgreSQL feature to restrict data access at the database row level based on user identity.
- **Super Admin**: A special role that bypasses all permission checks, having absolute control.
- **Audit Log**: An immutable record of events and changes within the system.
- **Guard**: A component or function that prevents execution or rendering if criteria (permissions) are not met.