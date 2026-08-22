import { test, expect } from '@playwright/test'

test.describe('v3 media optimization', () => {
  test('Marauders Map is a video; the legacy GIF is never requested', async ({
    page,
  }) => {
    const gifRequests: string[] = []
    page.on('request', (r) => {
      if (r.url().includes('MaraudersMap.gif')) gifRequests.push(r.url())
    })
    await page.goto('./projects')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForLoadState('networkidle')
    await expect(page.locator('#marauders-map video')).toBeVisible()
    expect(gifRequests).toEqual([])
  })

  test('card images are served as optimized webp from the build pipeline', async ({
    page,
  }) => {
    await page.goto('./projects')
    const src = await page
      .locator('#android-build-time img')
      .getAttribute('src')
    expect(src).toContain('/_astro/')
    expect(src).toContain('.webp')
  })

  test('home hero image is optimized and responsive', async ({ page }) => {
    await page.goto('./')
    const img = page.getByAltText('Golden Gate Bridge')
    await expect(img).toBeVisible()
    expect(await img.getAttribute('srcset')).toContain('.webp')
  })
})
