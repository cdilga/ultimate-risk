/**
 * End-to-end tests for the game
 */

import { test, expect } from '@playwright/test';

test.describe('Ultimate Risk Game', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('ULTIMATE RISK');
    await expect(page.locator('text=World War II Strategy Command')).toBeVisible();
  });

  test('should display all nations', async ({ page }) => {
    await page.goto('/');

    // Wait for nations to load
    await page.waitForSelector('.nation-card');

    // Check that we have nation cards
    const nationCards = await page.locator('.nation-card').count();
    expect(nationCards).toBeGreaterThan(0);

    // Check for specific nations
    await expect(page.locator('text=Nazi Germany')).toBeVisible();
    await expect(page.locator('text=Great Britain')).toBeVisible();
    await expect(page.locator('text=United States')).toBeVisible();
  });

  test('should display territories', async ({ page }) => {
    await page.goto('/');

    // Wait for territories to load
    await page.waitForSelector('#territoriesGrid > div');

    const territories = await page.locator('#territoriesGrid > div').count();
    expect(territories).toBeGreaterThan(0);
  });

  test('should have game control buttons', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('button:has-text("New Game")')).toBeVisible();
    await expect(page.locator('button:has-text("Toggle Music")')).toBeVisible();
    await expect(page.locator('button:has-text("Next Phase")')).toBeVisible();
  });

  test('should create a new game', async ({ page }) => {
    await page.goto('/');

    // Click new game button
    await page.locator('button:has-text("New Game")').click();

    // Wait for alert
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('New game started');
      await dialog.accept();
    });

    // Check that game status becomes visible
    await expect(page.locator('#gameStatus')).toBeVisible({ timeout: 5000 });
  });

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.nation-card').first()).toBeVisible();
  });
});
