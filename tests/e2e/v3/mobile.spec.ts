import { test, expect } from '@playwright/test'

// Horizontal overflow on small screens is a regression the desktop suite
// cannot catch; 320px is the narrowest viewport we support.
const pages = [
  './',
  './projects',
  './temperature-visualization',
  './utility-vs-solar-battery',
  './cartland-labs-privacy-policy',
]

for (const path of pages) {
  test(`no horizontal overflow at 320px on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 })
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })
}
