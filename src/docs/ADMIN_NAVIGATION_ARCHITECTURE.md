# Admin Navigation Architecture

## Overview
This document outlines the navigation architecture for the admin panel of the a2z Utility Hub. The system is designed to be scalable, secure, and user-friendly, supporting role-based access control (RBAC) and deep linking.

## Navigation Hierarchy

The navigation is organized into 7 main levels:

1.  **Dashboard**
    *   Overview (Stats, Activity)
    *   Analytics (Traffic, User Growth)
2.  **Content Management**
    *   Pages (CMS)
    *   Blogs
    *   Coupons & Deals
    *   Apps
    *   SEO Manager
    *   Files & Media
3.  **Ecommerce**
    *   Plans & Pricing
    *   Orders/Invoices
    *   Transactions
4.  **User Management**
    *   Users
    *   Roles & Permissions
    *   Admins
    *   Activity Logs
5.  **Communication**
    *   Messaging/Inbox
    *   Newsletter
    *   Notifications
    *   Chatbot
6.  **Support**
    *   Tickets
    *   Knowledge Base
    *   Feedback
7.  **Settings**
    *   General Settings
    *   Auth/OAuth
    *   Legal Documents
    *   Backup & Restore
    *   Logs

## Role-Based Visibility

Visibility is determined by checking the user's role and specific permissions.

*   **Super Admin**: Has access to ALL sections.
*   **Content Manager**: Access to Content Management, Communication.
*   **User Manager**: Access to User Management, Support.
*   **Support Manager**: Access to Support, Communication (partial).
*   **Finance Manager**: Access to Ecommerce.
*   **Marketing Manager**: Access to Content (partial), Communication, Analytics.
*   **Custom Roles**: Defined by specific permission keys.

## Permission Logic

We use a "claim-based" permission system. Each navigation item is assigned a `permission` key.
*   Example: `manage:users` for User Management.
*   Example: `view:analytics` for Dashboard Analytics.

The `PermissionGuard` component and `usePermission` hook are used to enforce these checks.

## UX Recommendations

*   **Sidebar**: Collapsible to icon-only mode for more screen real estate.
*   **Active State**: Distinct visual indicator for the current page and its parent category.
*   **Breadcrumbs**: Always visible to show current depth.
*   **Mobile**: Sidebar becomes a slide-over drawer.
*   **Search**: Global command palette (Cmd+K) to jump to any admin page.

## Security Best Practices

1.  **Client-Side Hiding**: Hide UI elements the user cannot access.
2.  **Route Protection**: `ProtectedAdminRoute` prevents access to URLs even if guessed.
3.  **Server-Side Verification**: All API calls / Server Actions must verify permissions independently of the UI.
4.  **Audit Logging**: Critical navigation events and actions are logged.

## Implementation Steps

1.  Define Permissions & Roles in `src/config/adminPermissions.js`.
2.  Define Navigation Structure in `src/config/adminNavigation.js`.
3.  Implement Permission Service & Hooks.
4.  Build Navigation Components (`AdminNavigation`, `AdminLayout`).
5.  Update Router configuration in `App.jsx`.