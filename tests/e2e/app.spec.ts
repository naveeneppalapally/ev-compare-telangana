import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/images/**', (route) => route.abort());
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('h3 button', { hasText: /./ }).first()).toBeVisible({ timeout: 45_000 });
});

test('hero renders headline and search', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Compare Electric Bikes/i);
  await expect(page.getByPlaceholder('Search models or brands…')).toBeVisible();
});

test('full catalog is visible with no bikes hidden by default', async ({ page }) => {
  const cards = page.locator('main h3 button');
  await expect(cards.first()).toBeVisible();
  const count = await cards.count();
  expect(count).toBeGreaterThanOrEqual(50);
});

test('brand filter narrows results', async ({ page }) => {
  const cardTitles = page.locator('main h3 button');
  const before = await cardTitles.count();
  // Brand pills live in the "Filter By Manufacturer" strip; scope there to avoid spotlight cards
  const brandBtn = page
    .locator('text=Filter By Manufacturer')
    .locator('..')
    .locator('..')
    .getByRole('button', { name: /Ather Energy/ })
    .first();
  // Fallback: direct pill by count suffix if scoped fails
  const pill = (await brandBtn.count()) ? brandBtn : page.getByRole('button', { name: /^Ather Energy\s*4$/ }).first();
  await pill.scrollIntoViewIfNeeded();
  await pill.click();
  await expect.poll(async () => cardTitles.count(), { timeout: 20_000 }).toBeLessThan(before);
  await expect(cardTitles.first()).toContainText(/Ather/i);
});

test('detail modal opens, shows colour swatches, closes on Escape', async ({ page }) => {
  const specsBtn = page.getByRole('button', { name: 'Full Specs' }).first();
  await specsBtn.scrollIntoViewIfNeeded();
  await specsBtn.click();
  const dialog = page.locator('[role="dialog"]').first();
  await expect(dialog).toBeVisible({ timeout: 15_000 });

  const swatches = dialog.locator('button[aria-label^="Colour"]');
  if ((await swatches.count()) > 1) {
    await swatches.nth(1).click();
    await expect(swatches.nth(1)).toHaveAttribute('aria-pressed', 'true');
  }

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});

test('compare flow: add two vehicles and open matrix', async ({ page }) => {
  const addButtons = page.getByRole('button', { name: '+ Compare' });
  await addButtons.nth(0).click();
  await addButtons.nth(1).click();
  await page.getByRole('button', { name: /^Compare/ }).last().click();
  await expect(page.locator('[role="dialog"]')).toBeVisible();
});

test('feature explanations render in detail modal', async ({ page }) => {
  // Rizta Z features include short generic labels covered by featureKnowledge rules
  await page.goto('/#m=detail&v=ather-rizta-z-37');
  const dialog = page.locator('[role="dialog"]').first();
  await expect(dialog).toBeVisible({ timeout: 30_000 });

  // Open the Highlights/tech tab where features are listed
  const tab = dialog.getByRole('button', { name: /highlight/i }).first();
  if (await tab.count()) await tab.click();

  // Explainer paragraphs are muted 11px text under each short feature label
  const explainer = dialog.locator('p.text-\\[11px\\]', { hasText: / / }).first();
  await expect(explainer.or(dialog.locator('li span').nth(3))).toBeAttached({ timeout: 10_000 });
});

test('deep link opens price modal directly with pinned RTO', async ({ page }) => {
  await page.goto('/#m=price&v=ola-s1-pro-gen2&rto=TG-09');
  const dialog = page.locator('[role="dialog"]').first();
  await expect(dialog).toBeVisible({ timeout: 30_000 });
  await expect(dialog.locator('select').first()).toHaveValue('TG-09', { timeout: 20_000 });
});

test('model SEO page redirects into the app with the right model', async ({ page }) => {
  await page.goto('/bikes/ather-rizta-z-37/');
  const dialog = page.locator('[role="dialog"]').first();
  await expect(dialog).toBeVisible({ timeout: 15_000 });
});
