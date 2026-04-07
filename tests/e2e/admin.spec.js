/* global describe, it, expect, beforeEach, afterEach, process */
import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', process.env.TEST_ADMIN_EMAIL);
    await page.fill('input[name="password"]', process.env.TEST_ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'Admin Panel' })).toBeVisible();
  });

  test('should allow admin to log in and view the admin dashboard', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Total Users')).toBeVisible();
  });

  test('should allow admin to navigate to users page and view users', async ({ page }) => {
    await page.getByRole('link', { name: 'Users' }).click();
    await expect(page).toHaveURL('/admin/users');
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
    await expect(page.getByText(process.env.TEST_ADMIN_EMAIL)).toBeVisible();
  });

  test('should allow admin to toggle a freemium setting', async ({ page }) => {
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page).toHaveURL('/admin/settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();

    const qrAppRow = page.getByRole('row', { name: 'QR Code Generator' });
    const freemiumSwitch = qrAppRow.getByRole('switch', { name: 'Freemium' });
    const isChecked = await freemiumSwitch.isChecked();
    
    await freemiumSwitch.click();
    
    await expect(freemiumSwitch).not.toBeChecked({ checked: isChecked });
  });
});