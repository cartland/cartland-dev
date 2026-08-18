import { test, expect } from '@playwright/test'
import { injectAxe, getViolations } from 'axe-playwright'

// v3 aims for a clean axe run: no standing exclusions. If a genuinely
// unavoidable violation appears, document it here with a reason.
const KNOWN_VIOLATION_IDS: string[] = []

const pages = [
  { name: 'Home', path: './' },
  { name: 'Projects', path: './projects' },
  { name: 'Solar Calculator', path: './utility-vs-solar-battery' },
  { name: 'Temperature Visualization', path: './temperature-visualization' },
  { name: 'Battery Butler Privacy', path: './battery-butler-privacy-policy' },
  { name: 'Cartland Labs Privacy', path: './cartland-labs-privacy-policy' },
  { name: 'Garage Privacy', path: './garage-privacy-policy' },
  { name: '404', path: './404' },
]

for (const { name, path } of pages) {
  test(`v3 ${name} page has no critical accessibility violations`, async ({
    page,
  }) => {
    await page.goto(path)
    await page.waitForLoadState('networkidle')

    await injectAxe(page)
    const violations = await getViolations(page, null, {
      axeOptions: {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
      },
    })

    const critical = violations.filter(
      (v) =>
        (v.impact === 'critical' || v.impact === 'serious') &&
        !KNOWN_VIOLATION_IDS.includes(v.id)
    )

    if (critical.length > 0) {
      const summary = critical
        .map(
          (v) =>
            `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} nodes)`
        )
        .join('\n')
      console.log(`Accessibility issues on ${name}:\n${summary}`)
    }

    expect(critical).toEqual([])
  })
}
