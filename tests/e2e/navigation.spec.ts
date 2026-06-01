import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('nav links exist', async ({ page }) => {
    await page.goto('./')
    const nav = page.locator('.VPNavBarMenu')
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Projects' })).toBeVisible()
  })

  test('social links in nav bar', async ({ page }) => {
    await page.goto('./')
    // VitePress renders social links - use first() since there may be duplicates for mobile/desktop
    await expect(
      page.locator('a[href="https://github.com/cartland"]').first()
    ).toBeVisible()
  })

  test('nav links navigate correctly', async ({ page }) => {
    await page.goto('./')
    const nav = page.locator('.VPNavBarMenu')
    await nav.getByRole('link', { name: 'Projects' }).click()
    await expect(page).toHaveURL(/projects/)
    await expect(
      page.getByRole('heading', { name: 'Android Build Time' })
    ).toBeVisible()
  })

  test('mobile viewport shows hamburger menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('./')
    // VitePress uses a hamburger button on mobile
    const hamburger = page.locator('.VPNavBarHamburger')
    await expect(hamburger).toBeVisible()
  })
})
