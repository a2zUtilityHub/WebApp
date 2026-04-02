# Navigation Structure

## Level 1: Root
- **Dashboard** (`/admin/dashboard`)
- **Content Management** (`/admin/content`)
- **Ecommerce** (`/admin/ecommerce`)
- **User Management** (`/admin/users`)
- **Communication** (`/admin/communication`)
- **Support** (`/admin/support`)
- **Settings** (`/admin/settings`)

## Detailed Breakdown

### 1. Dashboard
- **Overview**: Stats, Recent Activity
- **Analytics**: Traffic, Conversion

### 2. Content Management
- **CMS Dashboard**: Overview of content
- **Pages**: Static page editor
- **Blogs**: Post management
- **Files**: Media library

### 3. User Management
- **All Users**: List, Search, Edit
- **Roles**: Role definition
- **Permissions**: Permission assignment

### 4. Settings
- **General**: Site info
- **Auth**: OAuth providers
- **Security**: 2FA, IP allowlist
- **Backup**: Database snapshots

## Component Mapping
Each menu item maps to a specific React page component via `src/config/routes.js`.
- `/admin/dashboard` -> `AdminDashboardPage`
- `/admin/users` -> `AdminUsersPage`