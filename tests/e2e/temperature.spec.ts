import { test, expect } from '@playwright/test'

test.describe('Temperature visualization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./temperature-visualization')
    // Wait for client-only component to hydrate
    await expect(page.locator('.temp-viz')).toBeVisible({ timeout: 15000 })
  })

  test('grid renders with cells', async ({ page }) => {
    // Wait for data to load and grid to render
    await page.waitForSelector('.temp-bar', { timeout: 15000 })
    const cells = page.locator('.temp-bar')
    // Should have many cells (12 months * ~175 years)
    expect(await cells.count()).toBeGreaterThan(100)
  })

  test('mode buttons switch visualization', async ({ page }) => {
    await page.waitForSelector('.temp-bar', { timeout: 15000 })

    // Click Anomaly mode
    await page.getByRole('button', { name: 'Anomaly', exact: true }).click()
    // Verify the anomaly button becomes active
    const anomalyBtn = page.getByRole('button', {
      name: 'Anomaly',
      exact: true,
    })
    await expect(anomalyBtn).toHaveClass(/active/)
  })

  test('color picker sliders exist', async ({ page }) => {
    await expect(page.locator('.color-picker-container')).toBeVisible()
    // 5 color stops x 3 sliders = 15 range inputs
    const sliders = page.locator('.color-picker-container input[type="range"]')
    await expect(sliders).toHaveCount(15)
  })

  test('color preset buttons change hex inputs', async ({ page }) => {
    await page.waitForSelector('.temp-bar', { timeout: 15000 })

    const lowHexBefore = await page.locator('#low-hex-input').inputValue()
    await page.getByRole('button', { name: 'Greyscale Colors' }).click()
    // Wait for the color preset to load
    await page.waitForTimeout(500)
    const lowHexAfter = await page.locator('#low-hex-input').inputValue()
    expect(lowHexBefore).not.toEqual(lowHexAfter)
  })
})
