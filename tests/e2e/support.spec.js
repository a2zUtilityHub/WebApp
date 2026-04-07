/* global describe, it, expect, beforeEach, afterEach, process */
import { test, expect } from '@playwright/test';

test.describe('Support Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL);
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
    await page.goto('/support');
  });

  test('should allow a user to create a new support ticket', async ({ page }) => {
    await page.getByRole('button', { name: 'Create New Ticket' }).click();
    
    const subject = `Test Ticket - ${Date.now()}`;
    await page.fill('input[name="subject"]', subject);
    await page.fill('textarea[name="message"]', 'This is a test support ticket message.');
    
    await page.getByRole('button', { name: 'Submit Ticket' }).click();
    
    await expect(page.getByText('Ticket created successfully!')).toBeVisible();
    await expect(page.getByRole('heading', { name: subject })).toBeVisible();
  });
});