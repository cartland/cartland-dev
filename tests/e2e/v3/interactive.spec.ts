import { test, expect } from '@playwright/test'

test.describe('v3 temperature visualization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./temperature-visualization')
    await page.waitForSelector('.temp-bar', { timeout: 15000 })
  })

  test('grid renders with cells', async ({ page }) => {
    // 12 months x ~175 years of data.
    expect(await page.locator('.temp-bar').count()).toBeGreaterThan(100)
  })

  test('mode buttons switch visualization', async ({ page }) => {
    const anomalyBtn = page.getByRole('button', {
      name: 'Anomaly',
      exact: true,
    })
    await anomalyBtn.click()
    await expect(anomalyBtn).toHaveClass(/active/)
    await expect(page.locator('#description-text')).toContainText('anomalies')
  })

  test('color picker sliders exist behind the disclosure', async ({ page }) => {
    await page.getByText('Customize colors').click()
    // 5 color stops x 3 sliders = 15 range inputs.
    await expect(page.locator('.picker-row input[type="range"]')).toHaveCount(
      15
    )
  })

  test('color preset buttons change hex inputs', async ({ page }) => {
    await page.getByText('Customize colors').click()
    const lowHexBefore = await page.locator('#low-hex-input').inputValue()
    await page.getByRole('button', { name: 'Greyscale Colors' }).click()
    await expect(page.locator('#low-hex-input')).not.toHaveValue(lowHexBefore)
  })
})

test.describe('v3 solar calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./utility-vs-solar-battery')
    await expect(page.locator('#savings-value')).not.toBeEmpty()
  })

  test('default input values are correct', async ({ page }) => {
    await expect(page.locator('#duration')).toHaveValue('30')
    await expect(page.locator('#opportunityCostRate')).toHaveValue('4')
    await expect(page.locator('#initialUtilityCost')).toHaveValue('2400')
    await expect(page.locator('#utilityCostIncrease')).toHaveValue('2')
    await expect(page.locator('#solarCostBase')).toHaveValue('10200')
    await expect(page.locator('#solarLife')).toHaveValue('30')
    await expect(page.locator('#batteryCostBase')).toHaveValue('14500')
    await expect(page.locator('#batteryLife')).toHaveValue('10')
    await expect(page.locator('#batteryCostDecrease')).toHaveValue('30')
    await expect(page.locator('#unavoidableUtilityPercent')).toHaveValue('20')
  })

  test('computes the documented default savings', async ({ page }) => {
    await expect(page.locator('#savings-value')).toHaveText('$28,948')
    await expect(page.locator('#savings-label')).toHaveText(
      'Savings with Solar + Battery'
    )
  })

  test('changing duration updates summary', async ({ page }) => {
    const before = await page.locator('#savings-value').textContent()
    await page.locator('#duration').fill('20')
    await expect(page.locator('#savings-value')).not.toHaveText(before ?? '')
  })

  test('Restore Defaults resets inputs', async ({ page }) => {
    await page.locator('#duration').fill('10')
    await page.getByRole('button', { name: 'Restore Defaults' }).click()
    await expect(page.locator('#duration')).toHaveValue('30')
  })

  test('Share button shows shareable link', async ({ page }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.locator('#share-btn').click()
    await expect(page.locator('#shareable-link-container')).toBeVisible()
    const linkValue = await page.locator('#shareable-link').inputValue()
    expect(linkValue).toContain('utility-vs-solar-battery')
    expect(linkValue).toContain('d=30')
  })

  test('URL params populate inputs', async ({ page }) => {
    await page.goto('./utility-vs-solar-battery?d=20&ocr=5')
    await expect(page.locator('#duration')).toHaveValue('20')
    await expect(page.locator('#opportunityCostRate')).toHaveValue('5')
  })
})
