import { test, expect } from '@playwright/test'
import { injectAxe, getViolations } from 'axe-playwright'

// Known pre-existing violations to exclude from failure.
// These should be fixed over time and removed from this list.
const KNOWN_VIOLATION_IDS = [
  'color-contrast', // Dark theme color contrast issues
  'link-in-text-block', // Links not visually distinguished from surrounding text
  'label', // Temperature viz hex inputs missing explicit labels
]

const pages = [
  { name: 'Home', path: './' },
  { name: 'Projects', path: './projects' },
  { name: 'Solar Calculator', path: './utility-vs-solar-battery' },
  { name: 'Temperature Visualization', path: './temperature-visualization' },
  { name: 'Battery Butler Privacy', path: './battery-butler-privacy-policy' },
  { name: 'Garage Privacy', path: './garage-privacy-policy' },
  { name: '404', path: './404' },
]

for (const { name, path } of pages) {
  test(`${name} page has no critical accessibility violations`, async ({
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

    // Log known violations as warnings
    const known = violations.filter(
      (v) =>
        (v.impact === 'critical' || v.impact === 'serious') &&
        KNOWN_VIOLATION_IDS.includes(v.id)
    )
    if (known.length > 0) {
      const summary = known
        .map((v) => `[${v.impact}] ${v.id} (${v.nodes.length} nodes)`)
        .join(', ')
      console.log(`Known violations on ${name}: ${summary}`)
    }

    expect(critical).toEqual([])
  })
}
