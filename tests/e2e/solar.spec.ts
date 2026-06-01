import { test, expect } from '@playwright/test'

test.describe('Solar calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./utility-vs-solar-battery')
    // Wait for client-only component to hydrate
    await expect(page.locator('.solar-calc')).toBeVisible({ timeout: 15000 })
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

  test('changing duration updates summary', async ({ page }) => {
    const summaryBefore = await page.locator('.savings-value').textContent()
    await page.locator('#duration').fill('20')
    await page.locator('#duration').press('Tab')
    // Wait for reactivity
    await page.waitForTimeout(300)
    const summaryAfter = await page.locator('.savings-value').textContent()
    expect(summaryBefore).not.toEqual(summaryAfter)
  })

  test('Restore Defaults resets inputs', async ({ page }) => {
    await page.locator('#duration').fill('10')
    await page.locator('#duration').press('Tab')
    await page.getByText('Restore Defaults').click()
    await expect(page.locator('#duration')).toHaveValue('30')
  })

  test('Share button shows shareable link', async ({ page }) => {
    // Grant clipboard permission
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.locator('.btn-share').click()
    await expect(page.locator('.shareable-link-container')).toBeVisible()
    const linkInput = page.locator('.shareable-link-container input')
    const linkValue = await linkInput.inputValue()
    expect(linkValue).toContain('utility-vs-solar-battery')
  })

  test('URL params populate inputs', async ({ page }) => {
    await page.goto('./utility-vs-solar-battery?d=20&ocr=5')
    await expect(page.locator('.solar-calc')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('#duration')).toHaveValue('20')
    await expect(page.locator('#opportunityCostRate')).toHaveValue('5')
  })
})
