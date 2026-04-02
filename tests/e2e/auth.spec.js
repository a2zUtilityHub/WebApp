
/* global describe, it, expect, beforeEach, afterEach, process */
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow a user to sign up', async ({ page }) => {
    await page.goto('/auth/signup');
    const email = `test-user-${Date.now()}@example.com`;
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.click('button[type="submit"]');
    
    // In a real app, you'd handle email confirmation. Here we assume auto-confirmation.
    await expect(page.getByText('Check your email for the confirmation link.')).toBeVisible();
  });

  test('should allow a user to log in and log out', async ({ page }) => {
    // Login
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL);
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('button', { name: /my account/i })).toBeVisible();

    // Logout
    await page.getByRole('button', { name: /my account/i }).click();
    await page.getByRole('menuitem', { name: 'Log Out' }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  });
});
