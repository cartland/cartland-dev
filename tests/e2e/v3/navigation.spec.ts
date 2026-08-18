import { test, expect } from '@playwright/test'

test.describe('v3 navigation', () => {
  test('header nav links exist', async ({ page }) => {
    await page.goto('./')
    const nav = page.getByRole('navigation', { name: 'Main navigation' })
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Projects' })).toBeVisible()
  })

  test('active page is marked with aria-current', async ({ page }) => {
    await page.goto('./projects')
    const nav = page.getByRole('navigation', { name: 'Main navigation' })
    await expect(nav.getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'aria-current',
      'page'
    )
  })

  test('nav links navigate correctly', async ({ page }) => {
    await page.goto('./')
    const nav = page.getByRole('navigation', { name: 'Main navigation' })
    await nav.getByRole('link', { name: 'Projects' }).click()
    await expect(page).toHaveURL(/projects/)
    await expect(
      page.getByRole('heading', { name: 'Android Build Time' })
    ).toBeVisible()
  })

  test('footer links exist', async ({ page }) => {
    await page.goto('./')
    const footer = page.getByRole('contentinfo')
    await expect(footer.getByRole('link', { name: 'GitHub' })).toBeVisible()
    await expect(footer.getByRole('link', { name: 'Projects' })).toBeVisible()
  })

  test('nav is usable on a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('./')
    const nav = page.getByRole('navigation', { name: 'Main navigation' })
    await expect(nav.getByRole('link', { name: 'Projects' })).toBeVisible()
  })
})
