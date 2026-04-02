# Row Level Security (RLS) Policy Plan

This document outlines the Row Level Security (RLS) strategy for the Supabase database. Policies are categorized by data sensitivity and user access levels.

## 1. Public Content Tables
These tables contain content intended for public consumption.
**Access Rules:**
- `SELECT`: Allowed for everyone (anon + authenticated), usually filtered by `status = 'active'` or `published`.
- `MODIFICATION`: Restricted to Admins/Content Managers.

| Table Name | Public Access | Conditions |
|------------|---------------|------------|
| `apps` | Read | `status = 'published'` |
| `blog_posts` | Read | `status = 'published'` |
| `categories` | Read | `status = 'active'` |
| `coupons` | Read | `is_active = true` |
| `pages` | Read | `status = 'published'` |
| `testimonials` | Read | `status = 'active'` |
| `faqs` | Read | `is_deleted = false` |
| `pricing_plans` | Read | `status = 'active'` |
| `job_postings` | Read | `status = 'active'` |
| `press_releases` | Read | `status = 'published'` |

## 2. User Private Tables
Data owned by specific users.
**Access Rules:**
- `ALL` (Select/Insert/Update/Delete): Allowed for owner (`auth.uid() = user_id`).
- `ALL`: Allowed for Admins.

| Table Name | Owner Field | Notes |
|------------|-------------|-------|
| `profiles` | `id` | Users can update specific fields only (enforced by UI/API usually, strict RLS allows update own) |
| `user_notifications` | `user_id` | |
| `user_activity_logs` | `user_id` | Read-only for users usually, but Insert allowed if client-side logging |
| `api_keys` | `user_id` | |
| `subscriptions` | `user_id` | |
| `payments` | `user_id` | Read only for users typically |
| `invoices` | `user_id` | Read only |

## 3. Chatbot System
Hybrid access model.
**Access Rules:**
- `Public`: Can INSERT `chatbot_conversations` and `chatbot_messages` (to start chatting).
- `Users`: Can VIEW their own conversations.
- `Admins`: Full access.

## 4. Support System
**Access Rules:**
- `Public`: Can INSERT `support_tickets`.
- `Users`: View/Update own tickets.
- `Support Agents/Admins`: View/Update ALL tickets.

## 5. HR System
**Access Rules:**
- `Employees`: View own records (matched via Email).
- `HR Managers/Admins`: Full access.

## 6. Admin & System Tables
Restricted to specific roles.
**Access Rules:**
- `Public/Users`: No access.
- `Admins`: Full access.

| Table Name |
|------------|
| `roles` |
| `permissions` |
| `audit_logs` |
| `dashboard_stats` |
| `system_settings` |

## 7. Implementation Strategy
All policies use:
- `get_user_role_name()` for role checks.
- `auth.uid()` for ownership checks.
- `auth.jwt() ->> 'email'` for employee linking.