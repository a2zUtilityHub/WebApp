# Task Manager & Admin Architecture Diagnostic Report

## Part 1: Task Management System Diagnosis

### 1. `src/hooks/useTaskManagement.js`
*   **Current State**: 
    *   Exports `loading`, `fetchTasks`, `createTask`, `updateTask`, `deleteTask`.
    *   Queries the `tasks` table using standard Supabase `.select()`, `.insert()`, and `.update()` methods. Soft deletes via `is_deleted: true`.
    *   Has error handling wrapper `executeWithRetry` and `handleTaskError`, catching specific errors.
    *   Manages only `loading` state (data state is managed in the UI components).
*   **Issues Found**: 
    *   **Data Mismatch Vulnerability**: `createTask` and `updateTask` spread `taskFields` directly into the Supabase insert/update. 
*   **Evidence**: 
    *   In `useTaskManagement.js`: `const { assigned_to, id, ...taskFields } = taskData; await supabase.from('tasks').insert({ ...taskFields, ... })`
*   **Impact**: If the UI sends fields that do not exist in the DB schema (like `tags` or `subtasks`), the Supabase query will throw a `42703` (undefined_column) error, causing task creation/updates to fail silently or show a generic toast.

### 2. `src/components/apps/task-manager/TaskColumn.jsx`
*   **Current State**: 
    *   Receives `tasks` via props.
    *   Maps over tasks to render `TaskCard` inside a `react-beautiful-dnd` `Droppable` zone.
*   **Issues Found**: 
    *   No structural issues found here. It correctly expects an array of task objects and passes down necessary props.

### 3. `src/components/apps/task-manager/TaskCard.jsx`
*   **Current State**: 
    *   Renders task details including title, description, tags, priority, and due dates.
*   **Issues Found**: 
    *   Expects `task.tags` and `task.subtasks` to be arrays.
*   **Evidence**: `const subtasks = task.subtasks || [];`, `const tags = task.tags || [];`
*   **Impact**: If the backend does not return or support these fields (which it doesn't currently, based on the `tasks` table schema), they will always fallback to empty arrays and the UI won't reflect user inputs.

### 4. `src/pages/apps/TaskManagerPage.jsx`
*   **Current State**: 
    *   Fetches tasks on mount using `loadData` -> `fetchTasks()`.
    *   Maintains local state for `tasks`, `loading`, `filters`, `searchQuery`, etc.
    *   Passes filtered/sorted tasks to `TaskManagerBoard`.
*   **Issues Found**: 
    *   When `createTask` returns a new task, it adds it to the local state: `setTasks(prev => [newTask, ...prev]);`. If `createTask` fails (due to the `tags` column issue), it returns `null`, and the task won't appear.

### 5. Supabase Schema (`tasks` table)
*   **Current State**: 
    *   Columns: `id`, `title`, `description`, `status`, `creator_id`, `is_deleted`, `created_at`, `updated_at`, `due_date`, `priority`, `project_id`, `order`.
*   **Issues Found**: 
    *   Missing `tags` and `subtasks` columns. 
    *   Row Level Security (RLS) is enabled and checks `creator_id = auth.uid()` or `project_id IN (...)`.
*   **Impact**: The `TaskModal` sends `tags` and `subtasks` to `useTaskManagement`, which attempts to insert them directly into the `tasks` table, resulting in a database schema error.

---

## Part 2: Permissions System Diagnosis

### 1. `src/components/admin/RolePermissionsSelect.jsx`
*   **Current State**: 
    *   Fetches available permissions and renders them in grouped checkboxes.
    *   Wired to local state correctly via `onChange`.
*   **Issues Found**: None. Operates as intended.

### 2. `src/components/admin/modals/EditRoleModal.jsx`
*   **Current State**: 
    *   Exists and contains the form for updating a role's name, description, and permissions.
*   **Issues Found**: None internally.

### 3. `src/pages/admin/AdminRolesPage.jsx`
*   **Current State**: 
    *   Displays a table of mock roles (`mockRoles`).
    *   Has an Edit button.
*   **Issues Found**: 
    *   The Edit button is a placeholder and does not open the `EditRoleModal`.
*   **Evidence**: 
    *   `<Button ... onClick={() => toast({ title: "Edit Role", description: "Edit functionality coming soon." })}> <Edit2 /> </Button>`
*   **Impact**: Users cannot actually edit roles. The `EditRoleModal` component is imported but never rendered for editing.

### 4. `src/pages/admin/AdminPermissionsPage.jsx`
*   **Current State**: 
    *   Exists and implements the CRUD operations for permissions using `useAdminPermissions`.
    *   "Add Permission" opens `AddPermissionModal`.
    *   "Edit" opens `EditPermissionModal`.
*   **Issues Found**: Functional, but UI relies on a specific return shape from `fetchPermissions` which might need validation against actual DB rows.

---

## Part 3: Page Routes and Components Diagnosis

### 1. Routes in `src/App.jsx`
*   **Current State**: 
    *   The `/apps/task-manager/*` wildcard route is correctly mapped to `TaskManagerPage`.
*   **Issues Found**: None. Nested routing handles the sub-pages.

### 2. Task Manager Sub-Pages
*   `TaskManagerPage.jsx` (main page) - **Exists & Functional**
*   `AnalyticsDashboard.jsx` - **Exists & Functional**
*   `TeamManagement.jsx` - **Exists** (Uses mock local state `members`, invite sends toast).
*   `IntegrationsPage.jsx` - **Exists** (Connect/Disconnect toggles local state + toast).
*   `AutomationRules.jsx` - **Exists** (Toggles local state + toast, Create button is a placeholder).
*   `ReportBuilder.jsx` - **Exists** (UI shell, export shows toast).
*   `RoleManagement.jsx` - **Exists** (UI shell with static list of roles, Edit is a toast placeholder).
*   `TimeTracker.jsx` - **Exists & Functional** (Timer works, manual entry is a toast placeholder).
*   `ProjectSettings.jsx` - **Exists & Functional** (Settings toggles trigger toasts).

---

## Part 4: Data Flow Diagnosis

### 1. Task Creation Flow
*   **Path**: User clicks "New Task" -> `handleOpenModal()` -> Submits `TaskModal` -> `handleSaveTask(taskData)` -> `createTask(taskData)`.
*   **Breakdown**: `taskData` contains `{ title, description, status, priority, due_date, tags: [], subtasks: [] }`. `createTask` attempts to insert this object directly. Since `tags` and `subtasks` do not exist as columns on the `tasks` table, Supabase rejects the insert.
*   **Impact**: Task creation fails. The UI swallows the backend error (or shows a generic toast) and the task list does not update.

### 2. Task Display Flow
*   **Path**: `TaskManagerPage` mounts -> `loadData()` -> `fetchTasks()` -> `supabase.from('tasks').select('*')`.
*   **Breakdown**: Data successfully returns from the DB (for tasks that actually made it in). `useMemo` filters it. `TaskColumn` renders it.
*   **Impact**: Display flow works, provided the tasks exist in the database.

### 3. Data Mismatches
*   **Mismatch 1**: `tasks` table schema vs `TaskModal` payload. The UI expects to save `tags` (array of objects) and `subtasks` (array of objects), but the `tasks` table lacks these JSONB columns. 
*   *Solution needed*: Either update the DB schema to include `tags` and `subtasks` as JSONB columns, or strip these fields in `useTaskManagement.js` before inserting into Supabase, and handle them via junction tables (e.g., `task_tags`).