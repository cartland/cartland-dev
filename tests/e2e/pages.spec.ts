import { test, expect } from '@playwright/test'

test.describe('Page load verification', () => {
  test('home page loads with hero content', async ({ page }) => {
    await page.goto('./')
    await expect(
      page.getByText('Software Engineer and Tech Maker')
    ).toBeVisible()
    await expect(page.getByAltText('Golden Gate Bridge')).toBeVisible()
    await expect(
      page.locator('.social-item').filter({ hasText: 'LinkedIn' })
    ).toBeVisible()
    await expect(
      page.locator('.social-item').filter({ hasText: 'GitHub' })
    ).toBeVisible()
  })

  test('projects page loads with all cards', async ({ page }) => {
    await page.goto('./projects')
    await expect(
      page.getByRole('heading', { name: 'Android Build Time' })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Portfolio Website' })
    ).toBeVisible()

    // Verify all 19 project cards are present
    const cards = page.locator('.card')
    await expect(cards).toHaveCount(19)
  })

  test('temperature visualization page loads', async ({ page }) => {
    await page.goto('./temperature-visualization')
    // Wait for client-only component to hydrate
    await expect(page.locator('.temp-viz')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('#temp-visualization')).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Temperature' })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Anomaly', exact: true })
    ).toBeVisible()
  })

  test('solar calculator page loads', async ({ page }) => {
    await page.goto('./utility-vs-solar-battery')
    // Wait for client-only component to hydrate
    await expect(page.locator('.solar-calc')).toBeVisible({ timeout: 15000 })
    await expect(
      page.getByText('Utility vs. Solar + Battery: A Cost Analysis')
    ).toBeVisible()
    await expect(page.locator('canvas')).toBeVisible()
    await expect(page.locator('#duration')).toBeVisible()
  })

  test('battery butler privacy policy loads', async ({ page }) => {
    await page.goto('./battery-butler-privacy-policy')
    await expect(
      page.getByRole('heading', { name: 'Battery Butler Privacy Policy' })
    ).toBeVisible()
    await expect(page.getByText('chris@chriscart.land').first()).toBeVisible()
  })

  test('garage privacy policy loads', async ({ page }) => {
    await page.goto('./garage-privacy-policy')
    await expect(
      page.getByRole('heading', { name: 'Garage Privacy Policy' })
    ).toBeVisible()
    await expect(page.getByText('chris@chriscart.land').first()).toBeVisible()
  })

  test('404 page loads', async ({ page }) => {
    await page.goto('./404')
    await expect(page.getByText('Page Not Found')).toBeVisible()
    await expect(page.getByText('Return to homepage')).toBeVisible()
  })

  test('no console errors on home page', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('./')
    await page.waitForLoadState('networkidle')
    expect(errors).toEqual([])
  })
})
