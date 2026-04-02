
/* global describe, it, expect, beforeEach, afterEach, process */
import { test, expect } from '@playwright/test';

test.describe('QR Code Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL);
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
    await page.goto('/apps/qr-code-generator');
  });

  test('should generate a QR code when text is entered', async ({ page }) => {
    const qrCodeValue = 'https://hostinger.com';
    await page.fill('textarea[placeholder="Enter text or URL"]', qrCodeValue);
    
    const qrCode = page.locator('svg[data-testid="qr-code"]');
    await expect(qrCode).toBeVisible();
    
    // This is a proxy for checking the content. A more robust test would decode the QR.
    await expect(qrCode).toHaveAttribute('aria-label', `QR code for ${qrCodeValue}`);
  });

  test('should allow exporting the QR code as PNG', async ({ page }) => {
    await page.fill('textarea[placeholder="Enter text or URL"]', 'test');
    
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'PNG' }).click();
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toBe('qrcode.png');
  });
});
