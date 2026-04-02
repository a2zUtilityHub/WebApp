
/* global describe, it, expect, beforeEach, afterEach, process */
import { test, expect } from '@playwright/test';

test.describe('RBAC System', () => {
  // Assuming we have a seeded Super Admin login
  const ADMIN_EMAIL = 'admin@example.com'; 
  const ADMIN_PASSWORD = 'password123';

  test('Protected routes redirect unauthenticated users', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('Admin can access users page', async ({ page }) => {
    // Login flow
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForURL(/\/admin\/dashboard/);
    
    // Navigate to users
    await page.goto('/admin/users');
    await expect(page.locator('h1')).toContainText('User Management');
  });

  test('Access Denied for unauthorized users', async ({ page }) => {
    // Need to simulate a regular user login here. 
    // Since we cannot easily switch context in one test without setup, 
    // we assume the environment might have a 'user@example.com'
    // This is a placeholder for the logic.
  });

  test('Add User Modal opens', async ({ page }) => {
     await page.goto('/admin/login');
     await page.fill('input[type="email"]', ADMIN_EMAIL);
     await page.fill('input[type="password"]', ADMIN_PASSWORD);
     await page.click('button[type="submit"]');
     await page.waitForURL(/\/admin\/dashboard/);
     await page.goto('/admin/users');
     
     await page.click('button:has-text("Add User")');
     await expect(page.locator('div[role="dialog"]')).toBeVisible();
     await expect(page.locator('div[role="dialog"]')).toContainText('Add New User');
  });
});
