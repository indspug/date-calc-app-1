import { test, expect } from '@playwright/test';

// 日付計算アプリのE2Eテスト

test.describe('日付計算アプリ', () => {
  test.beforeEach(async ({ page }) => {
    // Viteのデフォルトポートでローカルサーバーが起動している前提
    await page.goto('http://localhost:5173/');
  });

  test('西暦の日付加算: 2024-02-27 + 2日 = 2024-02-29（木）', async ({ page }) => {
    await page.selectOption('select', 'AD');
    await page.fill('input[placeholder="例: 2024"]', '2024');
    await page.fill('input[placeholder="1"]', '2'); // 月
    await page.fill('input[placeholder="1"] >> nth=1', '27'); // 日
    await page.fill('input[placeholder="例: 5 または -3"]', '2');
    await page.click('button:has-text("計算")');
    await expect(page.locator('text=結果日付:')).toBeVisible();
    await expect(page.locator('text=2024-02-29（木）')).toBeVisible();
  });

  test('紀元前→紀元後の跨ぎ: 紀元前1年12月31日 + 1日 = 1年1月1日（土）', async ({ page }) => {
    await page.selectOption('select', 'BC');
    await page.fill('input[placeholder="例: 2024"]', '1');
    await page.fill('input[placeholder="1"]', '12'); // 月
    await page.fill('input[placeholder="1"] >> nth=1', '31'); // 日
    await page.fill('input[placeholder="例: 5 または -3"]', '1');
    await page.click('button:has-text("計算")');
    await expect(page.locator('text=結果日付:')).toBeVisible();
    await expect(page.locator('text=1年1月1日（土）')).toBeVisible();
  });

  test('紀元後→紀元前の跨ぎ: 1年1月1日 - 1日 = 紀元前1年12月31日（金）', async ({ page }) => {
    await page.selectOption('select', 'AD');
    await page.fill('input[placeholder="例: 2024"]', '1');
    await page.fill('input[placeholder="1"]', '1'); // 月
    await page.fill('input[placeholder="1"] >> nth=1', '1'); // 日
    await page.fill('input[placeholder="例: 5 または -3"]', '-1');
    await page.click('button:has-text("計算")');
    await expect(page.locator('text=結果日付:')).toBeVisible();
    await expect(page.locator('text=紀元前1-12-31（金）')).toBeVisible();
  });

  test('不正な入力で計算ボタンが無効', async ({ page }) => {
    await page.selectOption('select', 'AD');
    await page.fill('input[placeholder="例: 2024"]', '');
    await expect(page.locator('button:has-text("計算")')).toBeDisabled();
  });
});
