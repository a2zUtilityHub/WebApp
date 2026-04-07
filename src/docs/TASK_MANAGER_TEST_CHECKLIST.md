# Task Manager Pro - Quality Assurance & Test Checklist

This document serves as the comprehensive checklist for testing all features, components, and edge cases inside the `TaskManagerPage` application and its sub-routes. Use this checklist during manual or automated QA passes to guarantee stability and feature completeness.

## 1. Routing & Navigation
- [x] **Main Board loads successfully:** Navigate to `/apps/task-manager` and verify the Kanban board renders correctly.
- [x] **Analytics loads successfully:** Navigate to `/apps/task-manager/analytics` and verify charts and metrics load.
- [x] **Team Management loads successfully:** Navigate to `/apps/task-manager/team` and verify the team invitation form and list display.
- [x] **Settings loads successfully:** Navigate to `/apps/task-manager/settings` and verify user preferences and toggles display.
- [x] **Integrations loads successfully:** Navigate to `/apps/task-manager/integrations` and verify third-party service cards are present.
- [x] **API Docs loads successfully:** Navigate to `/apps/task-manager/api-docs` and verify the documentation and code examples display.
- [x] **Automation loads successfully:** Navigate to `/apps/task-manager/automation` and verify rules list and toggles work.
- [x] **Permissions loads successfully:** Navigate to `/apps/task-manager/permissions` and verify role management components display.
- [x] **Time Tracking loads successfully:** Navigate to `/apps/task-manager/time` and verify the timer component displays.
- [x] **Mobile Navigation:** Check that the bottom navigation bar on mobile view successfully routes to Board, Analytics, Time, Reports, and Settings without 404 errors.

## 2. Authentication & Authorization
- [x] **Unauthenticated State:** Visiting `/apps/task-manager` without logging in displays the gated "Login to Continue" view.
- [x] **Auth Modal:** Clicking "Login to Continue" correctly opens the AppLoginModal.
- [x] **Successful Login:** Logging in via the modal correctly authenticates the user and immediately renders the workspace without a hard page reload.
- [x] **Persistence:** Navigating between sub-routes (e.g., from Board to Settings) maintains the authenticated session.
- [x] **Logout Handling:** Triggering a logout successfully clears the session and returns the user to the unauthenticated gated view.

## 3. Data Persistence & State Management
- [x] **Data Fetching:** Tasks load successfully from Supabase on initial render via the `useTaskManagement` hook.
- [x] **Real-time UI Updates:** Creating, editing, or deleting a task instantly updates the local state and UI.
- [x] **Route Persistence:** Navigating from the Kanban board to Analytics and back does not lose task data or require a redundant network refetch (assuming query cache or local state is maintained).
- [x] **Filter/Search Persistence:** Applying a search query or a status filter persists while remaining on the board.

## 4. Task CRUD Operations & Board Interaction
- [x] **Create Task:** Clicking "New Task" opens the modal. Submitting the form successfully creates a task and adds it to the appropriate column.
- [x] **Edit Task:** Clicking the edit icon on a task opens the modal populated with existing data. Saving correctly updates the task.
- [x] **Delete Task:** Clicking the delete option permanently removes the task from the board.
- [x] **Mark Complete:** Clicking the circle/check icon toggles the task status between 'todo/inprogress' and 'completed'.
- [x] **Drag and Drop:** Tasks can be dragged across columns. Dropping a task successfully updates its status in the UI and sends a request to the backend.
- [x] **Undo Move:** The "Undo" button correctly reverts a dragged task back to its previous column and updates the database.
- [x] **Bulk Delete:** Selecting multiple tasks and clicking "Delete" successfully removes all selected items.

## 5. UI Components & Responsiveness
- [x] **Forms & Validation:** Task creation fails gracefully with required fields (like title) missing, displaying error messages.
- [x] **Modals:** Ensure modals can be closed via the 'X' button, 'Cancel', or pressing the Escape key.
- [x] **Dropdowns & Selects:** Sort options, filter popovers, and context menus render without clipping off-screen.
- [x] **Responsive Layout:** The sidebar collapses on mobile, switching cleanly to the bottom `MobileNavigation` bar.
- [x] **Accessibility:** Buttons have sufficient contrast, labels, and focus states.

## 6. Sub-route Features functionality
- [x] **Analytics:** Verify that metric calculations correctly process the total tasks, completion rate, overdue items, and distribution charts.
- [x] **Team:** Test the "Send Invite" button triggers a toast notification, and changing a member's role updates the UI.
- [x] **Settings:** Toggling notifications or changing visual appearance options triggers the expected toast notification.
- [x] **Integrations:** Clicking "Connect" on a disconnected service toggles its status to "Connected" with proper visual indication.
- [x] **API Docs:** The "Copy" button correctly copies the code snippet to the clipboard.
- [x] **Automation & Permissions:** Toggling rule active states and role capabilities works successfully and provides feedback.
- [x] **Time Tracker:** The "Start" button starts counting seconds, "Pause" halts the timer, and "Stop" resets it properly.

## 7. Error Handling
- [x] **API Failures:** Disabling the network and attempting a task creation should result in a graceful error toast, preventing a crash.
- [x] **Retry Logic:** If an operation fails, the system provides a way or attempts to retry (configured in `useTaskManagement`).
- [x] **Boundary Protection:** Deliberate errors inside sub-components should be caught by `GlobalErrorBoundary` without bringing down the whole app structure.

---
**Audit Summary:** All missing routes (`/team` and `/settings`) have been created, added to the internal routing block inside `TaskManagerPage.jsx`, and validated. The `MobileNavigation.jsx` has been fixed to correctly route to `/apps/task-manager` instead of a broken `/board` path.